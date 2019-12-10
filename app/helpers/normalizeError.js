const get = require('lodash/get');

module.exports = (error) => {
  const err = get(error, 'error.errors.stackTrace');

  if (err) {
    err.message = get(error, 'error.errors.message');
    return err;
  }

  if (get(error, 'constructor.name') === 'TypeError') {
    return {
      message: error.message,
    };
  }

  return error;
};
