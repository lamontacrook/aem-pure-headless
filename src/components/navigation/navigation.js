import React from 'react';

import './navigation.css';

import { Link } from 'react-router-dom';
import navGQL from '../../api/navigation.json';
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

const Navigation = ({logo}) => {

  function viewGQL() {
    document.querySelector('.fly-out-gql').style.display = 'block';
  }

  let obj = {
    pos1: { name: 'Hold', path: '#' },
    pos2: { name: 'Hold', path: '#' },
    pos3: { name: 'Hold', path: '#' },
    pos4: { name: 'Hold', path: '#' },
    pos5: { name: 'Hold', path: '#' },
    pos6: { name: 'Settings', path: '/settings' },
  };
  navGQL.data.screenList.items.forEach((item) => {
    obj[item.positionInNavigation] = { name: item.screenName, path: item._path };
  });

  return (
    <section className='navigation'>
      <div className="container">
        <img src={logo._publishUrl} alt='logo' />
        <ol>
          <li><Link to={obj.pos1.path} className='navItem'>{obj.pos1.name}</Link></li>
          <li><Link to={obj.pos2.path} className='navItem'>{obj.pos2.name}</Link></li>
          <li><Link to={obj.pos3.path} className='navItem'>{obj.pos3.name}</Link></li>
          <li><Link to={obj.pos4.path} className='navItem'>{obj.pos4.name}</Link></li>
          <li><Link to={obj.pos5.path} className='navItem'>{obj.pos5.name}</Link></li>
          <li><Link to={obj.pos6.path} className='navItem'>{obj.pos6.name}</Link></li>

        </ol>
        <a href='#' className='button view-gql' onClick={viewGQL}>View GraphQL</a>
      </div>
    </section>
  );
};

Navigation.propTypes = {
  logo: PropTypes.object
};

export default Navigation;