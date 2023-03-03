import React, { useState, useEffect } from 'react';

import './navigation.css';
import wkndlogo from '../../media/wknd-logo-light.png';
import { Link } from 'react-router-dom';
import { LinkManager, prepareRequest } from '../../utils';
import PropTypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import Flyout from '../../utils/flyout';

export const NavigationGQL = `query ScreenList($locale: String!) {
  screenList(
    filter: {positionInNavigation: {_expressions: [{value: "dni", _operator: CONTAINS_NOT}]}}
    _locale: $locale
  ) {
    items {
      _metadata {
        stringMetadata {
          name
          value
        }
      }
      _path
      positionInNavigation
    }
  }
}`;

const Navigation = ({ className, config, screen, context }) => {
  const [nav, setNav] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [logo, setLogo] = useState(wkndlogo);
  const handleError = useErrorHandler();

  let obj = {
    pos1: { name: '', path: '#' },
    pos2: { name: '', path: '#' },
    pos3: { name: '', path: '#' },
    pos4: { name: '', path: '#' },
    pos5: { name: 'Settings', path: '/settings' },
  };

  useEffect(() => {
    const sdk = prepareRequest(context);

    if (config && config.configurationByPath)
      setLogo(config.configurationByPath.item.siteLogo._publishUrl);



    sdk.runPersistedQuery('aem-demo-assets/gql-demo-navigation', { locale: 'en' })
      .then((data) => {
        if (data) {
          setNav(data);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  }, [handleError, config, context]);

  nav && nav.data.screenList.items.forEach((item) => {
    if (item._path.includes(context.project)) {
      let name = '';
      item._metadata.stringMetadata.forEach(meta => {
        meta.name === 'title' && (name = meta.value);
      });
      obj[item.positionInNavigation] = { name: name, path: LinkManager(item._path, config, context) };
    }
  });

  function viewGQL() {
    document.querySelector('#flyout') && document.querySelector('#flyout').setAttribute('aria-expanded', true);
    return false;
  }

  let prevScrollPos = window.pageYOffset;
  window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      if(document.getElementById('navbar')) 
        document.getElementById('navbar').style.top = '0';
    } else {
      if(document.getElementById('navbar')) 
        document.getElementById('navbar').style.top = '-80px';
    }
    prevScrollPos = currentScrollPos;
  };

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
          <Link to={'/'}><img src={logo} alt='logo' /></Link>
        </div>
        <div className='nav-sections'>
          <ul>
            <li><Link to={obj.pos1.path} className={`navItem ${className}`}>{obj.pos1.name}</Link></li>
            <li><Link to={obj.pos2.path} className={`navItem ${className}`}>{obj.pos2.name}</Link></li>
            <li><Link to={obj.pos3.path} className={`navItem ${className}`}>{obj.pos3.name}</Link></li>
            <li><Link to={obj.pos4.path} className={`navItem ${className}`}>{obj.pos4.name}</Link></li>
            <li><Link to={obj.pos5.path} className={`navItem ${className}`}>{obj.pos5.name}</Link></li>
          </ul>
        </div>
        <div className='nav-tools'>
          <button href='#' className='button view-gql' aria-expanded='false' aria-controls='flyout' onClick={viewGQL}>View GraphQL</button>
        </div>
      </nav >
      <Flyout show={false} config={config} screen={screen} context={context} />
    </React.Fragment>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
  config: PropTypes.object,
  screen: PropTypes.object,
  context: PropTypes.object
};

export default Navigation;