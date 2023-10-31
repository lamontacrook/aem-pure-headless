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
import { srcSet, sizes } from '../../utils/responsive-image';

const imageUrl = (context, asset) => {
  if(Object.keys(asset).includes('_dynamicUrl')) {
    const url = context.serviceURL === context.defaultServiceURL || context.serviceURL.includes('publish-')? context.serviceURL.replace('author', 'publish') : context.serviceURL;  
    return url.replace(/\/$/, '') + asset._dynamicUrl;
  } else {  
    return asset._authorUrl;
  }
};

const Image = ({ asset, alt, itemProp='asset', width, height, imageSizes }) => {
  const context = useContext(AppContext);

  if(!asset) return (
    <img src={context.brokenImage} />
  );

  let src = context.default ? asset?._publishUrl : asset?._authorUrl;
  // if(Object.keys(asset).includes('_dynamicUrl')) {
  //   const url = context.serviceURL === context.defaultServiceURL ? context.serviceURL.replace('author', 'publish') : context.serviceURL;
  //   // src = `${url.replace(/\/$/, '')}${asset._dynamicUrl}`;
  // }
  // else
  //   src += `/jcr:content/renditions/${renditions[Object.keys(renditions).pop()]}`;

  width = width || asset?.width || '';
  height = height || asset?.height || '';

  src = imageUrl(context, asset);

  return (
    <picture>
      <img alt={alt} src={src} width={width} height={height} srcSet={srcSet(src, imageSizes)} sizes={sizes(imageSizes)} itemProp={itemProp} itemType="media" data-editor-itemlabel='Asset'/>
    </picture>
  );
};

Image.propTypes = {
  asset: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object,
  itemProp: PropTypes.string,
  imageSizes: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
};

export default Image;