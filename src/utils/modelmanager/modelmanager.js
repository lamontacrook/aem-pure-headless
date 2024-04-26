import React from 'react';
import Teaser from '../../components/teaser';
import ImageList from '../../components/imagelist';
import MagazineArticle from '../../components/magazine-article';
import PropTypes from 'prop-types';

export const componentMapping = {
  Teaser,
  ImageList,
  MagazineArticle
};

const ModelManager = ({ content, config, references }) => {
  const type = content.__typename.replace(/Model/g, '');
  const Component = componentMapping[type];
 
  if (typeof Component !== 'undefined')
    return <Component content={content} config={config} references={references} />;
  else return <p>Neet to add {type} to ModelManager.</p>;
};

ModelManager.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  references: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ModelManager;
