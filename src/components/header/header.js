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
import { editorProps } from '../../utils/ue-definitions';
import Delayed from '../../utils/delayed';

import './header.css';

const imageSizes = [
  {
    imageWidth: '2000px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1600px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1200px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1000px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '750px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '500px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '412px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    size: '100vw',
  }
];

const Header = ({ content, config, className }) => {
  const fadeOutHandler = () => {
    if (document.querySelector('#flyout') && document.querySelector('#flyout').getAttribute('aria-expanded')) return;
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

  if (!content.banner && content.teaser)
    content['teaser']['_path'] = !content['teaser']['_path'] ? content._path.replace('header', 'hero') : content['teaser']['_path'];

  return (
    <React.Fragment>
      <header className={`home-${content.teaser ? 'hero' : 'article'} ${className}`} 
        {...editorProps(content, 'Header', 'header', 'container', 'container')} role='banner'>
        {content && (
          <Delayed><Navigation className={content.navigationColor} config={config} screen={content} /></Delayed>
        )}

        {content.teaser &&
          <ModelManager
            content={content.teaser}
            config={config.configurationByPath.item}
          ></ModelManager>}
        {content.banner && !content.teaser &&
          <Image asset={content.banner} alt='Banner Image' config={config.configurationByPath.item} imageSizes={imageSizes} height={400}/>
        }
      </header>
    </React.Fragment>
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