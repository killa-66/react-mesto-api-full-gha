import { NavLink } from 'react-router-dom';
import vector from '../images/Vector.svg';

function Header({ link, textLink, loggedIn, email, onLogout, activeMenu, handleActiveMenuClick, isMobile }) {

  function openMenu() {
    handleActiveMenuClick();
  }

  return (
    <div className="header">
      {(isMobile && activeMenu) ? (
        <div className='header__info header__info_active'>
          <p className='header__email header__email_burger'>{email}</p>
          <NavLink to={link} className="header__swapper header__swapper_burger" onClick={onLogout}>{textLink}</NavLink>
        </div>
      ) : ("")}
      <div className='header__container'>
        <img src={vector} alt="Логотип Место Россия" className="header__logo" />

        {isMobile ? (
          <button className={`header__burger-menu ${activeMenu ? `header__burger-menu_close` : ''}`} type="button" onClick={openMenu}></button>
        ) :
          (
            <>
              <div className="header__info">
                <p className='header__email'>{email}</p>
                <NavLink to={link} className='header__swapper' onClick={onLogout}>{textLink}</NavLink>
              </div>
            </>
          )}

      </div>
    </div>
  )
}

export default Header