import React from 'react';
import gql from '../../api/gql.json';
import { ScreenQry } from '../../api/query';
import PropsType from 'prop-types';

import './flyout.css';

const Flyout = ({ show }) => {
  //const [fly, setFly] = useState('hidden');

  // document.querySelector('flyout').setAttribute('aria-expanded', 'false');



  function hideGQL() {
    document.querySelector('#flyout').setAttribute('aria-expanded', false);
  }

  function showPayload(e) {
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<pre>${ScreenQry()}</pre>`;
  }

  function showResponse(e) {
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<pre>${JSON.stringify(gql, null, 2)}</pre>`;
  }

  function getSections(e) {
    document.querySelectorAll('.selected').forEach(item => {
      item.classList.toggle('selected');
    });
    e.target.classList.toggle('selected');
    let items = [];
    document.querySelectorAll('section, header').forEach(item => {
      console.log(item);
      if (item.getAttribute('data-fragment'))
        items.push(`<a href='${localStorage.getItem('serviceURL')}editor.html${item.getAttribute('data-fragment')}' target='_blank'>${item.getAttribute('data-model')}</a>`);
    });
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<ul><li>${items.join('</li><li>')}</li></ul>`;
  }

  return (
    <div className='fly-out-gql payload' id='flyout' aria-expanded={show}>
      <div className='button-group'>
        <a onClick={(e) => showResponse(e)} className='button tab'>Show Response</a>
        <a onClick={showPayload} className='button tab'>Show Request</a>
        <a onClick={getSections} className='button tab'>Edit Content Fragments</a>
        
        <div className='tab' onClick={hideGQL}>
          <div className='flyout-icon'></div>
        </div>
      </div>
      <section className='content'><pre>{JSON.stringify(gql, null, 1)}</pre></section>
    </div>
  );
};

Flyout.propTypes = {
  show: PropsType.bool
};

export default Flyout;