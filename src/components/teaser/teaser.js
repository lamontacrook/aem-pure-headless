
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { Link } from 'react-router-dom';
import { AppContext } from '../../utils/context';
import {TextWithPlaceholders} from '../../utils/placeholders';
import { LinkManager } from '../../utils';
import './teaser.css';

//https://experience.adobe.com/?repo=author-p101152-e938206.adobeaemcloud.com#/@lamont/aem/cf/editor/editor/content/dam/wknd-headless/site/en/home/components/featured-article?appId=aem-cf-editor
//https://experience.adobe.com/?repo=author-p101152-e938206.adobeaemcloud.com#/@lamont/aem/cf/editor/editor/content/dam/wknd-headless/site/en/home/components/featured-article?appId=aem-cf-editor
//https://experience.adobe.com/?repo=author-p101152-e938206.adobeaemcloud.com#/@lamont/aem/cf/editor/editor/content/dam/wknd-headless/site/en/home/components/hero/
//https://experience.adobe.com/?repo=author-p24020-e1129912.adobeaemcloud.com#/@lamont/aem/cf/editor/editor/content%2Fdam%2Fgql-demo-template%2Fsite%2Fen%2Fhome%2Fcomponents%2Ffeatured-article
const Teaser = ({ content, config }) => {
  const context = useContext(AppContext);
  let inFrame = false;
  if(window.location !== window.parent.location) {
    inFrame = true;
  }
  

  return (
    <div itemID={`urn:aemconnection:${content._path}/jcr:content/data/master`} itemfilter='cf' itemType='reference' data-editor-itemlabel={`Teaser(${content.style})`} itemScope>
      <section className={'teaser ' + content.style + (inFrame ? ' iframe' : '')}>
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
              <h2 itemProp='title' itemType='text' data-editor-itemlabel='Title'>{content.title}</h2>
            )}

            <span className='seperator'></span>

            {content.preTitle && content.style === 'hero' && (
              <h2 itemProp='preTitle' itemType='text'data-editor-itemlabel='Pre-Title'>{content.preTitle}</h2>
            )}

            {content.preTitle && content.style === 'featured' && (
              <h5 itemProp='preTitle' itemType='text' data-editor-itemlabel='Pre-Title'>{content.preTitle}</h5>
            )}


            {content.description && content.style === 'featured' && (
              <p itemProp='description' itemType='text'><TextWithPlaceholders>{content.description.plaintext}</TextWithPlaceholders></p>
            )}

            {content.callToAction && content.callToActionLink && content.style === 'featured' && (
              <Link to={LinkManager(content.callToActionLink._path, config, context)} 
                itemType='reference' itemProp='callToActionLink' data-editor-itemlabel='Call to Action' className='button'>{content.callToAction}</Link>
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
  config: PropTypes.object,
  context: PropTypes.object
};

export default Teaser;
