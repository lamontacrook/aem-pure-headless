import React, { useState, useEffect, useContext } from 'react';

import './navigation.css';
import { Link } from 'react-router-dom';
import { LinkManager, prepareRequest, rootPath } from '../../utils';
import PropTypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import Flyout from '../../utils/flyout';
import { AppContext } from '../../utils/context';
import Image from '../image/image';

export const NavigationGQL = `query ScreenList($locale: String!, $project: ID="/content/dam/bestbuy", $limit: Int=6) {
  screenList(
    filter: {
      _path: {
        _expressions: [
          {
            value: $project
            _operator:STARTS_WITH
          }
        ]
      }
      positionInNavigation: {
        _expressions: [
          {
            value: "dni", 
            _operator: CONTAINS_NOT
          }
        ]
      }
    }
    _locale: $locale
    limit:$limit
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
}
`;

const Navigation = ({ className, config, screen }) => {
  const context = useContext(AppContext);
  const [nav, setNav] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [logo, setLogo] = useState({});
  const handleError = useErrorHandler();

  useEffect(() => {
    const sdk = prepareRequest(context);
    setLogo(config.configurationByPath.item.siteLogo);

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-navigation-v2', { locale: 'en', project: `/${rootPath}/${context.project}` })
      .then((data) => {
        if (data) {
          setNav(data);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  }, [handleError, config, context]);

  function getName(obj) {
    let name = '';
    obj._metadata.stringMetadata.forEach((elem) => {
      if (elem.name === 'title')
        name = elem.value;
    });
    return name;
  }

  function viewGQL() {
    document.querySelector('#flyout') && document.querySelector('#flyout').setAttribute('aria-expanded', true);
    return false;
  }

  function dropDown(elem) {
    elem.preventDefault();
    return false;
  }

  let prevScrollPos = window.pageYOffset;
  window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      if (document.getElementById('navbar'))
        document.getElementById('navbar').style.top = '0';
    } else {
      if (document.getElementById('navbar'))
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
          <Link to={'/'}><Image asset={logo} /></Link>
        </div>
        <div className='nav-sections'>
          {/* {nav && nav.data && nav.data.screenList && ( */}
          <ul>
            {nav.data && nav.data.screenList.items.map((item) => (
              <li key={item.positionInNavigation} className='nav-drop'>
                <Link to={LinkManager(item._path, config, context)} className={`navItem ${className}`}>{getName(item)}</Link>
              </li>
            ))}
            <li><Link to='/settings' className={`navItem ${className}`}>Settings</Link></li> 
          </ul>
        </div>
        <div className='nav-tools'>
          <button href='#' className='button view-gql' aria-expanded='false' aria-controls='flyout' onClick={viewGQL}>View GraphQL</button>
        </div>
      </nav >
      <Flyout show={false} config={config} screen={screen} />
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