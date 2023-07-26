import { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";
import useFormAndValidation from "../hooks/useValidation";

function PopupEditAvatar({ isOpen, onClose, onUpdateAvatar, stateLoading }) {
  const inputRef = useRef()
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation()

  useEffect(() => {
    resetForm()
  }, [isOpen, resetForm])

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name={'popupEditAvatar'}
      title={'Обновить аватар'}
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      textButton={stateLoading ? 'Сохранение...' : 'Сохранить'}
      isValid={isValid}
      children={
        <>
          <div className="form__section">
            <input
              ref={inputRef}
              type="url"
              name="avatar"
              placeholder="Ссылка на новый аватар"
              className="form__input"
              id="avatar"
              minLength="2"
              value={values.avatar || ''}
              onChange={handleChange}
              required
            />
            <span className="form__input-error avatar-error">{errors.avatar}</span>
          </div>
        </>
      }
    />
  )
}

export default PopupEditAvatar