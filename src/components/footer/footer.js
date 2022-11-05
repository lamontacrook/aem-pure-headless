import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './footer.css';

const Footer = ({ config }) => {
  const [footer, setFooter] = useState('');

  // const decorateFooter = (html) => {
  //   const parser = new DOMParser();
  //   let doc = parser.parseFromString(html, 'text/html');

  //   doc = externalizeResources(doc, 'img', 'src');
  //   doc = externalizeResources(doc, 'script', 'src');
  //   doc = externalizeResources(doc, 'link', 'href');
    
  //   return new XMLSerializer().serializeToString(doc);
  // };

  // const externalizeResources = (doc, tag, attribute) => {
  //   const pub = localStorage.getItem('serviceURL').replace('author', 'publish') + '/';
  //   for(let i in doc.getElementsByTagName(tag)) {
  //     let element = doc.getElementsByTagName(tag)[i];
  //     element[attribute] && (element[attribute] = element[attribute].replace(document.location.href, pub));
  //   }
  //   return doc;
  // };


  useEffect(() => {
    // console.log(footer);
    fetch(config.replace('.html', '.plain.html?wcmmode=disabled'), {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.auth}`,
        'Content-Type': 'text/html'
      })
    })
      .then((response) => {
        if (response) {
          response.text().then((html) => {
            // setFooter(decorateFooter(html));
            if(html) {
              // console.log(html);
              // setFooter(decorateFooter(html));
              setFooter(html);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, [footer, config]);

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