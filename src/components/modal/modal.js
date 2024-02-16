import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

import './modal.css';

const Modal = ({ config }) => {
  const context = useContext(AppContext);
  const [language, setLanguage] = useState(JSON.parse(localStorage.getItem('lang')) || {value: 'English', label: 'en'});
  const [audience, setAudience] = useState(JSON.parse(localStorage.getItem('audience')));

  console.log(language.label);

  // JSON.parse(localStorage.getItem('lang')).then((item) => {
  //   console.log(item);
  // });

  const updateAudience = (event) => {
    localStorage.setItem('audience', JSON.stringify(event));
  };

  const updateLanguage = (event) => {
    localStorage.setItem('lang', JSON.stringify(event));
  };

  const updatePage = () => {
    let { pathname } = location;
    if (pathname === '/') pathname = config.homePage._path.replace(`/content/dam/${context.project}`, '');
    pathname = pathname.replace(/(\/site\/).*(\/.*\/)/g, '$1' + language + '$2');
    window.location.replace(pathname);
  };

  const expand = (event) => {
    // const parent = event.target.parentElement;
    // if (parent.classList.contains('inactive')) {
    //   parent.setAttribute('class', 'modal active');
    //   event.target.value = 'Collapse Modal';
    //   event.target.innerText = 'Collapse Modal';
    // } else {
    //   parent.setAttribute('class', 'modal inactive');
    //   event.target.value = 'Expand Modal';
    //   event.target.innerText = 'Expand Modal';
    // }
    // console.log(event.target);
  };

  const expandModal = (event) => {
    // const m = event.target;
    // console.log(m);
    // m.classList.add('expand');
  };

  const _langOptions = {
    en: 'English',
    fr: 'Français',
    es: 'Español'
  };

  const langOptions = [];

  config?.languages.map((lang) => {
    langOptions.push({value: lang, label: _langOptions[lang]});
  });

  console.log(langOptions);

  const audienceOptions = [];

  config?.audiences.map((audience) => {
    audienceOptions.push({value: audience.toLowerCase().replaceAll(' ', '-'), label: audience});
  });

  console.log(audienceOptions);

  const animatedComponents = makeAnimated();

  return (
    <div id="audience-selector" className="modal active" onMouseEnter={expand}>
      <div className="modal-content">
        <div className='form-element'>
          <label htmlFor='audience'>Audience</label>
          <Select id="audience" 
            name="audience" 
            defaultInputValue={audience.label} 
            onChange={updateAudience}
            components={animatedComponents} 
            options={audienceOptions} />
          {/* <option key='none' value='none'>None</option>
            {config && config.audiences && config.audiences.map((audience) => (
              <option key={audience.toLowerCase().replaceAll(' ', '-')} value={audience.toLowerCase().replaceAll(' ', '-')}>{audience}</option>
            )
            )}
          </Select> */}
          <label htmlFor='lang'>Language</label>
          <Select id='lang' 
            name='language' 
            onChange={updateLanguage} 
            defaultInputValue={language.label} 
            options={langOptions} />
          {/* {Object.entries(langOptions).map(([ key, value ]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select> */}
          <label htmlFor='update'></label>
          <button value='update' id='update' onClick={() => updatePage()}>Update Page</button>
        </div>
      </div>

    </div>
  );
};

Modal.propTypes = {
  config: PropTypes.object,
};

export default Modal;
