/* eslint-disable no-console */
const extend = require('extend');
const mongoose = require('mongoose');

module.exports = (config) => {
  mongoose.Promise = global.Promise;

  async function run() {
    const opt = {
      poolSize: 10,
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      w: 'majority',
      wtimeout: 10000,
      j: true,
      autoIndex: false,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };

    const options = extend({}, opt, config);

    delete options.url;

    await mongoose.connect(config.url, options);

    mongoose.connection.on('error', (err) => {
      console.error(`✗ MongoDB Connection is Error. Please make sure MongoDB is running. -> ${err}`);
      throw err;
    });

    mongoose.connection.on('reconnect', (err) => {
      console.error(`✗ Try to reconnect to MongoDB. ${err}`);
    });

    mongoose.connection.on('reconnectFailed', (err) => {
      console.error(`✗ Try to reconnect to MongoDB. ${err}`);
      throw err;
    });
  }

  run().catch((error) => {
    if (error) {
      console.error(error);
    }
  });

  const gracefulExit = () => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

  return mongoose;
};
