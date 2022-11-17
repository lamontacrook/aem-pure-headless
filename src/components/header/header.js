import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../navigation';
import ModelManager from '../../utils/modelmanager';
import Image from '../image';

import './header.css';

const Header = ({ content, config }) => {
  const fadeOutHandler = () => {
    const hero = document.querySelector('header');
    if (!hero) return;

    const distanceToTop = window.pageYOffset + hero.getBoundingClientRect().top;
    const elementHeight = hero.offsetHeight;
    const scrollTop = document.documentElement.scrollTop;

    let opacity = 1;

    if (scrollTop > distanceToTop) {
      opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
    }

    if (opacity >= 0) {
      hero.style.opacity = opacity;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', fadeOutHandler);
  }), [];

  return (
    <header className={`home-${content.headerTeaser?'hero':'article'}`} role='banner'>
      <Navigation logo={config.siteLogo} />

      {content.headerTeaser &&
        <ModelManager
          key={`${content.headerTeaser._model.title
            .toLowerCase()
            .replace(' ', '-')}-entity-${content.headerTeaser._model._path}-header`}
          type={content.headerTeaser._model.title}
          content={content.headerTeaser}
        ></ModelManager>}

      {content.headerBanner &&
        <Image src={content.headerBanner._publishUrl} />
      }
    </header>
  );
};

Header.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Header;