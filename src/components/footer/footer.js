import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { externalizeImagesFromHtml } from '../../utils';
import './footer.css';

const Footer = ({ config }) => {
  const [footer, setFooter] = useState('');

  useEffect(() => {
    //if(!_publishUrl && !_authorUrl) return;

    const usePub = true; //JSON.parse(localStorage.getItem('publish'));

    const url = usePub ?
      config._publishUrl.replace('.html', '.content.html') :
      config._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    const headers = usePub ?
      new Headers({
        'Authorization': `Bearer ${localStorage.auth}`,
        'Content-Type': 'text/html'
      }) :
      new Headers({
        'Authorization': `Bearer ${localStorage.auth}`,
        'Content-Type': 'text/html',
      });

    fetch(url, {
      method: 'get',
      headers: headers,
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
    })
      .then((response) => {
        if (response) {
          response.text().then((html) => {
            if (html) {
              setFooter(externalizeImagesFromHtml(html));
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }, [config]);

  return (
    <React.Fragment>
      <div className="footer-xf" dangerouslySetInnerHTML={{ __html: footer }} />
    </React.Fragment>
  );
};

Footer.propTypes = {
  config: PropTypes.object
};

export default Footer;