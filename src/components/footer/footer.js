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

    const usePub = false; //JSON.parse(context.publish);

    const url = usePub ?
      config._publishUrl.replace('.html', '.content.html') :
      config._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

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
      </div>
    </React.Fragment>
  );
};

Footer.propTypes = {
  config: PropTypes.object,
  context: PropTypes.object
};

export default Footer;