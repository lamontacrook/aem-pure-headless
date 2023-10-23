/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './error.css';

const Error = ({ error, resetErrorBoundary }) => {
  let inFrame = false;
  if (window.location !== window.parent.location) {
    inFrame = true;
  }

  return (
    <div className={'main-body error' + (inFrame ? ' iframe' : '')}>
      <div className="alert" role="alert">
        <h1>{error.heading}</h1>
        <pre>{error.message}</pre>
        <div className='controls'>
          <a className='button' onClick={resetErrorBoundary}>Try again</a>
          <Link to='/settings' onClick={() => window.location.pathname = '/settings'} className='button'>Configure Settings</Link>
        </div>
      </div>
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func
};

export default Error;

