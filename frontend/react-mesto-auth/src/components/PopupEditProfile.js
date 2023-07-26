import { useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useFormAndValidation from "../hooks/useValidation";

function PopupEditProfile({ isOpen, onClose, onUpdate, stateLoading }) {
  const currentUser = useContext(CurrentUserContext);
  const { values, handleChange, errors, isValid, setValues } = useFormAndValidation()

  useEffect(() => {
    setValues(currentUser)
  }, [currentUser, isOpen, setValues]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdate(values)
  }

  return (
    <PopupWithForm
      name={'popupEditProfile'}
      title={'Редактировать профиль'}
      onClose={onClose}
      isOpen={isOpen}
      handleSubmit={handleSubmit}
      textButton={stateLoading ? 'Сохранение...' : 'Сохранить'}
      isValid={isValid}
      children={
        <>
          <div className="form__section">
            <input type="text" name="name" placeholder="Ваше Имя" className="form__input" id="name"
              minLength="2" maxLength="40" required value={values.name || ''}
              onChange={handleChange} />
            <span className="form__input-error name-error">{errors.name}</span>
          </div>
          <div className="form__section">
            <input type="text" name="about" placeholder="Ваша профессия" className="form__input"
              id="job" minLength="2" maxLength="200" required value={values.about || ''}
              onChange={handleChange} />
            <span className="form__input-error job-error">{errors.about}</span>
          </div>
        </>
      }
    />
  )
}

export default PopupEditProfile