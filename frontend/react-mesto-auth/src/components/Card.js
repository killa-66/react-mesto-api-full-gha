import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.item.owner === currentUser._id;
  const isLiked = props.item.likes.some(i => {
    return i === currentUser._id
  });
  const cardLikeButtonClassName = (`grid__like ${isLiked && 'grid__like_active'}`);


  function handleClick() {
    props.onCardClick(props.item);
  }

  function handleChangeLike() {
    props.onCardLike(props.item)
  }

  function handleDeleteCard() {
    props.onCardDelete(props.item)
  }

  return (
    <div className="grid__card" >
      <img src={props.item.link} alt={props.item.name} className="grid__image" onClick={handleClick} />
      {isOwn && <button type="button" aria-label="Удалить" className="grid__trash" onClick={handleDeleteCard}></button>}
      <div className="grid__signature">
        <h2 className="grid__name">{props.item.name}</h2>
        <div className="grid__signature_group">
          <button type="button" aria-label="Нравится" className={cardLikeButtonClassName} onClick={handleChangeLike}></button>
          <div className="grid__like_count">{props.item.likes.length}</div>
        </div>
      </div>
    </div>
  )
}

export default Card
