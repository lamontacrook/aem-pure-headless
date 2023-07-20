
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { Link } from 'react-router-dom';
import { AppContext } from '../../utils/context';
import { LinkManager } from '../../utils';
import './teaser.css';

const Teaser = ({ content, config }) => {
  const context = useContext(AppContext);
  let inFrame = false;
  if(window.location !== window.parent.location) {
    inFrame = true;
  }
  

  return (
    <React.Fragment>
      <section className={'teaser ' + content.style + (inFrame ? ' iframe' : '')} itemID={`urn:aemconnection:${content._path}/jcr:content/data/master`} itemfilter='cf' itemType='reference' itemScope>
        <div className='container'>
          {content.asset && Object.prototype.hasOwnProperty.call(content.asset, 'format') &&
            (<Video content={content.asset} />)}

          {content.asset && Object.prototype.hasOwnProperty.call(content.asset, 'mimeType') &&
            (<Image asset={content.asset} config={config} />)}

          <div className='content-block'>
            {content.title && content.style === 'hero' && (
              <h1 itemProp='title' itemType='text' data-editor-itemlabel='Title'>{content.title}</h1>
            )}

            {content.title && content.style === 'featured' && (
              <h2 itemProp='title' itemType='text'>{content.title}</h2>
            )}

            <span className='seperator'></span>

            {content.preTitle && content.style === 'hero' && (
              <h2 itemProp='preTitle' itemType='text'>{content.preTitle}</h2>
            )}

            {content.preTitle && content.style === 'featured' && (
              <h5 itemProp='preTitle' itemType='text'>{content.preTitle}</h5>
            )}


            {content.description && content.style === 'featured' && (
              <p itemProp='description' itemType='text'>{content.description.plaintext}</p>
            )}

            {content.callToAction && content.callToActionLink && content.style === 'featured' && (
              <Link to={LinkManager(content.callToActionLink._path, config, context)} className='button'>{content.callToAction}</Link>
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
  config: PropTypes.object,
  context: PropTypes.object
};

export default Teaser;
