import PopupWithForm from "./PopupWithForm";

function PopupDeleteCard({ isOpen, onClose }) {
  return (
    <PopupWithForm
      name={'popupDeleteCard'}
      title={'Вы уверены?'}
      onClose={onClose}
      isOpen={isOpen}
      children={
        <>
          <button type="submit" aria-label="Вы уверены?" className="form__save">Да</button>
        </>
      }
    />
  )
}

export default PopupDeleteCard