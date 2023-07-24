const mongoose = require('mongoose');
const Card = require('../models/card');
const { InternalServerError } = require('../errors/InternalServer');
const { BadRequestError } = require('../errors/BadRequest');
const { NotFoundError } = require('../errors/NotFound');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new InternalServerError('Ошибка инициализации сервера')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка инициализации сервера'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав для удаления этой карточки.');
      }
      return Card.deleteOne(card).then(() => res.send({ data: card }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch(() => next(new InternalServerError('Ошибка инициализации сервера')));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка инициализации сервера'));
    });
};
