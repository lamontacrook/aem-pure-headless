/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../navigation';
import ModelManager from '../../utils/modelmanager';
import Image from '../image';

import './header.css';

const Header = ({ content, config, className }) => {
  const fadeOutHandler = () => {
    if(document.querySelector('#flyout') && document.querySelector('#flyout').getAttribute('aria-expanded')) return;
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


  const title = content._metadata && content._metadata.stringMetadata.map(item => {
    if (item.name === 'title') return item.value;
    else return '';
  });
  
  return (
    <header className={`home-${content.teaser?'hero':'article'} ${className}`} role='banner' data-fragment={content._path} data-model={title && title.join('')}>
      {content && (
        <Navigation className={content.navigationColor} config={config} screen={content} />
      )}

      {content.teaser &&
        <ModelManager
          key={`${content.teaser.__typename
            .toLowerCase()
            .replace(' ', '-')}-entity-header`}
          content={content.teaser}
          config={config.configurationByPath.item}
        ></ModelManager>}

      {content.banner && !content.teaser &&
        <Image asset={content.banner} config={config.configurationByPath.item} />
      }
    </header>
  );
};

Header.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  content: PropTypes.object,
  className: PropTypes.string,
  context: PropTypes.object
};

export default Header;