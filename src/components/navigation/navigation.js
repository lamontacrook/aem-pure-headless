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

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-navigation')
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
    obj[item.positionInNavigation] = { name: item.screenName, path: LinkManager(item._path) };
  });

  function viewGQL() {
    document.querySelector('.fly-out-gql').style.display = 'block';
  }

  return (
    <nav>
      <section className='navigation'>
        <div className="container">
          <Link to={'/'}><img src={logo ? logo._publishUrl : wkndlogo} alt='logo' /></Link>
          <ol>
            <li><Link to={'/' + obj.pos1.path} className='navItem'>{obj.pos1.name}</Link></li>
            <li><Link to={'/' + obj.pos2.path} className='navItem'>{obj.pos2.name}</Link></li>
            <li><Link to={'/' + obj.pos3.path} className='navItem'>{obj.pos3.name}</Link></li>
            <li><Link to={'/' + obj.pos4.path} className='navItem'>{obj.pos4.name}</Link></li>
            <li><Link to={obj.pos5.path} className='navItem'>{obj.pos5.name}</Link></li>
          </ol>
          <a href='#' className='button view-gql' onClick={viewGQL}>View GraphQL</a>
        </div>
      </section>
    </nav>
  );
};

Navigation.propTypes = {
  logo: PropTypes.object
};

export default Navigation;