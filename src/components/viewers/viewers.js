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

  // const iframe = `${domain}s7viewers/html5/${viewer}.html?asset=${scene7File}&config=${scene7Preset}&serverUrl=${domain}is/image/&contenturl=${domain}is/image/`;

  return (
    <div id='viewer'></div>
  );




  // const embed = `
  // <style type="text/css">
  //       #s7carousel_div.s7carouselviewer{
  //         width:100%;
  //       height:auto;
  // }
  //     </style>
  //     <script type="text/javascript" src="https://smartimaging.scene7.com/s7viewers/html5/js/CarouselViewer.js"></script>
  //     <div id="s7carousel_div" class="carousel_dotted_dark"></div>
  //     <script type="text/javascript">
  //       var s7carouselviewer = new s7viewers.CarouselViewer({
  //         "containerId" : "s7carousel_div",
  //       "params" : {
  //         "serverurl" : "https://smartimaging.scene7.com/is/image/",
  //       "contenturl" : "https://smartimaging.scene7.com/is/content/",
  //       "config" : "DynamicMediaNA/Carousel_Dotted_dark",
  // 		"asset" : "DynamicmediaNA1/Hotspot_ImageMap_Gift_Sets_Multi" }
  // })
  // /* // Example of carousel set event for quick view.
  // 	 s7carouselviewer.setHandlers({
  //         "quickViewActivate": function(inData) {
  // 			var sku=inData.sku; //SKU for product ID
  //       //To pass other parameter from the hotspot/image map, you will need to add custom parameter during the hotspot/image map setup as parameterName=value
  //       loadQuickView(sku); //Replace this call with your quickview plugin
  // 			//Please refer to your quickviewer plugin for the quickview call
  // 		 } 
  // 	 });
  //       */

  //       s7carouselviewer.init();
  //     </script>`;

  // return (
  //   <React.Fragment>
  //     {/* {domain && viewer && scene7File && scene7Preset && */}
  //     <div className='viewer' ref={divRef}>{domain}</div>
  //     {/* } */}
  //   </React.Fragment>
  // );
};

Viewers.propTypes = {
  data: PropTypes.object
};

export default Viewers;
// <iframe src={`${domain}s7viewers/html5/`}>
//https://author-p127526-e1240386.adobeaemcloud.com/content/dam/nordstrom-cms-poc/images/Hotspot_ImageMap_Gift_Sets_Multi
//https://smartimaging.scene7.com/  dam:scene7Domain
//Carousel_Dotted_light dc:s7viewerpreset
//Hotspot_ImageMap_Gift_Sets_Multi dam:scene7Name
//Hotspot ImageMap Gift Sets Multi dam:scene7Name
//Hotspot ImageMap Gift Sets Multi dc:title
//ImageSet dam:scene7Type

//https://smartimaging.scene7.com/s7viewers/html5/CarouselViewer.html?asset=DynamicmediaNA1/Hotspot_ImageMap_Gift_Sets_Multi&config=DynamicMediaNA/Carousel_Dotted_dark&serverUrl=https://smartimaging.scene7.com/is/image/&contenturl=https://smartimaging.scene7.com/is/content/


{/* 
 "banner": {
            "__typename": "DocumentRef",
            "_path": "/content/dam/nordstrom-cms-poc/images/Hotspot_ImageMap_Gift_Sets_Multi",
            "_authorUrl": "https://author-p127526-e1240386.adobeaemcloud.com/content/dam/nordstrom-cms-poc/images/Hotspot_ImageMap_Gift_Sets_Multi",
            "_publishUrl": "https://publish-p127526-e1240386.adobeaemcloud.com/content/dam/nordstrom-cms-poc/images/Hotspot_ImageMap_Gift_Sets_Multi",
            "type": "document",
            "title": "Hotspot ImageMap Gift Sets Multi",
            "description": null,
            "format": "Multipart/Related; type=application/x-CarouselSet",
            "author": null
          }, */}

