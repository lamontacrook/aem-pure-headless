import React from 'react';

import './navigation.css';
import Logo from '../../media/fin-de-semana.png';

const Navigation = () => {

  return (
    <section className='navigation'>
      <div className="container">
        <img src={Logo} alt='logo' />
        <ol>
          <li><a href='#' className='navItem'>Destinations</a></li>
          <li><a href='#' className='navItem'>Activities</a></li>
          <li><a href='#' className='navItem'>Seasons</a></li>
          <li><a href='#' className='navItem'>Magazine</a></li>
          <li><a href='#' className='navItem'>About Us</a></li>
        </ol>
        <a href='#' className='button contact-us'>Contact Us</a>
      </div>
    </section>
  );
};

export default Navigation;