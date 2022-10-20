import React from 'react';
import Teaser from '../teaser';
import PropTypes from 'prop-types';


export const componentMapping = {
  Teaser,
};

const ModelManager = ({ type, content, references }) => {
  const Component = componentMapping[type];
 
  if (typeof Component !== 'undefined')
    return <Component content={content} references={references} />;
  else return <p>Whoops!</p>;
};

ModelManager.propTypes = {
  type: PropTypes.string,
  content: PropTypes.object,
  references: PropTypes.string
};

export default ModelManager;
