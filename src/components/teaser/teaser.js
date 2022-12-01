
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';

import './teaser.css';
import { LinkManager } from '../../utils';

export const TeaserGQL = `
  ..on TeaserModel {
    _model {
      title
      _path
    }
    title
    preTitle
    asset {
      ...on MultimediaRef {
        _authorUrl
        format
        _publishUrl
      }
    }
    description {
      html
    }
    callToAction
  }`;


const Teaser = ({ content, config }) => {
  useEffect(() => {
   
  }, []);
  
  return (
    <React.Fragment>


      <section className={'teaser ' + content.style} data-model={content.title} data-fragment={content._path}>

        <div className='container'>
          {content.asset && Object.prototype.hasOwnProperty.call(content.asset, 'format') &&
            (<Video content={content.asset} />)}

          {content.asset && Object.prototype.hasOwnProperty.call(content.asset, 'mimeType') &&
            (<Image src={content.asset._publishUrl} config={config} width={content.asset.width} height={content.asset.height} />)}

          <div className='content-block'>
            {content.title && content.style === 'hero' && (
              <h1>{content.title}</h1>
            )}

            {content.title && content.style === 'featured' && (
              <h2>{content.title}</h2>
            )}

            <span className='seperator'></span>

            {content.preTitle && content.style === 'hero' && (
              <h2>{content.preTitle}</h2>
            )}

            {content.preTitle && content.style === 'featured' && (
              <h5>{content.preTitle}</h5>
            )}


            {content.description && content.style === 'featured' && (
              <p>{content.description.plaintext}</p>
            )}

            {content.callToAction && content.callToActionLink && (
              <a href={LinkManager(content.callToActionLink._path, config)} className='button'>{content.callToAction}</a>
            )}
          </div>
        </div>

        <div className='arrow'></div>

      </section>

    </React.Fragment>
  );
};

Teaser.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

export default Teaser;
