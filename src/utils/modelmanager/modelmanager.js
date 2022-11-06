import React from 'react';
import Teaser from '../../components/teaser';
import ImageList from '../../components/imagelist';
import PropTypes from 'prop-types';


export const componentMapping = {
  Teaser,
  ImageList
};

const ModelManager = ({ type, content, references }) => {
  type = type.replace(/\s/g, '');
  const Component = componentMapping[type];
 
  if (typeof Component !== 'undefined')
    return <Component content={content} references={references} />;
  else return <p>Neet to add {type} to ModelManager.</p>;
};

ModelManager.propTypes = {
  type: PropTypes.string,
  content: PropTypes.object,
  references: PropTypes.string
};

export default ModelManager;
