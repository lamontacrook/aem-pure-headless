/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';

import './viewers.css';

const Viewers = ({ data }) => {
  const context = useContext(AppContext);
  const [domain, setDomain] = useState('');
  const [viewer, setViewer] = useState({});
  const [scene7Name, setScene7Name] = useState('');
  const [scene7File, setScene7File] = useState('');
  const [scene7Preset, setScene7Preset] = useState('');
  const viewerRef = useRef(true);

  useEffect(() => {
    const decorateViewer = () => {
      if (viewerRef.current && domain) {
        const viewerDiv = document.querySelector('#viewer');
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', 'https://smartimaging.scene7.com/s7viewers/html5/js/CarouselViewer.js');
        viewerDiv.append(script);
        viewerDiv.innerHTML += `<div id='s7carousel_div' class='${scene7Preset.toLowerCase()}'></div>`;
        const company = scene7File && scene7File.split('/')[0];

        script.addEventListener('load', () => {
          var s7carouselviewer = new window.s7viewers.CarouselViewer({
            'containerId': 's7carousel_div',
            'params': {
              'serverurl': `${domain}/is/image/`,
              'contenturl': `${domain}/is/content/`,
              'config': `${company}/${scene7Preset}`,
              'asset': `${company}/${scene7Name}`
            }
          });

          // s7carouselviewer.setHandlers({
          //   'quickViewActivate': function (inData) {
          //     var sku = inData.sku;
          //   }
          // });
          s7carouselviewer.init();
        });
        viewerRef.current = false;
      }
    };

    const src = context.serviceURL === context.defaultServiceURL || context.serviceURL.includes('publish-') ? data._authorUrl.replace('author', 'publish') : data._authorUrl;

    const metadata = [
      { 'dam:scene7Domain': setDomain },
      { 'dc:s7viewerpreset': ['CarouselViewer', setViewer] },
      { 'dam:scene7Name': setScene7Name },
      { 'dam:scene7File': setScene7File },
      { 'dc:s7viewerpreset': setScene7Preset }
    ];

    const headers = new Headers({
      'Content-Type': 'text/html'
    });

    let obj = {
      method: 'get',
      headers: headers,
    };

    if (!src.includes('publish-')) obj.credentials = 'include';
    const req = new Request(`${src}/_jcr_content/metadata.json`, obj);

    fetch(req).then((response) => {
      if (response) {
        response.json().then((json) => {
          metadata.forEach((item) => {
            Object.keys(item).forEach((val) => {
              if (val) {
                if (typeof item[val] === 'function') item[val](json[val]);
                else if (typeof item[val] === 'object') item[val][1](item[val][0]);
              }
            });
          });
          console.log(domain);
          decorateViewer(domain);
        });
      }
    });
  }, [scene7Name, data, domain, viewer, scene7File, scene7Preset, context.defaultServiceURL, context.serviceURL]);

  
  return (
    <div id='viewer'></div>
  );
};

Viewers.propTypes = {
  data: PropTypes.object
};

export default Viewers;