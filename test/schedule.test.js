/* global describe it */

module.exports = (server, assert) => {
  describe('Schedule test', () => {
    it('Get /schedule should return 200', (done) => {
      server
        .get('/schedule')
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
