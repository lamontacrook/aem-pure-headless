import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { updateCss } from '../screen';
import './modal.css';

const Modal = ({ config }) => {
  const context = useContext(AppContext);
  const updateCSSList = (item) => {
    let repeat = false;
    cssList.forEach((css) => {
      if (css === item.label) repeat = true;
    });
    console.log(repeat);
    if (!repeat) {
      setCSSList([...cssList, item.label]);
      console.log(cssList);
    }
  };

  const [language, setLanguage] = useState(JSON.parse(localStorage.getItem('lang')) || { value: 'en', label: 'English' });
  const [audience, setAudience] = useState(JSON.parse(localStorage.getItem('audience')));
  let [cssVariables, setCSSVariables] = useState([]);
  const [cssList, setCSSList] = useState([]);

  useEffect(() => {

  }, []);

  const updateAudience = (event) => {
    if(event === null) {
      localStorage.removeItem('audience');
    } else {
      localStorage.setItem('audience', JSON.stringify(event));
      setAudience(event);
    }
  };

  const updateLanguage = (event) => {
    localStorage.setItem('lang', JSON.stringify(event));
    setLanguage(event);
  };

  const updatePage = () => {
    let { pathname } = location;
    if (pathname === '/') pathname = config.homePage._path.replace(`/content/dam/${context.project}`, '');
    pathname = pathname.replace(/(\/site\/).*(\/.*\/)/g, '$1' + language.value + '$2');
    window.location.replace(pathname);
  };

  const expand = (event) => {
    event.target.classList.replace('inactive', 'active');
    const vars = Array.from(document.styleSheets)
      .filter(
        sheet =>
          sheet.href === null || sheet.href.startsWith(window.location.origin)
      )
      .reduce((acc, sheet) => (acc = [
        ...acc,
        ...Array.from(sheet.cssRules).reduce(
          (def, rule) => (def =
            rule.selectorText === ':root'
              ? [
                ...def,
                ...Array.from(rule.style).filter(name =>
                  name.startsWith('--')
                )
              ] : def),
          []
        )
      ]), []);

    const arry = vars.map((item) => {
      return { value: item, label: item };
    });
    console.log(arry);
    setCSSVariables(arry);
  };

  const _langOptions = {
    en: 'English'
  };

  const langOptions = [];

  config?.languages.map((lang) => {
    langOptions.push({ value: lang, label: _langOptions[lang] });
  });

  const audienceOptions = [];

  config?.audiences.map((audience) => {
    audienceOptions.push({ value: audience.toLowerCase().replaceAll(' ', '-'), label: audience });
  });

  const closePanel = (event) => {
    document.querySelector('.modal.active').classList.replace('active', 'inactive');
    event.preventDefault();
    return false;
  };

  const updateCSS = (event) => {
    if (event.key == 'Enter') {
      const root = document.querySelector(':root');
      root.style.setProperty(event.target.name, event.target.value);
      if (sessionStorage.getItem('css')) {
        const currentVal = sessionStorage.getItem('css');
        let match = false;
        const currentVals = currentVal.split(',').map((item) => {
          const vals = item.split(':');
          if (vals[0] == event.target.name) {
            vals[1] = event.target.value;
            match = true;
          }
          return vals.join(':');
        });
        if (match) sessionStorage.setItem('css', currentVals.join(','));
        else sessionStorage.setItem('css', `${currentVals.join(',')},${event.target.name}:${event.target.value}`);
      } else {
        sessionStorage.setItem('css', `${event.target.name}:${event.target.value}`);
      }
    }
  };

  const downLoadConfig = () => {
    const href = document.createElement('a');
    const arry = JSON.stringify(sessionStorage.getItem('css').split(',').map(item => item));
    const blob = new Blob([arry], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    href.href = url;
    href.download = `${context.project}.json`;
    href.click();
    window.URL.revokeObjectURL(url);
  };

  const handleConfiguration = (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const content = reader.result;
      sessionStorage.setItem('css', content.replaceAll('"', '').replaceAll('[', '').replaceAll(']', ''));
      updateCss();
    };

    reader.onerror = function () {
      console.error('Error reading the file');
    };

    reader.readAsText(file, 'utf-8');
  };

  const animatedComponents = makeAnimated();
  console.log(audience);
  console.log(language);
  return (
    <div id="audience-selector" className="modal inactive" onMouseEnter={expand}>
      <button className='close' onClick={closePanel}>Close</button>
      <div className="modal-content">
        <div className='form-element'>
          <label htmlFor='audience'>Audience</label>
          <Select id="audience"
            name="audience"
            defaultValue={audience}
            isClearable={true}
            onChange={updateAudience}
            components={animatedComponents}
            options={audienceOptions} />
          <label htmlFor='lang'>Language</label>
          <Select id='lang'
            name='language'
            onChange={updateLanguage}
            defaultValue={language}
            isClearable={false}
            formatGroupLabel={'Languages'}
            options={langOptions} />
          <label htmlFor='update'></label>
          <button value='update' id='update' onClick={() => updatePage()}>Update Page</button>
          <label htmlFor='cssVars'>CSS Variables</label>
          <Select id='cssVars'
            name='css-vars'
            onChange={updateCSSList}
            options={cssVariables} />
        </div>
        <div className='form-element'>
          {cssList.map((item) => (
            <React.Fragment key={item}>
              <label key={`${item}-label`} htmlFor={item}>{item}</label>
              <input key={`${item}-input`} id={item} name={item} onKeyUp={updateCSS} />
            </React.Fragment>
          ))}
        </div>
        <div className='form-element'>
          <button onClick={downLoadConfig}>Save Configuration</button>
          <input id='configuration' type='file' onChange={handleConfiguration} />
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  config: PropTypes.object,
};

export default Modal;
