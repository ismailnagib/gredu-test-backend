const { httpStatus } = require('../libs/constant');

module.exports = (router) => {
  router.get('/', (req, res) => res.status(httpStatus.success).json({ message: 'Pong!' }));
};
