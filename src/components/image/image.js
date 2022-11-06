import React from 'react';
import PropTypes from 'prop-types';

import './image.css';

const SrcSet = ({ src }) => {
  const renditions = {
    '140': 'thumbnail.140.11.png',
    '319': 'thumbnail.319.319.png',
    '48': 'thumbnail.48.48.png',
    '1280': 'web.1280.1280.jpeg',
    '2048': 'zoom.2048.2048.jpeg'
  };

  return (
    <React.Fragment>
      {
        Object.keys(renditions).map((key) => (
          <source key={key} 
            type={'image/' + renditions[key].substring(renditions[key].lastIndexOf('.') + 1, renditions[key].length)} 
            srcSet={`${src}/jcr:content/renditions/cq5dam.${renditions[key]}`} media={`(max-width: ${key}px)`} />
        ))
      }
    </React.Fragment>
  );
};

const Image = ({ src }) => {

  // (typeof src === 'string') && SrcSet(src);

  return (
    <picture>
      <SrcSet src={src} />
      <img src={src} />
    </picture>
  );
};

Image.propTypes = {
  src: PropTypes.string
};

SrcSet.propTypes = {
  src: PropTypes.string
};

export default Image;