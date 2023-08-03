require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const { errorLogger } = require('express-winston');
const router = require('./routes');
const { login, createUser, signOut } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { NotFoundError } = require('./errors/NotFound');
const { requestLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: [
    'http://killa.students.nomoredomains.xyz',
    'https://killa.students.nomoredomains.xyz',
    'localhost:3001',
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  credentials: true,
  maxAge: 60,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(requestLogger);
    app.get('/crash-test', () => {
      setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
      }, 0);
    });
    app.post(
      '/signin',
      celebrate({
        body: Joi.object().keys({
          email: Joi.string().email().required().messages({
            'string.email': 'Неправильный формат почты',
            'any.required': 'Поле "email" обязательно для заполнения',
          }),
          password: Joi.string().min(8).required().messages({
            'string.min': 'Минимальная длина пароля - 8 символов',
            'any.required': 'Поле "password" обязательно для заполнения',
          }),
        }),
      }),
      login,
    );

    app.post(
      '/signup',
      celebrate({
        body: Joi.object().keys({
          email: Joi.string().email().required().messages({
            'string.email': 'Неправильный формат почты',
            'any.required': 'Поле обязательно для заполнения',
          }),
          password: Joi.string().min(8).required().messages({
            'string.min': 'Минимальная длина пароля - 8 символов',
            'any.required': 'Поле обязательно для заполнения',
          }),
          name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина имени - 2 символа',
            'string.max': 'Максимальная длина имени - 30 символов',
          }),
          avatar: Joi.string()
            .pattern(new RegExp('^(https?:\\/\\/)?'
              + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'
              + '((\\d{1,3}\\.){3}\\d{1,3}))'
              + '(\\:\\d+)?'
              + '(\\/[-a-z\\d%_.~+]*)*'
              + '(\\?[;&amp;a-z\\d%_.~+=-]*)?'
              + '(\\#[-a-z\\d_]*)?$', 'i'))
            .messages({
              'string.pattern.base': 'Некорректный формат ссылки на аватар',
            }),
          about: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина имени - 2 символа',
            'string.max': 'Максимальная длина имени - 30 символов',
          }),
        }),
      }),
      createUser,
    );
    app.post('/signout', signOut);
    app.use('/', auth, router);

    app.use('*', (req, res, next) => {
      next(new NotFoundError('Маршрут не найден'));
    });
    app.use(errorLogger);
    app.use(
      errors({
        statusCode: 400,
      }),
    );
    app.use(errorMiddleware);

    app.listen(3000, () => {
      console.error('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });
