describe('graph tools', () => {
  describe('label edges', () => {
    it('should include rule labels');
  });

  describe('graph labels', () => {
    it('should create nodes for each label');
    it('should create edges for each change rule');
    it('should create edges for each state change');
  });

  describe('clean name', () => {
    it('should remove special characters');
    it('should remove duplicate escape characters');
  });

  describe('edge style', () => {
    it('should color edges');
  });

  describe('node style', () => {
    it('should label nodes');
    it('should color nodes');
  });

  describe('dot formatter', () => {
    it('should print nodes');
    it('should print edges');
    it('should cluster flags');
    it('should cluster states');
    it('should label the root digraph');
  });
});
