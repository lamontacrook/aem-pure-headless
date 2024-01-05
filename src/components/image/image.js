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
  if (Object.keys(asset).includes('_dynamicUrl')) {
    const url = context.serviceURL === context.defaultServiceURL || context.serviceURL.includes('publish-') ? context.serviceURL.replace('author', 'publish') : context.serviceURL;
    return url.replace(/\/$/, '') + asset._dynamicUrl;
  } else {
    return asset._authorUrl;
  }
};

const Image = ({ asset, alt = 'WKND image', itemProp = 'asset', width, height, imageSizes, useDM=false }) => {
  const context = useContext(AppContext);

  if (!asset) return (
    <picture>
      <img src={context.brokenImage} alt='broken image' />
    </picture>
  );

  let src = context.default ? asset?._publishUrl : asset?._authorUrl;

  width = width || asset?.width || '';
  height = height || asset?.height || '';


  if(useDM) {
    //https://smartimaging.scene7.com/is/image/DynamicmediaNA1/AdobeStock_224179452:54vert
    const parts = src.split('/');
    const image = parts.pop().split('.')[0];
    const name = imageSizes.filter((item) => {
      if(Object.prototype.hasOwnProperty.call(item, 'renditionName'))
        return item;
    });
    src = `https://smartimaging.scene7.com/is/image/DynamicmediaNA1/${image}-1:${name[0].renditionName}`;
  } else {
    src = imageUrl(context, asset);
  }

  if (alt === 'logo')
    return (
      <picture>
        <img loading='lazy' alt={alt} src={src} width={width} height={height} srcSet={srcSet(src, imageSizes)} sizes={sizes(imageSizes)} />
      </picture>
    );
  else
    return (
      <picture>
        <img loading='lazy' alt={alt} src={src} width={width} height={height} srcSet={srcSet(src, imageSizes)} sizes={sizes(imageSizes)} itemProp={itemProp} itemType="media" data-editor-itemlabel='Asset' />
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
  useDM: PropTypes.bool
};

export default Image;