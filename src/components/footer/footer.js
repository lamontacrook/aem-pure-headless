/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { externalizeImagesFromString } from '../../utils';
import './footer.css';
import { useErrorHandler } from 'react-error-boundary';
import { pageRef } from '../../api/api';
import { AppContext } from '../../utils/context';

const Footer = ({ config }) => {
  const context = useContext(AppContext);
  const [footer, setFooter] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    if (!config) return;

    const url = config._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    pageRef(url, context)
      .then((response) => {
        if (response) {
          response.text().then((html) => {
            if (html) {
              setFooter(new XMLSerializer().serializeToString(externalizeImagesFromString(html, context), 'text/html'));
            }
          });
        }
      })
      .catch((error) => {
        handleError(error);
      });

  }, [config, handleError, context]);

  return (
    <React.Fragment>
      <div className="footer-xf" dangerouslySetInnerHTML={{ __html: footer }} />
      <div className='version'>
        <span>version 1.0</span>
        <span>{context.serviceURL}</span>
        <span>{context.project}</span>
        <span><a href={`https://experience.adobe.com/#/aem/editor/canvas/${window.location.host}${window.location.pathname}`} target='_blank' rel='noreferrer'>Open in Editor</a></span>
      </div>
    </React.Fragment>
  );
};

Footer.propTypes = {
  config: PropTypes.object,
  context: PropTypes.object
};

export default Footer;