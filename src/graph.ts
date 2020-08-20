import { BaseLabel, FlagLabel, getValueName, StateLabel } from './labels';
import { ChangeVerb } from './resolve';
import { defaultTo, defaultUntil } from './utils';

const COLOR_NODE = 'cccccc';
const COLOR_MIDNODE = 'aaaaaa';

export interface Node {
  color: string;
  name: string;
}

export interface Edge {
  source: string;
  target: string;
  type: ChangeVerb;
}

export interface Graph {
  edges: Array<Edge>;
  name: string;
  nodes: Array<Node>;
  subs: Array<Graph>;
}

export interface GraphOptions {
  flags: Array<FlagLabel>;
  name: string;
  states: Array<StateLabel>;
}

function labelEdges(label: BaseLabel, edges: Array<Edge>) {
  for (const add of label.adds) {
    edges.push({
      source: label.name,
      target: add.name,
      type: ChangeVerb.CREATED,
    });
  }

  for (const remove of label.removes) {
    edges.push({
      source: label.name,
      target: remove.name,
      type: ChangeVerb.REMOVED,
    });
  }

  for (const require of label.requires) {
    edges.push({
      source: label.name,
      target: require.name,
      type: ChangeVerb.REQUIRED,
    });
  }
}

export function graphLabels(options: GraphOptions): Graph {
  const edges: Array<Edge> = [];
  const nodes: Array<Node> = [];

  for (const flag of options.flags) {
    nodes.push({
      color: defaultTo(flag.color, COLOR_NODE),
      name: flag.name,
    });

    labelEdges(flag, edges);
  }

  const subs: Array<Graph> = [];
  for (const state of options.states) {
    const sub: Graph = {
      edges: [],
      name: state.name,
      nodes: [],
      subs: [],
    };

    for (const value of state.values) {
      const name = getValueName(state, value);
      sub.nodes.push({
        color: defaultUntil(value.color, state.color, COLOR_NODE),
        name,
      });

      labelEdges({
        ...value,
        name,
      }, edges);

      for (const otherValue of state.values) {
        if (value !== otherValue) {
          const otherName = getValueName(state, otherValue);
          sub.edges.push({
            source: name,
            target: otherName,
            type: ChangeVerb.CONFLICTED,
          });
        }
      }

      for (const become of value.becomes) {
        const matchNames = become.matches.map((it) => it.name).join(',');
        const matchLabel = `${name} with (${matchNames})`;

        sub.nodes.push({
          color: COLOR_MIDNODE,
          name: matchLabel,
        });

        sub.edges.push({
          source: name,
          target: matchLabel,
          type: ChangeVerb.BECAME,
        });

        labelEdges({
          adds: become.adds,
          name: matchLabel,
          priority: value.priority,
          removes: become.removes,
          requires: become.matches,
        }, sub.edges);
      }
    }

    subs.push(sub);
  }

  return {
    edges,
    name: options.name,
    nodes,
    subs,
  };
}

export function cleanName(name: string): string {
  return name.replace(/[^a-z0-9_]/g, '_').replace(/(^_|_$|__)/g, '');
}

export function edgeStyle(edge: Edge) {
  switch (edge.type) {
    case ChangeVerb.BECAME:
      return '[arrowhead="onormal" color="purple"]';
    case ChangeVerb.CREATED:
      return '[color="green"]';
    case ChangeVerb.EXISTING:
      return '[color="gray" weight=0.1]';
    case ChangeVerb.REMOVED:
      return '[color="red"]';
    case ChangeVerb.CONFLICTED:
      return '[color="orange" weight=0.1]';
    case ChangeVerb.REQUIRED:
      return '[arrowhead="onormal" color="blue"]';
    default:
      return '';
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
  for (const sub of graph.subs) {
    const subName = cleanName(sub.name);
    lines.push(`subgraph cluster_${subName} {`);
    lines.push(`label = "${subName}";`);
    lines.push('color = gray');

    for (const edge of sub.edges) {
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
  for (const edge of graph.edges) {
    const source = cleanName(edge.source);
    const target = cleanName(edge.target);
    lines.push(`${source} -> ${target} ${edgeStyle(edge)};`);
  }

  lines.push('}');
  return lines.join('\n');
}
