/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';

import './smartcrops.css';

const SmartCrops = ({ asset, alt = 'WKND image', title = 'Title Missing', itemProp = 'asset', imageSizes }) => {
  const context = useContext(AppContext);
  const [imageFile, setImageFile] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const headers = new Headers({
      'Content-Type': 'text/html'
    });

    let obj = {
      method: 'get',
      headers: headers,
    };
    if (!asset._authorUrl.includes('publish-')) obj.credentials = 'include';
    const req = new Request(`${asset._authorUrl}/_jcr_content/metadata.json`, obj);

    fetch(req).then((response) => {
      if (response) {
        response.json().then((json) => {
          if (Object.prototype.hasOwnProperty.call(json, 'dam:scene7File')) setImageFile(json['dam:scene7File']);
          else throw Error('No scene7 file name');

          if (Object.prototype.hasOwnProperty.call(json, 'dam:scene7Domain')) setDomain(json['dam:scene7Domain']);
          else throw Error('No scene7 domain');
        });
      }
    });

  }, [asset]);

  if (!asset) return (
    <picture>
      <img src={context.brokenImage} alt='broken image' />
    </picture>
  );

  const width = imageSizes[0].imageWidth.replace('px', '');
  const height = imageSizes[0].imageHeight.replace('px', '');

  return (
    <picture>
      {domain && imageSizes.filter((definition) => definition.imageWidth).map((definition) => (
        <source key={definition.renditionName} srcSet={`${domain}/is/image/${imageFile}:${definition.renditionName}`} media={`(min-width:${definition.imageWidth})`} />
      ))}
      <img loading='lazy' alt={alt} title={title} src={`${domain}/is/image/${imageFile}:${imageSizes[0].renditionName}`} width={width} height={height} itemProp={itemProp} itemType="media" data-editor-itemlabel='Asset'/>
    </picture>
  );
};

SmartCrops.propTypes = {
  asset: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object,
  itemProp: PropTypes.string,
  imageSizes: PropTypes.array,
  alt: PropTypes.string,
  title: PropTypes.string,
};

export default SmartCrops;