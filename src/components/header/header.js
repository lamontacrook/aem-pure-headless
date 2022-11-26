import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../navigation';
import ModelManager from '../../utils/modelmanager';
import Image from '../image';

import './header.css';

const Header = ({ content, config }) => {
  console.log(content.teaser);
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
    <header className={`home-${content.teaser?'hero':'article'}`} role='banner'>
      <Navigation logo={config.siteLogo} config={config} />

      {content.teaser &&
        <ModelManager
          key={`${content.teaser.__typename
            .toLowerCase()
            .replace(' ', '-')}-entity-header`}
          type={content.teaser.__typename}
          content={content.teaser}
        ></ModelManager>}

      {content.banner && !content.teaser &&
        <Image src={content.banner._publishUrl} />
      }
    </header>
  );
};

Header.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Header;