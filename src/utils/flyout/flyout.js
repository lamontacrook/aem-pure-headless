import React, { useState, useEffect } from 'react';
import PropsType from 'prop-types';
import './flyout.css';
import { NavigationGQL } from '../../components/navigation';
import { ConfigurationGQL, ScreenGQL } from '../../components/screen';

const Flyout = ({ show, config, screen, context }) => {
  const [response, setResponse] = useState({});
  const [configResponse, setConfigResponse] = useState({});
  const [blocks, setBlocks] = useState({});

  useEffect(() => {
    setResponse(screen);
    setConfigResponse(config);

    let components = {
      Header: screen.screen.body.header._path
    };

    screen.screen.body.block && screen.screen.body.block.forEach(e => {
      let title = '';

      if (e._metadata) {
        e._metadata.stringMetadata.forEach(y => {
          if (y.name === 'title')
            title = y.value;
        });
      }
      components[title] = e._path;

      setBlocks(components);

    });

  }, [screen, config]);

  function hideGQL() {
    document.querySelector('#flyout').setAttribute('aria-expanded', false);
  }

  function showPayload(e) {

    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql .response.content').style.display = 'none';
    document.querySelector('.fly-out-gql .payload.content').style.display = 'unset';
    document.querySelector('.fly-out-gql .sections.content').style.display = 'none';
  }

  function showResponse(e) {

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
    // let items = [];
    // document.querySelectorAll('section, header').forEach(item => {
    //   if (item.getAttribute('data-fragment'))
    //     items.push(`<a href='${context.serviceURL}editor.html${item.getAttribute('data-fragment')}' target='_blank'>${item.getAttribute('data-model')}</a>`);
    // });
    // document.querySelector('.fly-out-gql > .sections.content').innerHTML = `<ul><li>${items.join('</li><li>')}</li></ul>`;
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
      <section id='payload' className='payload content'>
        <fieldset className='code-block'>
          <legend>Screen</legend>
          <pre>{ScreenGQL}</pre>
        </fieldset>
        <fieldset className='code-block'>
          <legend>Navigation</legend>
          <pre>{NavigationGQL}</pre>
        </fieldset>
        <fieldset className='code-block'>
          <legend>Configuration</legend>
          <pre>{ConfigurationGQL}</pre>
        </fieldset>
      </section>
      <section id='response' className='response content'>
        <fieldset className='code-block'>
          <legend>Screen</legend>
          <pre>{JSON.stringify(response, null, 1)}</pre>
        </fieldset>
        <fieldset className='code-block'>
          <legend>Configuration</legend>
          <pre>{JSON.stringify(configResponse, null, 1)}</pre>
        </fieldset>
      </section>
      <section id='sections' className='sections content'>
        <ul>
          {blocks && Object.keys(blocks).map((title) =>
            <li key={blocks[title]}>
              <a href={context.serviceURL + 'editor.html' + blocks[title]} rel='noreferrer' target='_blank'>{title}</a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};


Flyout.propTypes = {
  show: PropsType.bool,
  config: PropsType.object,
  screen: PropsType.object,
  context: PropsType.object
};




export default Flyout;