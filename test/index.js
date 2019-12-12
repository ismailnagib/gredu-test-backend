/* global before after */
const supertest = require('supertest');
const { assert } = require('chai');
const app = require('../app/server');

const server = supertest(app);

const dataTest = {
  objectId: '5df11229fcc217fe681b9078',
};

before(done => done());

require('./ping.test')(server, assert, dataTest);
require('./schedule.test')(server, assert, dataTest);
require('./student.test')(server, assert, dataTest);
require('./subject.test')(server, assert, dataTest);

after(async (done) => {
  try {
    return done();
  } catch (error) {
    throw error;
  }
});
