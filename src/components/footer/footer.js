import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { externalizeImagesFromString, proxyURL } from '../../utils';
import './footer.css';
import { useErrorHandler } from 'react-error-boundary';

const Footer = ({ config, context }) => {
  const [footer, setFooter] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    if (!config) return;

    const usePub = JSON.parse(context.publish);

    const url = usePub ?
      config._publishUrl.replace('.html', '.content.html') :
      config._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    const headers = usePub ?
      new Headers({
        'Authorization': '',
        'Content-Type': 'text/html',
      }) :
      new Headers({
        'Authorization': `Bearer ${context.auth}`,
        'Content-Type': 'text/html',
      });

    context.useProxy && headers.append('aem-url', url);

    const req = context.useProxy ?
      new Request(proxyURL, {
        method: 'get',
        headers: headers,
        mode: 'cors',
        referrerPolicy: 'origin-when-cross-origin'
      }) :
      new Request(url, {
        method: 'get',
        headers: headers,
        mode: 'cors',
        referrerPolicy: 'origin-when-cross-origin'
      });


    fetch(req)
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
    </React.Fragment>
  );
};

Footer.propTypes = {
  config: PropTypes.object,
  context: PropTypes.object
};

export default Footer;