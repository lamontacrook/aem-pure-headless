import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { prepareRequest } from '../../utils';
import LinkManager from '../../utils/link-manager';
import PropTypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import Flyout from '../../utils/flyout';
import { AppContext } from '../../utils/context';
import Image from '../image/image';
import './navigation.css';

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

const Navigation = ({ className, config, screen }) => {
  const context = useContext(AppContext);
  const [nav, setNav] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [logo, setLogo] = useState({});
  const handleError = useErrorHandler();

  useEffect(() => {
    function fetchNav() {
      const sdk = prepareRequest(context);
      setLogo(config.configurationByPath.item.siteLogo);
      const params = {
        locale: context.lang?.value,
        project: `/content/dam/${context.project}`
      };

      sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.nav}`, params)
        .then((data) => {
          if (data) {
            setNav(data);
            context.navigationResponse = data;
          }
        })
        .catch((error) => {
          handleError(error);
        });
    }

    if(Object.keys(context.navigationResponse).length === 0) fetchNav();
  }, [handleError, config, context]);

  function viewGQL() {
    document.querySelector('#flyout') && document.querySelector('#flyout').setAttribute('aria-expanded', true);
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
          <Link to={'/'}><Image alt='logo' asset={logo} imageProps={{}} width={108} height={56} /></Link>
        </div>
        <div className='nav-sections'>
          <ul>
            {nav && nav.data?.screenV2List?.items.map((item, i) => (
              <li key={i}>
                <LinkManager className={`navItem ${className}`} item={item}>{item.screenTitle}</LinkManager>
              </li>
            ))}
            <li><Link to={'/settings'} className={`navItem ${className}`} name={'Settings'}>{'Settings'}</Link></li>
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