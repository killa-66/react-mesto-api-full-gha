const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неправильный формат почты',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
cardSchema.statics.isCardOwned = function (cardId, userId) {
  return this.findById(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('Карточка не найдена'));
      }
      return card.owner.toString() === userId;
    })
    .catch((err) => err);
};
module.exports = mongoose.model('card', cardSchema);
