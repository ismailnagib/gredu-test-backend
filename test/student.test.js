/* global describe it */

module.exports = (server, assert, dataTest = {}) => {
  describe('Student test', () => {
    it('Get /student should return 200', (done) => {
      server
        .get('/student')
        .expect(200)
        .end((err, resp) => {
          if (err) return done(err);
          assert.equal(resp.status, 200);
          assert.isObject(resp.body);
          return done();
        });
    });

    it('Get /student/:id should return 200', (done) => {
      server
        .get(`/student/${dataTest.objectId}`)
        .expect(200)
        .end((err, resp) => {
          if (err) return done(err);
          assert.equal(resp.status, 200);
          assert.isObject(resp.body);
          return done();
        });
    });

    it('Get /student/distribution should return 200', (done) => {
      server
        .get('/student/distribution')
        .expect(200)
        .end((err, resp) => {
          if (err) return done(err);
          assert.equal(resp.status, 200);
          assert.isObject(resp.body);
          return done();
        });
    });

    it('Get /student/summary/:id should return 200', (done) => {
      server
        .get(`/student/summary/${dataTest.objectId}`)
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
