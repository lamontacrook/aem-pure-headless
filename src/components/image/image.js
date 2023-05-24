/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { defaultServiceURL } from '../../utils';
import { AppContext } from '../../utils/context';

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

const Image = ({ asset, config }) => {
  const context = useContext(AppContext);
  const src = context.serviceURL === defaultServiceURL ? asset._publishUrl : asset._authorUrl;
  const width = asset.width;
  const height = asset.height;

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
  asset: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

SrcSet.propTypes = {
  src: PropTypes.string,
};

export default Image;