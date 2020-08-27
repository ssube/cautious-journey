import { expect } from 'chai';

import { Edge, labelEdges, EdgeType, dotGraph, graphProject, cleanName, edgeStyle } from '../src/graph';
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

  describe('graph labels', () => {
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
});
