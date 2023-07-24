const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      link: Joi.string()
        .required()
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
      name: Joi.string()
        .min(2)
        .max(30)
        .messages({
          'string.min': 'Минимальная длина имени - 2 символа',
          'string.max': 'Максимальная длина имени - 30 символов',
        })
        .required(),
    }),
  }),
  createCard,
);
router.get('/', getCards);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24).required(),
      })
      .messages({
        'string.min': 'Невалидный id',
      }),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24).required(),
      })
      .messages({
        'string.min': 'Невалидный id',
      }),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24).required(),
      })
      .messages({
        'string.min': 'Невалидный id',
      }),
  }),
  dislikeCard,
);

module.exports = router;
