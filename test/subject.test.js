/* global describe it */

module.exports = (server, assert) => {
  describe('Subject test', () => {
    it('Get /subject should return 200', (done) => {
      server
        .get('/subject')
        .expect(200)
        .end((err, resp) => {
          if (err) return done(err);
          assert.equal(resp.status, 200);
          assert.isObject(resp.body);
          return done();
        });
    });
  });
};
