import React, { useEffect, useState } from 'react';

import './navigation.css';
import wkndlogo from '../../media/wknd-logo-light.png';
import { Link } from 'react-router-dom';
import { LinkManager } from '../../utils';
import AEMHeadless from '@adobe/aem-headless-client-js';
import PropTypes from 'prop-types';

export const NavigationGQL = `{
  screenList(filter: {
    positionInNavigation: {
      _expressions: [{
        value: "dni",
        _operator: CONTAINS_NOT
      }]
    }
  }) {
    items {
      screenName
      positionInNavigation
    }
  }
}`;

const Navigation = ({ logo }) => {
  const [nav, setNav] = useState('');
  const [expanded, setExpanded] = useState(false);

  let obj = {
    pos1: { name: '', path: '#' },
    pos2: { name: '', path: '#' },
    pos3: { name: '', path: '#' },
    pos4: { name: '', path: '#' },
    pos5: { name: 'Settings', path: '/settings' },
  };

  useEffect(() => {
    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-navigation', {locale: 'en'})
      .then((data) => {
        if (data) {
          setNav(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  nav && nav.data.screenList.items.forEach((item) => {
    let name = '';
    item._metadata.stringMetadata.forEach(meta => {
      meta.name === 'title' && (name = meta.value);
    });
    obj[item.positionInNavigation] = { name: name, path: LinkManager(item._path) };
  });

  function viewGQL() {
    console.log('view gql');
    document.querySelector('#flyout') && document.querySelector('#flyout').setAttribute('aria-expanded', true);
  }

  // let prevScrollPos = window.pageYOffset;
  // window.onscroll = function() {
  //   let currentScrollPos = window.pageYOffset;
  //   if(prevScrollPos > currentScrollPos) {
  //     document.getElementById('navbar').style.top = '0';
  //   } else {
  //     document.getElementById('navbar').style.top = '-80px';
  //   }
  //   prevScrollPos = currentScrollPos;
  // };

  return (
    <React.Fragment>
      <nav id="navbar" aria-expanded={expanded}>
        <div className='nav-hamburger' onClick={() => {
          if (expanded) setExpanded(false);
          else setExpanded(true);
          document.body.style.overflowY = expanded ? '' : 'hidden';
        }}>
          <div className='nav-hamburger-icon'></div>
        </div>
        <div className='nav-brand'>
          <Link to={'/'}><img src={logo ? logo._publishUrl : wkndlogo} alt='logo' /></Link>
        </div>
        <div className='nav-sections'>
          <ul>
            <li><Link to={obj.pos1.path} className='navItem'>{obj.pos1.name}</Link></li>
            <li><Link to={obj.pos2.path} className='navItem'>{obj.pos2.name}</Link></li>
            <li><Link to={obj.pos3.path} className='navItem'>{obj.pos3.name}</Link></li>
            <li><Link to={obj.pos4.path} className='navItem'>{obj.pos4.name}</Link></li>
            <li><Link to={obj.pos5.path} className='navItem'>{obj.pos5.name}</Link></li>
          </ul>
        </div>
        <div className='nav-tools'>
          <a href='#' className='button view-gql' aria-expanded='false' aria-controls='flyout' onClick={viewGQL}>View GraphQL</a>
        </div>
      </nav >
    </React.Fragment>
  );
};

Navigation.propTypes = {
  logo: PropTypes.object,
  config: PropTypes.object
};

export default Navigation;