const get = require('lodash/get');

module.exports = (error) => {
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  const err = get(error, 'error.errors.stackTrace');

  if (err) {
    err.message = get(error, 'error.errors.message');
    return err;
  }

  if (error.message && error.stack) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
};
