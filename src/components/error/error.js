import React from 'react';
import PropTypes from 'prop-types';
import './error.css';

const Error = ({ error, resetErrorBoundary }) => {
  return (
    <div className='main-body error'>
      <div className="alert" role="alert">
        <h1>{error.heading}</h1>
        <pre>{error.message}</pre>
        <button className='button' onClick={resetErrorBoundary}>Try again</button>
      </div>
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func
};

export default Error;

