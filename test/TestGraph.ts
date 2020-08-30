import { expect } from 'chai';

import {
  cleanName,
  COLOR_CHANGE,
  COLOR_LABEL,
  dotGraph,
  Edge,
  edgeStyle,
  EdgeType,
  graphChange,
  graphProject,
  graphState,
  labelEdges,
  mergeEdges,
} from '../src/graph';
import { ChangeVerb } from '../src/resolve';

describe('graph tools', () => {
  describe('label edges', () => {
    it('should include rule labels', () => {
      const edges: Array<Edge> = [];

      labelEdges({
        adds: [{
          name: 'foo',
        }],
        name: 'source',
        priority: 1,
        removes: [{
          name: 'bar',
        }],
        requires: [{
          name: 'bin',
        }],
      }, edges);

      const EXPECTED_EDGES = 3;
      expect(edges).to.be.an.instanceOf(Array).and.to.have.lengthOf(EXPECTED_EDGES);
      expect(edges).to.deep.include({
        source: 'source',
        target: 'foo',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      });
      expect(edges).to.deep.include({
        source: 'source',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.REMOVED,
      });
      expect(edges).to.deep.include({
        source: 'source',
        target: 'bin',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.REQUIRED,
      });
    });
  });

  describe('graph project', () => {
    it('should create nodes for each label', () => {
      const graph = graphProject({
        flags: [{
          adds: [],
          color: 'aabbcc',
          name: 'foo',
          priority: 0,
          removes: [],
          requires: [],
        }],
        name: '',
        states: [],
      });

      expect(graph.nodes).to.be.an.instanceOf(Array);
      expect(graph.nodes).to.deep.include({
        color: 'aabbcc',
        name: 'foo',
      });
    });

    it('should create children for each state', () => {
      const graph = graphProject({
        flags: [],
        name: '',
        states: [{
          adds: [],
          divider: '/',
          name: 'foo',
          priority: 1,
          removes: [],
          requires: [],
          values: [],
        }, {
          adds: [],
          divider: '/',
          name: 'bar',
          priority: 1,
          removes: [],
          requires: [],
          values: [],
        }],
      });

      const EXPECTED_CHILDREN = 2;
      expect(graph.children).to.have.lengthOf(EXPECTED_CHILDREN);
    });

    it('should create edges for each change rule');
    it('should create edges for each state change');
  });

  describe('clean name', () => {
    it('should remove special characters', () => {
      expect(cleanName('$foo')).to.equal('foo');
      expect(cleanName('foo$')).to.equal('foo');
      expect(cleanName('foo$bar')).to.equal('foo_bar');
    });

    it('should remove duplicate escape characters', () => {
      expect(cleanName('foo$$bar')).to.equal('foo_bar');
      expect(cleanName('foo__bar')).to.equal('foo_bar');
    });
  });

  describe('edge style', () => {
    it('should color edges', () => {
      expect(edgeStyle({
        source: 'foo',
        target: 'bar',
        type: EdgeType.BOTH,
        verb: ChangeVerb.CREATED,
      })).to.include('color=');
    });
  });

  describe('node style', () => {
    it('should label nodes');
    it('should color nodes');
  });

  describe('dot formatter', () => {
    it('should print nodes', () => {
      const graph = dotGraph({
        children: [],
        edges: [],
        name: '',
        nodes: [{
          color: '',
          name: 'foo',
        }, {
          color: '',
          name: 'bar',
        }],
      });

      expect(graph).to.include('foo [color=');
      expect(graph).to.include('bar [color=');
    });

    it('should print edges', () => {
      const graph = dotGraph({
        children: [],
        edges: [{
          source: 'foo',
          target: 'bar',
          type: EdgeType.BOTH,
          verb: ChangeVerb.CREATED,
        }],
        name: '',
        nodes: [],
      });

      expect(graph).to.include('foo -> bar');
    });

    it('should cluster children', () => {
      const graph = dotGraph({
        children: [{
          children: [],
          edges: [],
          name: 'foo',
          nodes: [],
        }],
        edges: [],
        name: 'bar',
        nodes: [],
      });

      expect(graph).to.include('subgraph cluster_foo');
    });

    it('should label the root digraph', () => {
      const graph = dotGraph({
        children: [],
        edges: [],
        name: 'foo',
        nodes: [],
      });

      expect(graph).to.include('digraph foo');
    });
  });

  describe('merge edges helper', () => {
    it('should merge opposing edges', () => {
      const edges = mergeEdges([{
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }, {
        source: 'bar',
        target: 'foo',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }]);

      expect(edges).to.have.lengthOf(1).and.to.deep.include({
        source: 'foo',
        target: 'bar',
        type: EdgeType.BOTH,
        verb: ChangeVerb.CREATED,
      });
    });

    it('should merge identical edges', () => {
      const edges = mergeEdges([{
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }, {
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }]);

      expect(edges).to.have.lengthOf(1).and.to.deep.include({
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      });
    });

    it('should prefer both type to forward', () => {
      const edges = mergeEdges([{
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }, {
        source: 'bar',
        target: 'foo',
        type: EdgeType.BOTH,
        verb: ChangeVerb.CREATED,
      }]);

      expect(edges).to.have.lengthOf(1).and.to.deep.include({
        source: 'foo',
        target: 'bar',
        type: EdgeType.BOTH,
        verb: ChangeVerb.CREATED,
      });
    });

    it('should not merge different verbs', () => {
      const edges = mergeEdges([{
        source: 'foo',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      }, {
        source: 'bar',
        target: 'foo',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.REQUIRED,
      }]);

      const EXPECTED_EDGES = 2;
      expect(edges).to.have.lengthOf(EXPECTED_EDGES);
    });
  });

  describe('graph change', () => {
    it('should add state change node', () => {
      const graph = {
        children: [],
        edges: [],
        name: '',
        nodes: [],
      };
      graphChange(graph, {
        adds: [],
        matches: [{
          name: 'bar',
        }, {
          name: 'bin',
        }],
        removes: [],
      }, 'foo', 0);

      expect(graph.nodes).to.have.lengthOf(1).and.to.deep.include({
        color: COLOR_CHANGE,
        name: 'foo with (bar,bin)',
      });
    });

    it('should add state change edge', () => {
      const graph = {
        children: [],
        edges: [],
        name: '',
        nodes: [],
      };
      graphChange(graph, {
        adds: [],
        matches: [{
          name: 'bar',
        }, {
          name: 'bin',
        }],
        removes: [],
      }, 'foo', 0);

      const EXPECTED_EDGES = 3;
      expect(graph.edges).to.have.lengthOf(EXPECTED_EDGES).and.to.deep.include({
        source: 'foo',
        target: 'foo with (bar,bin)',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.BECAME,
      });
    });

    it('should add normal edges', () => {
      const graph = {
        children: [],
        edges: [],
        name: '',
        nodes: [],
      };
      graphChange(graph, {
        adds: [{
          name: 'bar',
        }],
        matches: [],
        removes: [{
          name: 'bin',
        }],
      }, 'foo', 0);

      const EXPECTED_EDGES = 3;
      expect(graph.edges).to.have.lengthOf(EXPECTED_EDGES).and.to.deep.include({
        source: 'foo with ()',
        target: 'bar',
        type: EdgeType.FORWARD,
        verb: ChangeVerb.CREATED,
      });
    });
  });

  describe('graph state', () => {
    it('should create a node for each value', () => {
      const graph = graphState({
        adds: [],
        divider: '/',
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
        values: [{
          adds: [],
          becomes: [],
          name: 'bar',
          priority: 1,
          removes: [],
          requires: [],
        }, {
          adds: [],
          becomes: [],
          name: 'bin',
          priority: 1,
          removes: [],
          requires: [],
        }],
      });

      const EXPECTED_NODES = 2;
      expect(graph.nodes).to.have.lengthOf(EXPECTED_NODES);
    });

    it('should create exhaustive edges between values', () => {
      const value = {
        adds: [],
        becomes: [],
        priority: 1,
        removes: [],
        requires: [],
      };
      const graph = graphState({
        adds: [],
        divider: '/',
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
        values: [{
          ...value,
          name: 'a',
        }, {
          ...value,
          name: 'b',
        }, {
          ...value,
          name: 'c',
        }, {
          ...value,
          name: 'd',
        }],
      });

      const EXPECTED_EDGES = 12; // not merged, so 3 from each
      expect(graph.edges).to.have.lengthOf(EXPECTED_EDGES);
    });

    it('should include potential state changes', () => {
      const graph = graphState({
        adds: [],
        divider: '/',
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
        values: [{
          adds: [],
          becomes: [{
            adds: [{
              name: 'new',
            }],
            matches: [{
              name: 'test',
            }],
            removes: [],
          }],
          name: 'bar',
          priority: 1,
          removes: [],
          requires: [],
        }, {
          adds: [],
          becomes: [],
          name: 'bin',
          priority: 1,
          removes: [],
          requires: [],
        }],
      });

      expect(graph.nodes).to.deep.include({
        color: COLOR_CHANGE,
        name: 'foo/bar with (test)',
      }).and.to.include({
        color: COLOR_LABEL,
        name: 'foo/bin',
      });
    });
  });
});
