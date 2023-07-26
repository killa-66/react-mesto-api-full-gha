import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Header from './Header'

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleChangeEmail(e) {
    setEmail(e.target.value)
  }

  function handleChangePassword(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEmail('')
    setPassword('')
    onRegister({
      "password": password,
      "email": email
    })
  }
  return (
    <>
      <Header
        email={''}
        link={'/sign-in'}
        textLink={'Войти'}
      />
      <div className="form-public">
        <h2 className='form-public__title'>Регистрация</h2>
        <form className='form-public__form' noValidate onSubmit={handleSubmit}>
          <section className='from-public__section'>
            <input
              type='text'
              className='form-public__input'
              placeholder='Email'
              required
              minLength="2"
              maxLength="40"
              value={email || ''}
              onChange={handleChangeEmail}
            />
            <span className='form-public__input-error'></span>
          </section>
          <section className='from-public__section'>
            <input type='password'
              className='form-public__input'
              placeholder='Пароль'
              required
              minLength="2"
              maxLength="200"
              value={password || ''}
              onChange={handleChangePassword}
            />
            <span className='form-public__input-error'></span>
          </section>
          <button type='submit' className='form-public__submit'>Зарегестрироваться</button>
        </form>
        <NavLink to="/sign-in" className='form-public__link'>Вы уже зарегестрированы? Войти</NavLink>
      </div>
    </>
  )
}
