/* global before after */
const supertest = require('supertest');
const { assert } = require('chai');
const app = require('../app/server');

const server = supertest(app);

const dataTest = {};

before(done => done());

require('./ping.test')(server, assert, dataTest);

after(async (done) => {
  try {
    return done();
  } catch (error) {
    throw error;
  }
});
