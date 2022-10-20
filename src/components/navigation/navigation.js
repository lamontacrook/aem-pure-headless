import React from 'react';

import './navigation.css';
import Logo from '../../media/fin-de-semana.png';
import Nav from '../api/navigation.json';

const Navigation = () => {
  let obj = {
    pos1: { name: 'Hold', path: '#' },
    pos2: { name: 'Hold', path: '#' },
    pos3: { name: 'Hold', path: '#' },
    pos4: { name: 'Hold', path: '#' },
    pos5: { name: 'Hold', path: '#' },
    pos6: { name: 'Hold', path: '#' },
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
          <li><a href={obj.pos1.path} className='navItem'>{obj.pos1.name}</a></li>
          <li><a href={obj.pos2.path} className='navItem'>{obj.pos2.name}</a></li>
          <li><a href={obj.pos3.path} className='navItem'>{obj.pos3.name}</a></li>
          <li><a href={obj.pos4.path} className='navItem'>{obj.pos4.name}</a></li>
          <li><a href={obj.pos5.path} className='navItem'>{obj.pos5.name}</a></li>
          <li><a href={obj.pos6.path} className='navItem'>{obj.pos6.name}</a></li>

        </ol>
        <a href='#' className='button contact-us'>Contact Us</a>
      </div>
    </section>
  );
};

export default Navigation;