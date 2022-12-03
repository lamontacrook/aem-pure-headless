import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { externalizeImagesFromHtml } from '../../utils';
import './footer.css';

const Footer = ({ config }) => {
  const [footer, setFooter] = useState('');

  useEffect(() => {
    fetch(config.replace('.html', '.content.html?wcmmode=disabled'), {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.auth}`,
        'Content-Type': 'text/html'
      })
    })
      .then((response) => {
        if (response) {
          response.text().then((html) => {
            if(html) {
              setFooter(externalizeImagesFromHtml(html));
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, [footer, config]);

  return (
    <React.Fragment>
      <div className="footer-xf" dangerouslySetInnerHTML={{ __html: footer }} />
    </React.Fragment>
  );
};

Footer.propTypes = {
  config: PropTypes.string
};

export default Footer;