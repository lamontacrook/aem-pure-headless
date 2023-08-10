/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';

import './image.css';

let renditions = {
  '1900': 'web-optimized-xlarge.webp',
  '1200': 'web-optimized-large.webp',
  '900': 'web-optimized-medium.webp',
  '600': 'web-optimized-medium.webp'
};

const SrcSet = (asset) => {
  const context = useContext(AppContext);
  
  let src = '';

  if(Object.keys(asset).includes('_dynamicUrl')) {
    const url = context.serviceURL === context.defaultServiceURL ? context.serviceURL.replace('author', 'publish') : context.serviceURL;
    src = asset._dynamicUrl;

    const srcs = Object.keys(renditions).map((key) => {
      return `${url.replace(/\/$/, '')}${src}&width=${key} ${key}w`;
    });

    return srcs;
  } else
    src = asset._authorUrl;

  const srcset = Object.keys(renditions).map((key) => (
    `${src}/jcr:content/renditions/${renditions[key]} ${key}w`
  ));

  return (srcset.join(', '));

};



const Image = ({ asset, config, itemProp='asset' }) => {
  const context = useContext(AppContext);
  let src = context.default ? asset._publishUrl : asset._authorUrl;
  // if(Object.keys(asset).includes('_dynamicUrl')) {
  //   const url = context.serviceURL === context.defaultServiceURL ? context.serviceURL.replace('author', 'publish') : context.serviceURL;
  //   // src = `${url.replace(/\/$/, '')}${asset._dynamicUrl}`;
  // }
  // else
  //   src += `/jcr:content/renditions/${renditions[Object.keys(renditions).pop()]}`;

  const width = asset.width;
  const height = asset.height;

  if( config ) {
    renditions = config.renditionsConfiguration;
  }
  
  return (
    <picture>
      <img src={src} width={width} height={height} srcSet={SrcSet(asset)} itemProp={itemProp} itemType="media" data-editor-itemlabel='Asset'/>
    </picture>
  );
};

Image.propTypes = {
  asset: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object,
  itemProp: PropTypes.string
};

SrcSet.propTypes = {
  src: PropTypes.string,
};

export default Image;