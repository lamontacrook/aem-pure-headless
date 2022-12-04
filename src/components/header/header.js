import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../navigation';
import ModelManager from '../../utils/modelmanager';
import Image from '../image';

import './header.css';

const Header = ({ content, config }) => {
  // const fadeOutHandler = () => {
  //   const hero = document.querySelector('header');
  //   if (!hero) return;

  //   const distanceToTop = window.pageYOffset + hero.getBoundingClientRect().top;
  //   const elementHeight = hero.offsetHeight;
  //   const scrollTop = document.documentElement.scrollTop;

  //   let opacity = 1;

  //   if (scrollTop > distanceToTop) {
  //     opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
  //   }

  //   if (opacity >= 0) {
  //     hero.style.opacity = opacity;
  //   }
  // };

  useEffect(() => {
    // window.addEventListener('scroll', fadeOutHandler);
  }), [];


  const title = content._metadata && content._metadata.stringMetadata.map(item => {
    if (item.name === 'title') return item.value;
    else return '';
  });
  
  return (
    <header className={`home-${content.teaser?'hero':'article'}`} role='banner' data-fragment={content._path} data-model={title && title.join('')}>
      <Navigation logo={config.siteLogo} config={config} />

      {content.teaser &&
        <ModelManager
          key={`${content.teaser.__typename
            .toLowerCase()
            .replace(' ', '-')}-entity-header`}
          type={content.teaser.__typename}
          content={content.teaser}
          config={config}
        ></ModelManager>}

      {content.banner && !content.teaser &&
        <Image src={content.banner._publishUrl} config={config} />
      }
    </header>
  );
};

Header.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Header;