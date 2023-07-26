import React from 'react'
import authok from '../images/authOk.png'
import autherror from '../images/authError.png'


export default function InfoToolTip({ isOpen, onClose, isCorrectRegistration }) {
  return (
    <div className={`popup ${isOpen ? `popup_opened` : ''}`} >
      <div className='popup__container popup__container_info'>
        <button className='popup__close' onClick={onClose}></button>
        <img src={isCorrectRegistration ? `${authok}` : `${autherror}`} className='popup__auth_image' alt='Результат авторизации' />
        <h2 className='popup__title popup__title_auth'>{isCorrectRegistration ? "Вы успешно зарегестрировались!" : "Что-то пошло не так! Попробуйте еще раз"}</h2>
      </div>
    </div>
  )
}
