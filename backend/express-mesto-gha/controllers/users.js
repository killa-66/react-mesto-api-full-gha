const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { constants } = require('http2');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequest');
const { InternalServerError } = require('../errors/InternalServer');
const { NotFoundError } = require('../errors/NotFound');
const { ConflictError } = require('../errors/ConflictError');

const createUser = (req, res, next) => {
  // eslint-disable-next-line
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((data) => {
          res.status(constants.HTTP_STATUS_CREATED).send({
            email: data.email,
            _id: data._id,
            name: data.name,
            about: data.about,
            avatar: data.avatar,
          });
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return next(new BadRequestError('Невалидные данные'));
          }
          if (error.code === 11000) {
            return next(new ConflictError('Данная почта уже используется'));
          }
          return next(new InternalServerError('Ошибка сервера'));
        });
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(constants.HTTP_STATUS_OK).send(users);
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};
const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production'
          ? process.env.JWT_SECRET
          : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          email: user.email,
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
    })
    .catch((err) => {
      // eslint-disable-next-line no-param-reassign
      next(err);
    });
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
