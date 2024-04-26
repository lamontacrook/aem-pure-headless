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

const Image = ({ asset, imageProps = '', imageSizes }) => {
  const context = useContext(AppContext);

  const imageUrl = () => {
    if (Object.keys(asset).includes('_dynamicUrl')) {
      const url = context.serviceURL === context.defaultServiceURL || context.serviceURL.includes('publish-') ? context.serviceURL.replace('author', 'publish') : context.serviceURL;
      return url.replace(/\/$/, '') + asset._dynamicUrl;
    } else {
      return asset._authorUrl;
    }
  };

  if (!asset) return (
    <picture>
      <img src={context.brokenImage} alt='broken image' />
    </picture>
  );

  let src = context.serviceURL.replace(/\/+$/, '') + asset?._path;

  src = imageUrl(context, asset);

  return (
    <picture>
      <img loading='lazy' alt={asset.description} title={asset.title} src={src} width={asset.width} height={asset.height} srcSet={srcSet(src, imageSizes)} sizes={sizes(imageSizes)} {...imageProps} />
    </picture>
  );
};

Image.propTypes = {
  asset: PropTypes.object,
  imageProps: PropTypes.object,
  imageSizes: PropTypes.array
};

export default Image;