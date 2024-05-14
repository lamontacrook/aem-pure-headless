import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../image';
import { mapJsonRichText } from '../../utils/renderRichText';
import { editorProps } from '../../utils/ue-definitions';

import './magazine-article.css';

const imageSizes = [
  {
    imageWidth: '660px',
    renditionName: 'web-optimized-large.webp',
    size: '(min-width: 1000px) 660px'
  },
  {
    imageWidth: '1000px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '800px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '600px',
    renditionName: 'web-optimized-large.webp',
  },
  {
    imageWidth: '412px',
    renditionName: 'web-optimized-medium.webp',
  },
  {
    size: '100vw',
  }
];
const imageProps = {
  'data-aue-prop': 'asset',
  'data-aue-type': 'media',
  'data-aue-label': 'Asset'
};
const MagazineArticle = ({ content, references }) => {
  return (
    <div className='article-screen' {...editorProps(content, 'Article', 'block', 'container', 'component')}>
      <span className='title' {...editorProps(content, 'Article', 'headline', 'reference', 'component')}>{mapJsonRichText(content.headline.json)}</span>
      <div className='body'>{mapJsonRichText(content.article.json, customRenderOptions(references))}</div>
    </div>
  );
};

function customRenderOptions(references) {

  const renderReference = {
    // node contains merged properties of the in-line reference and _references object
    'ImageRef': (node) => {
      // when __typename === ImageRef
      // return <img src={node._path} alt={'in-line reference'} />;
      return <Image imageProps={imageProps} asset={node} imageSizes={imageSizes} />;
    },
    'AdventureModel': (node) => {
      // when __typename === AdventureModel
      return <Link to={`/adventure:${node.slug}`}>{`${node.title}: ${node.price}`}</Link>;
    }
  };

  return {
    nodeMap: {
      'reference': (node, children) => {

        // variable for reference in _references object
        let reference;

        // asset reference
        if (node.data.path) {
          // find reference based on path
          reference = references.find(ref => ref._path === node.data.path);
        }
        // Fragment Reference
        if (node.data.href) {
          // find in-line reference within _references array based on href and _path properties
          reference = references.find(ref => ref._path === node.data.href);
        }

        // if reference found return render method of it
        return reference ? renderReference[reference.__typename]({ ...reference, ...node }) : null;
      }
    },
  };
}


MagazineArticle.propTypes = {
  content: Proptypes.object,
  references: Proptypes.oneOfType([Proptypes.object, Proptypes.array])
};

export default MagazineArticle;