import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { prepareRequest, pqs } from '../../utils';
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
    const sdk = prepareRequest(context);
    setLogo(config.configurationByPath.item.siteLogo);
    const params = {
      locale: context.lang?.value,
      project: `/content/dam/${context.project}`
    };

    sdk.runPersistedQuery(`aem-demo-assets/${pqs[context.version].nav}`, params)
      .then((data) => {
        if (data) {
          setNav(data);
          context.navigationResponse = data;
        }
      })
      .catch((error) => {
        handleError(error);
      });
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

  const getScreenName = (item) => {
    const navName = item._metadata.stringMetadata.filter(meta => {
      if (meta.name === 'title') return meta.value;
    });
    return navName[0].value;
  };

  if (nav.data && nav.data.screenList && nav.data.screenList.items) {
    nav.data.screenList.items = nav.data.screenList.items.filter((item) => {
      if(item._path.includes(context.project)) {
        return true;
      }
      else return false;
    });

    nav.data.screenList.items = nav.data.screenList.items.sort((a, b) => {
      if (a.positionInNavigation > b.positionInNavigation) return 1;
      else if (b.positionInNavigation > a.positionInNavigation) return -1;
    });
  }

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
          <Link to={'/'}><Image alt='logo' asset={logo} width={108} height={56} /></Link>
        </div>
        <div className='nav-sections'>
          <ul>
            {nav && nav.data && nav.data.screenList && nav.data.screenList.items.map((item) => (
              <li key={item._path}>
                <LinkManager className={`navItem ${className}`} item={item}>{getScreenName(item)}</LinkManager>
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