import React, { useContext } from 'react'
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { CardContext } from '../contexts/CardContext';

function Main({ onAddPlaceClick, onEditAvatar, onCardClick, onEditProfile, onCardLike, onCardDelete }) {

  const currentUser = useContext(CurrentUserContext);
  const cards = useContext(CardContext);

  return (
    <>
      <main className="content">
        <section className="profile">
          <button type="button" className="profile__container" onClick={onEditAvatar} >
            <img src={currentUser.avatar} alt="Аватарка профиля" className="profile__avatar" />
          </button>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" aria-label="Редактировать профиль" className="profile__open" onClick={onEditProfile}></button>
            <p className="profile__profession">{currentUser.about}</p>
          </div>
          <button type="button" aria-label="Добавить" className="profile__add" onClick={onAddPlaceClick}></button>
        </section>
        <section className="grid">
          {cards && cards.map((item) => {
            return (
              <Card
                link={item.link}
                key={item._id}
                name={item.name}
                likesCount={item.likes.length}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
                item={item}
              />
            );
          })
          }
        </section>
      </main >
    </>
  )
}

export default Main