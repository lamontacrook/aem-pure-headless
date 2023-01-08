import React from 'react';
import Teaser from '../../components/teaser';
import ImageList from '../../components/imagelist';
import PageRef from '../../components/pageref';
import PropTypes from 'prop-types';


export const componentMapping = {
  Teaser,
  ImageList,
  PageRef
};

const ModelManager = ({ type, content, config, context }) => {
  type = type.replace(/Model/g, '');
  const Component = componentMapping[type];
 
  if (typeof Component !== 'undefined')
    return <Component content={content} config={config} context={context} />;
  else return <p>Neet to add {type} to ModelManager.</p>;
};

ModelManager.propTypes = {
  type: PropTypes.string,
  content: PropTypes.object,
  references: PropTypes.string,
  config: PropTypes.object,
  context: PropTypes.object
};

export default ModelManager;
