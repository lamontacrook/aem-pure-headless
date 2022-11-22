import React from 'react';
import Proptypes from 'prop-types';

import './pageref.css';

const PageRef = ({content}) => {
  console.log(content);
  return (
    <h1>{content._authorUrl}</h1>
  );
};

PageRef.propTypes = {
  content: Proptypes.object
};

export default PageRef;