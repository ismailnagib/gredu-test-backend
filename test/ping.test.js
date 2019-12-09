/* global describe it */

module.exports = (server, assert) => {
  describe('Initial test', () => {
    it('Get /ping should return 200', (done) => {
      server
        .get('/ping')
        .expect(200)
        .end((err, resp) => {
          if (err) return done(err);

          assert.equal(resp.status, 200);
          return done();
        });
    });
  });
};
