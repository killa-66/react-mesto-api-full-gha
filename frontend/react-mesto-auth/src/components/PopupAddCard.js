import PopupWithForm from "./PopupWithForm";
import useFormAndValidation from "../hooks/useValidation";
import { useEffect } from "react";

function PopupAddCad({ isOpen, onClose, onAddPlace, stateLoading }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation()

  useEffect(() => {
    resetForm()
  }, [isOpen, resetForm])

  function handleSubmit(e) {
    e.preventDefault()

    onAddPlace(values)
  }

  return (
    <PopupWithForm
      name={'popupAddCard'}
      title='Новое место'
      onClose={onClose}
      isOpen={isOpen}
      handleSubmit={handleSubmit}
      textButton={stateLoading ? 'Создание...' : 'Создать'}
      isValid={isValid}
      children={
        <>
          <div className="form__section">
            <input type="text" name="name" placeholder="Название" className="form__input"
              id="nameCard" minLength="2" maxLength="30" required value={values.name || ''} onChange={handleChange} />
            <span className="form__input-error nameCard-error">{errors.name}</span>
          </div>
          <div className="form__section">
            <input type="url" name="link" placeholder="Ссылка на картинку" className="form__input"
              id="imageCard" required value={values.link || ''} onChange={handleChange} />
            <span className="form__input-error imageCard-error">{errors.link}</span>
          </div>
        </>
      }
    />
  )
}

export default PopupAddCad