import React from 'react';

import './navigation.css';
import Logo from '../../media/fin-de-semana.png';
import Nav from '../api/navigation.json';
import { Link } from 'react-router-dom';

const Navigation = () => {

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
  Nav.data.screenList.items.forEach((item) => {
    obj[item.positionInNavigation] = { name: item.screenName, path: item._path };
  });

  console.log(obj);

  return (
    <section className='navigation'>
      <div className="container">
        <img src={Logo} alt='logo' />
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

export default Navigation;