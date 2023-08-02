const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/Unauthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

const handleAuthError = (res, next) => {
  next(new UnauthorizedError('Что-то не так с почтой или паролем'));
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  // if (!token) {
  //   return handleAuthError(res, next);
  // }
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret',
    );
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;
  next();
};
