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

const ModelManager = ({ content, config }) => {
  const type = content.__typename.replace(/Model/g, '');

  const editorProps2 = {
    'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/master`,
    'data-aue-type': 'reference',
    'data-aue-label': `${type} (${content.style})`,
    'data-aue-model': content?._model?._path
  };
  
  console.log(editorProps2);

  const Component = componentMapping[type];
 
  if (typeof Component !== 'undefined')
    return <Component content={content} config={config} />;
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
