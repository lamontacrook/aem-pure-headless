import React from 'react';
import PropTypes from 'prop-types';

import './image.css';

let renditions = {
  '1900': 'web-optimized-xlarge.webp',
  '1200': 'web-optimized-large.webp',
  '900': 'web-optimized-medium.webp',
  '600': 'web-optimized-medium.webp'
};

const SrcSet = (src) => {
  
  const srcset = Object.keys(renditions).map((key) => (
    `${src}/jcr:content/renditions/${renditions[key]} ${key}w`
  ));

  return (srcset.join(', '));

};

const Image = ({ src, width, height, config }) => {

  if( config ) {
    renditions = config.renditionsConfiguration;
  }
  else
    console.log(config.renditionsConfiguration);

  return (
    <picture>
      <img src={`${src}/jcr:content/renditions/${renditions[Object.keys(renditions).pop()]}`} width={width} height={height} srcSet={SrcSet(src)} />
    </picture>
  );
};

Image.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  config: PropTypes.object
};

SrcSet.propTypes = {
  src: PropTypes.string,
};

export default Image;