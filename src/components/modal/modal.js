import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';

import './modal.css';

const Modal = ({ config, audience }) => {
  const context = useContext(AppContext);
  const currentAudience = audience || 'none';
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const updateAudience = (event) => {
    if (event.target.value === 'none') localStorage.removeItem('audience');
    else localStorage.setItem('audience', event.target.value);
  };

  const updateLanguage = (event) => {
    localStorage.setItem('lang', event.target.value);
    setLanguage(event.target.value);
  };

  const updatePage = () => {
    let {pathname} = location;
    if(pathname === '/') pathname = config.homePage._path.replace(`/content/dam/${context.project}`, '');
    pathname = pathname.replace(/(\/site\/).*(\/.*\/)/g, '$1' + language + '$2');
    window.location.replace(pathname);
  };

  const expand = (event) => {
    const parent = event.target.parentElement;
    if (parent.classList.contains('inactive')) {
      parent.setAttribute('class', 'modal active');
      event.target.value = 'Collapse Modal';
      event.target.innerText = 'Collapse Modal';
    } else {
      parent.setAttribute('class', 'modal inactive');
      event.target.value = 'Expand Modal';
      event.target.innerText = 'Expand Modal';
    }
    console.log(event.target);
  };

  const options = [
    {
      value: 'en',
      label: 'English'
    },
    {
      value: 'fr',
      label: 'Français'
    },
    {
      value: 'es',
      label: 'Español'
    },
  ];

  return (
    <div id="audience-selector" className="modal inactive">
      <button value='expand' id='expand' className='expand' onClick={expand}>Expand Modal</button>
      <div className="modal-content">
        <div className='form-element'>
          <label htmlFor='audience'>Audience</label>
          <select id="audience" name="audience" onChange={updateAudience} defaultValue={currentAudience}>
            <option key='none' value='none'>None</option>
            {config && config.audiences.map((audience) => (
              <option key={audience.toLowerCase().replaceAll(' ', '-')} value={audience.toLowerCase().replaceAll(' ', '-')}>{audience}</option>
            )
            )}
          </select>
          <label htmlFor='lang'>Language</label>
          <select id='lang' name='language' onChange={updateLanguage} defaultValue={language}>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className='form-element'>
          <label htmlFor='update'></label>
          <button value='update' id='update' onClick={() => updatePage()}>Update Page</button>
        </div>
      </div>

    </div>
  );
};

Modal.propTypes = {
  config: PropTypes.object,
  audience: PropTypes.string
};

export default Modal;
