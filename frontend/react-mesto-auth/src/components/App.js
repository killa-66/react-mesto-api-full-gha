import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import ImagePopup from './ImagePopup';
import Main from './Main';
import PopupAddCard from './PopupAddCard';
import PopupDeleteCard from './PopupDeleteCard';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from './PopupEditProfile';
import PopupWithForm from './PopupWithForm';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardContext } from '../contexts/CardContext';
import Login from './Login';
import Register from './Register';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';
import { auth } from '../utils/Auth'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeMenu, setActiveMenu] = useState(false)
  const [email, setEmail] = useState('')
  const [isCorrectRegistration, setIsCorrectRegistration] = useState(false)
  const navigate = useNavigate()
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([data, res]) => {
          setCurrentUser(data);
          setCards(res)
        })
        .catch(err =>
          console.log('Error :', err))
    }
  }, [loggedIn])

  useEffect(() => {
    tokenCheck()
  }, [])

  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function handleActiveMenuClick() {
    setActiveMenu(!activeMenu)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  function handleUpdateUserInfo(info) {
    setIsLoading(true);
    api.patchUserInfo(info)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(err =>
        console.log('Error :', err))
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.patchAvatarInfo(avatar)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(err =>
        console.log('Error :', err))
      .finally(() => {
        setIsLoading(false)
      }
      )
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if (isLiked) {
      api.deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err =>
          console.log('Error :', err))
    }
    else {
      api.putLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err =>
          console.log('Error :', err))
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(res => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .catch(err =>
        console.log('Error :', err))
  }

  function handleAddNewPlace(newCard) {
    setIsLoading(true);
    api.postNewCard(newCard)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch(err =>
        console.log('Error :', err))
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleSubmitRegistration(data) {
    auth.register(data)
      .then(res => {
        setIsCorrectRegistration(true)
        setIsInfoToolTipOpen(true)
        navigate("/signin", { replace: true })
      })
      .catch(err => {
        setIsCorrectRegistration(false)
        setIsInfoToolTipOpen(true)
        console.log(err)
      })
  }

  function handleSubmitLogin(data) {
    auth.login(data)
      .then(res => {
        setLoggedIn(true)
        setEmail(data.email)
        localStorage.setItem('jwt', res.token)
      })
      .catch((err) => {
        setIsCorrectRegistration(false);
        setIsInfoToolTipOpen(true);
        console.log(err);
      })
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setLoggedIn(false)
  }

  function tokenCheck() {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        auth.checkToken(jwt)
          .then(result => {
            if (result) {
              api.setToken(jwt);
              setLoggedIn(true);
              setEmail(result.data.email)
            }
          })
          .catch((err) => {
            console.log(`Ошибка проверки токена ${err}`);
          });
      }
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardContext.Provider value={cards}>
        <div className="page">
          {loggedIn ? <Header
            link={"/signin"}
            textLink={"Выйти"}
            loggedIn={loggedIn}
            handleActiveMenuClick={handleActiveMenuClick}
            activeMenu={activeMenu}
            email={email}
            onLogout={handleLogout}
            isMobile={width <= 600}
          /> : ''}
          <Routes>
            <Route path="/" element={<ProtectedRoute element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              loggedIn={loggedIn}
            />} />
            <Route path="/signin" element={loggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleSubmitLogin} />} />
            <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleSubmitRegistration} />} />
          </Routes>

          {loggedIn ? <Footer /> : ''}
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <PopupWithForm />
          <PopupEditAvatar
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            stateLoading={isLoading}
          />
          <PopupAddCard
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddNewPlace}
            stateLoading={isLoading}
          />
          <PopupEditProfile
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdate={handleUpdateUserInfo}
            stateLoading={isLoading}
          />
          <PopupDeleteCard
            onClose={closeAllPopups}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            onClose={closeAllPopups}
            isCorrectRegistration={isCorrectRegistration}
          />
        </div>
      </CardContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;