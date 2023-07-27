import React, { useState } from 'react'
import Header from './Header'

export default function Login({ onLogin }) {
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
    onLogin({
      "password": password,
      "email": email
    })
  }

  return (
    <>
      <Header
        email={''}
        link={'/signup'}
        textLink={'Регистрация'}
      />
      <div className="form-public">
        <h2 className='form-public__title'>Вход</h2>
        <form className='form-public__form' noValidate onSubmit={handleSubmit} >
          <section className='from-public__section'>
            <input
              type='text'
              className='form-public__input'
              placeholder='Email'
              required
              minLength="2"
              maxLength="40"
              onChange={handleChangeEmail}
              value={email || ''}
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
              onChange={handleChangePassword}
              value={password || ''}
            />
            <span className='form-public__input-error'></span>
          </section>
          <button type='submit' className='form-public__submit' >Войти</button>
        </form>
      </div>
    </>
  )
}