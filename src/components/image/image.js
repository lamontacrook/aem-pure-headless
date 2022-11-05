import React from 'react';
import PropTypes from 'prop-types';

import './image.css';

const SrcSet = ({ src }) => {
  console.log(src);
  const renditions = {
    '140px': 'thumbnail.140.11.png',
    '319px': 'thumbnail.319.319.png',
    '48px': 'thumbnail.48.48.png',
    '1280px': 'web.1280.jpeg',
    '2048px': 'zoom.2048.2048.jpeg'
  };

  let srcs = '';
  let sizes = '';

  let sources = {};

  for (let w in renditions) {
    let ext = renditions[w].substring(renditions[w].lastIndexOf('.') + 1, renditions[w].length);
    srcs += `${src}/jcr:content/renditions/cq5dam.${renditions[w]} ${w}, `;
    sizes += `(max-width: ${w}) ${w}, `;
    sources[ext] = {
      srcSet: srcs,
      sizes: sizes
    };
  }
  
  return (
    <React.Fragment>
      {
        Object.keys(sources).map((key) => (
          <source key={key} type={'image/'+ key} srcSet={sources[key]['srcSet']} sizes={sources[key]['sizes']} />
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