import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './footer.css';

const Footer = ({ config }) => {
  const [footer, setFooter] = useState('');

  const decorateFooter = (html) => {
    const parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');

    let body = externalizeImages(doc.querySelector('body'));
    
    let grid = body.querySelector('.aem-Grid');

    // let top = document.createElement('div');
    // top.setAttribute('class', 'top-grid');
    // top.appendChild(grid.querySelector('image'));
    // top.appendChild(grid.appendChild('navigation'));
    // top.appendChild(grid.querySelector('title'));
    
    // console.log(top);
    return body.innerHTML;


  };

  const externalizeImages = (doc) => {
    const pub = localStorage.getItem('serviceURL').replace('author', 'publish') + '/';
    for(let i in doc.getElementsByTagName('img')) {
      let image = doc.getElementsByTagName('img')[i];
      image['src'] && (image['src'] = image.src.replace(document.location.href, pub));
    }
    return doc;
  };

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
            setFooter(decorateFooter(html));
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setFooter(config);
  }, [config, decorateFooter]);

  // console.log(footer);

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