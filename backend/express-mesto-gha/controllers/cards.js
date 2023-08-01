const mongoose = require('mongoose');
const { constants } = require('http2');
const Card = require('../models/card');
const { InternalServerError } = require('../errors/InternalServer');
const { BadRequestError } = require('../errors/BadRequest');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFound');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(constants.HTTP_STATUS_CREATED).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.isCardOwned(cardId, req.user._id)
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) {
        return next(
          new ForbiddenError('Это не ваша карточка, вы не можете ее удалить'),
        );
      }
      Card.findByIdAndDelete(cardId)
        .then((card) => {
          if (card) {
            res.send(card);
            return;
          }
          // eslint-disable-next-line consistent-return
          return next(new NotFoundError('Карточка не найдена'));
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.CastError) {
            return next(new BadRequestError('Невалидные данные'));
          }
          return next(new InternalServerError('Ошибка сервера'));
        });
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      // eslint-disable-next-line consistent-return
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      // eslint-disable-next-line consistent-return
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
