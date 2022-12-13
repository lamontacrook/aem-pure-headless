import React from 'react';
import PropsType from 'prop-types';
import './flyout.css';
import { NavigationGQL } from '../../components/navigation';
import { ConfigurationGQL } from '../../components/screen/screen';

const Flyout = ({ show, config, screen }) => {
  //const [fly, setFly] = useState('hidden');

  // document.querySelector('flyout').setAttribute('aria-expanded', 'false');



  function hideGQL() {
    document.querySelector('#flyout').setAttribute('aria-expanded', false);
  }

  function showPayload(e) {
    console.log(e.target);
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql .response.content').style.display = 'none';
    document.querySelector('.fly-out-gql .payload.content').style.display = 'unset';
    document.querySelector('.fly-out-gql .sections.content').style.display = 'none';
  }

  function showResponse(e) {
    console.log(e.target);
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql .response.content').style.display = 'unset';
    document.querySelector('.fly-out-gql .payload.content').style.display = 'none';
    document.querySelector('.fly-out-gql .sections.content').style.display = 'none';
  }

  function getSections(e) {
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    let items = [];
    document.querySelectorAll('section, header').forEach(item => {
      if (item.getAttribute('data-fragment'))
        items.push(`<a href='${localStorage.getItem('serviceURL')}editor.html${item.getAttribute('data-fragment')}' target='_blank'>${item.getAttribute('data-model')}</a>`);
    });
    document.querySelector('.fly-out-gql > .sections.content').innerHTML = `<ul><li>${items.join('</li><li>')}</li></ul>`;
    document.querySelector('.fly-out-gql .response.content').style.display = 'none';
    document.querySelector('.fly-out-gql .payload.content').style.display = 'none';
    document.querySelector('.fly-out-gql .sections.content').style.display = 'unset';
  }

  return (
    <div className='fly-out-gql payload' id='flyout' aria-expanded={show}>
      <div className='button-group'>
        <a onClick={(e) => showResponse(e)} className='button tab selected'>Show Response</a>
        <a onClick={(e) => showPayload(e)} className='button tab'>Show Request</a>
        <a onClick={(e) => getSections(e)} className='button tab'>Edit Content Fragments</a>

        <div className='tab' onClick={hideGQL}>
          <div className='flyout-icon'></div>
        </div>
      </div>
      <section id='payload' className='payload content'><Payload /></section>
      <section id='response' className='response content'><Response config={config} screen={screen} /></section>
      <section id='sections' className='sections content'></section>
    </div>
  );
};


Flyout.propTypes = {
  show: PropsType.bool,
  config: PropsType.object,
  screen: PropsType.object
};

const Payload = () => {
  return (
    <React.Fragment>
      <fieldset className='code-block'>
        <legend>Navigation</legend>
        <pre>{NavigationGQL}</pre>
      </fieldset>
      <fieldset className='code-block'>
        <legend>Configuration</legend>
        <pre>{ConfigurationGQL}</pre>
      </fieldset>
    </React.Fragment>
  );
};

const Response = ({ config, screen }) => {
  console.log(JSON.stringify(config, null, 2));
  return (
    <React.Fragment>
      <fieldset className='code-block'>
        <legend>Configuration</legend>
        <pre>{JSON.stringify(config, null, 1)}</pre>
      </fieldset>
      <fieldset className='code-block'>
        <legend>Screen</legend>
        <pre>{JSON.stringify(screen, null, 1)}</pre>
      </fieldset>
    </React.Fragment>
  );
};

Response.propTypes = {
  config: PropsType.object,
  screen: PropsType.object
};



export default Flyout;