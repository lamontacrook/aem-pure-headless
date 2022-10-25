import React from 'react';
import PropTypes from 'prop-types';

import './header.css';
import Logo from '../../media/fin-de-semana.png';

const Header = ({ content }) => {

  const viewGQL = () => {
    document.querySelector('.fly-out-gql').style.display = 'block';
  };

  return (
    <section className='navigation'>
      <div className="container">
        <img src={Logo} alt='logo' />
        <ol>
          <li>{content._authorUrl}</li>

        </ol>
        <a href='#' className='button view-gql' onClick={viewGQL}>View GraphQL</a>
      </div>
    </section>
  );
};

Header.propTypes = {
  content: PropTypes.object
};

export default Header;