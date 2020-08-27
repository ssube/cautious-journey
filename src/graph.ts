import { mustExist } from '@apextoaster/js-utils';

import { BaseLabel, FlagLabel, getValueName, StateChange, StateLabel } from './labels';
import { ChangeVerb } from './resolve';
import { defaultTo, defaultUntil } from './utils';

const COLOR_CHANGE = 'aaaaaa';
const COLOR_LABEL = 'cccccc';

export enum EdgeType {
  /**
   * Both directions, arrows on both ends.
   */
  BOTH = 'both',

  /**
   * Source to target, arrow at target.
   */
  FORWARD = 'forward',
}

export interface Node {
  color: string;
  name: string;
}

export interface Edge {
  source: string;
  target: string;
  type: EdgeType;
  verb: ChangeVerb;
}

export interface Graph {
  children: Array<Graph>;
  edges: Array<Edge>;
  name: string;
  nodes: Array<Node>;
}

export interface GraphOptions {
  flags: Array<FlagLabel>;
  name: string;
  states: Array<StateLabel>;
}

export function labelEdges(label: BaseLabel, edges: Array<Edge>) {
  for (const add of label.adds) {
    edges.push({
      source: label.name,
      target: add.name,
      type: EdgeType.FORWARD,
      verb: ChangeVerb.CREATED,
    });
  }

  for (const remove of label.removes) {
    edges.push({
      source: label.name,
      target: remove.name,
      type: EdgeType.FORWARD,
      verb: ChangeVerb.REMOVED,
    });
  }

  for (const require of label.requires) {
    edges.push({
      source: label.name,
      target: require.name,
      type: EdgeType.FORWARD,
      verb: ChangeVerb.REQUIRED,
    });
  }
}

export function mergeEdges(edges: Array<Edge>): Array<Edge> {
  const uniqueEdges = new Map<string, Edge>();

  for (const edge of edges) {
    const sortedNodes = [edge.source, edge.target].sort();
    const dirName = [edge.verb, ...sortedNodes].join(':');

    if (uniqueEdges.has(dirName)) {
      const prevEdge = mustExist(uniqueEdges.get(dirName));
      if (edge.type !== prevEdge.type || edge.source !== prevEdge.source) {
        prevEdge.type = EdgeType.BOTH;
      }
    } else {
      uniqueEdges.set(dirName, edge);
    }
  }

  return Array.from(uniqueEdges.values());
}

export function graphChange(root: Graph, change: StateChange, name: string, priority: number): void {
  const matchNames = change.matches.map((it) => it.name).join(',');
  const matchLabel = `${name} with (${matchNames})`;

  root.nodes.push({
    color: COLOR_CHANGE,
    name: matchLabel,
  });

  root.edges.push({
    source: name,
    target: matchLabel,
    type: EdgeType.FORWARD,
    verb: ChangeVerb.BECAME,
  });

  labelEdges({
    adds: change.adds,
    name: matchLabel,
    priority,
    removes: change.removes,
    requires: change.matches,
  }, root.edges);
}

export function graphState(state: StateLabel): Graph {
  const child: Graph = {
    children: [],
    edges: [],
    name: state.name,
    nodes: [],
  };

  for (const value of state.values) {
    const name = getValueName(state, value);
    const priority = defaultUntil(value.priority, state.priority, 0);

    child.nodes.push({
      color: defaultUntil(value.color, state.color, COLOR_LABEL),
      name,
    });

    labelEdges({
      ...value,
      name,
    }, child.edges);

    for (const otherValue of state.values) {
      if (value !== otherValue) {
        const otherName = getValueName(state, otherValue);
        child.edges.push({
          source: name,
          target: otherName,
          type: EdgeType.FORWARD,
          verb: ChangeVerb.CONFLICTED,
        });
      }
    }

    for (const change of value.becomes) {
      graphChange(child, change, name, priority);
    }
  }

  return child;
}

export function graphProject(options: GraphOptions): Graph {
  const root: Graph = {
    children: [],
    edges: [],
    name: options.name,
    nodes: [],
  };

  for (const flag of options.flags) {
    root.nodes.push({
      color: defaultTo(flag.color, COLOR_LABEL),
      name: flag.name,
    });

    labelEdges(flag, root.edges);
  }

  for (const state of options.states) {
    const child = graphState(state);
    root.children.push(child);
  }

  return root;
}

export function cleanName(name: string): string {
  return name.replace(/[^a-z0-9_]/g, '_').replace('__', '_').replace(/(^_|_$)/g, '');
}

export function edgeColor(verb: ChangeVerb): string {
  switch (verb) {
    case ChangeVerb.BECAME:
      return 'purple';
    case ChangeVerb.CONFLICTED:
      return 'orange';
    case ChangeVerb.CREATED:
      return 'green';
    case ChangeVerb.REMOVED:
      return 'red';
    case ChangeVerb.REQUIRED:
      return 'blue';
    default:
      return 'gray';
  }
}

export function edgeStyle(edge: Edge) {
  const color = edgeColor(edge.verb);
  const dir = edge.type;

  switch (edge.verb) {
    case ChangeVerb.BECAME:
    case ChangeVerb.REQUIRED:
      return `[dir="${dir}" color="${color}" arrowhead="onormal"]`;
    case ChangeVerb.CONFLICTED:
      return `[dir="${dir}" color="${color}" weight=0.1]`;
    case ChangeVerb.CREATED:
      return `[dir="${dir}" color="${color}" weight=0.8]`;
    case ChangeVerb.REMOVED:
    default:
      return `[dir="${dir}" color="${color}"]`;
  }
}

export function dotGraph(graph: Graph): string {
  const lines = [];
  const name = cleanName(graph.name);
  lines.push(`digraph ${name} {`);

  // flag nodes
  lines.push('subgraph cluster_flags {');
  lines.push('label = "flags";');
  lines.push('color = gray');

  for (const node of graph.nodes) {
    const nodeName = cleanName(node.name);
    lines.push(`${nodeName} [color="#${node.color}" label="${node.name}" style=filled];`);
  }

  lines.push('}');

  // state clusters
  for (const sub of graph.children) {
    const subName = cleanName(sub.name);
    lines.push(`subgraph cluster_${subName} {`);
    lines.push(`label = "${subName}";`);
    lines.push('color = gray');

    for (const edge of mergeEdges(sub.edges)) {
      const source = cleanName(edge.source);
      const target = cleanName(edge.target);
      lines.push(`${source} -> ${target} ${edgeStyle(edge)};`);
    }

    for (const node of sub.nodes) {
      const nodeName = cleanName(node.name);
      lines.push(`${nodeName} [color="#${node.color}" label="${node.name}" style=filled];`);
    }

    lines.push('}');
  }

  // remaining edges
  for (const edge of mergeEdges(graph.edges)) {
    const source = cleanName(edge.source);
    const target = cleanName(edge.target);
    lines.push(`${source} -> ${target} ${edgeStyle(edge)};`);
  }

  lines.push('}');
  return lines.join('\n');
}
