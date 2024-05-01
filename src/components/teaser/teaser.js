
import React from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { TextWithPlaceholders } from '../../utils/placeholders';
import LinkManager from '../../utils/link-manager';
import './teaser.css';

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


const imageSizesHero = [
  {
    imageWidth: '1600px',
    renditionName: 'web-optimized-xlarge.webp',
  },
  {
    imageWidth: '1200px',
    renditionName: 'web-optimized-xlarge.webp',
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
    renditionName: 'web-optimized-medium.webp',
  },
  {
    imageWidth: '412px',
    renditionName: 'web-optimized-small.webp',
  },
  {
    size: '100vw',
  }
];

const Teaser = ({ content }) => {
  let inFrame = false;
  if (window.location !== window.parent.location) {
    inFrame = true;
  }

  const renderAsset = ({ asset }) => {
    const imageProps = {
      'data-aue-prop':'asset',
      'data-aue-type':'media',
      'data-aue-label':'Asset'
    };
    if (asset && Object.prototype.hasOwnProperty.call(content.asset, 'format'))
      return (<Video content={content.asset} />);
    else if (asset && Object.prototype.hasOwnProperty.call(content.asset, 'mimeType'))
      return (<Image imageProps={imageProps} asset={content.asset} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes} />);
    else
      return (<Image imageProps={imageProps} asset={content.asset} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes} />);
  };


  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/${content?._variation}`,
    'data-aue-type': 'reference',
    'data-aue-label': content?.title,
    'data-aue-model': content?._model?._path,
    'data-aue-behavior': 'component'
  };

  return (
    <div {...editorProps}>
      <section className={'teaser ' + content.style + (inFrame ? ' iframe' : '')}>
        <div className='container'>
          {renderAsset(content)}

          <div className='content-block'>
            {content.title && content.style === 'hero' && (
              <h1 data-aue-prop='title' data-aue-type='text' data-aue-label='Title'>{content.title}</h1>
            )}

            {content.title && content.style === 'featured' && (
              <h2 data-aue-prop='title' data-aue-type='text' data-aue-label='Title'>{content.title}</h2>
            )}

            <span className='seperator'></span>

            {content.preTitle && content.style === 'hero' && (
              <h2 data-aue-prop='preTitle' data-aue-type='text' data-aue-label='Pre-Title'>{content.preTitle}</h2>
            )}

            {content.preTitle && content.style === 'featured' && (
              <h5 data-aue-prop='preTitle' data-aue-type='text' data-aue-label='Pre-Title'>{content.preTitle}</h5>
            )}

            {content.description && content.style === 'featured' && (
              <p data-aue-prop='description' data-aue-type='text' data-aue-label='Description'><TextWithPlaceholders>{content.description.plaintext}</TextWithPlaceholders></p>
            )}

            {content.callToAction && content.callToActionLink && content.style === 'featured' && (
              <LinkManager item={content} className='button'>{content.callToAction}</LinkManager>
            )}
          </div>
        </div>

        <div className='arrow'></div>

      </section>

    </div>
  );
};

Teaser.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Teaser;
