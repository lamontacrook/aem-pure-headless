import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './header.css';
// import Logo from '../../media/fin-de-semana.png';

const Header = ({ content }) => {

  const [header, setHeader] = useState('');
  const [logo, setLogo] = useState('');

  const viewGQL = () => {
    document.querySelector('.fly-out-gql').style.display = 'block';
  };

  useEffect(() => {
    if (!header && content._authorUrl) {
      console.log(content._authorUrl.replace('.html', '/master.content.html?wcmmode=disabled'));
      fetch(content._authorUrl.replace('.html', '/master.content.html?wcmmode=disabled'), {
        method: 'get',
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.auth}`,
          'Content-Type': 'text/html'
        })
      })
        .then((response) => {
          if (response) {
            response.text().then((html) => {

              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              setHeader(new XMLSerializer().serializeToString(doc.querySelectorAll('.cmp-navigation__group')[1]));
              //setLogo(doc.querySelector('.cmp-image--logo img').src.replace(document.location.href, `${localStorage.getItem('serviceURL')}/`));
              setLogo(doc.querySelector('.cmp-image--logo img').src.replace(document.location.href, 'https://publish-p24020-e217804.adobeaemcloud.com/'));
              
              // console.log(document.location.href);
              // setLogo(localStorage.getItem('serviceURL') + doc.querySelector('.cmp-image--logo img').src);
              // https://author-p24020-e217804.adobeaemcloud.com/content/experience-fragments/wknd-site/language-masters/en/site/header/master/_jcr_content/root/container/container_1195249223/image.coreimg.svg/1594412560447/wknd-logo-dk.svg
              // https://author-p24020-e217804.adobeaemcloud.comcontent/experience-fragments/wknd-site/language-masters/en/site/header/master/_jcr_content/root/container/container_1195249223/image.coreimg.svg/1594412560447/wknd-logo-dk.svg
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }), [content, header];


  return (
    <section className='navigation'>
      <div className="container">
        <img src={logo} alt='logo' />
        <div dangerouslySetInnerHTML={{ __html: header }} />
        
        <a href='#' className='button view-gql' onClick={viewGQL}>View GraphQL</a>
      </div>
    </section>
  );
};

Header.propTypes = {
  content: PropTypes.object
};

export default Header;