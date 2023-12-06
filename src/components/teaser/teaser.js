
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { Link } from 'react-router-dom';
import { AppContext } from '../../utils/context';
import {TextWithPlaceholders} from '../../utils/placeholders';
import { LinkManager } from '../../utils';
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

const Teaser = ({ content, config }) => {
  const context = useContext(AppContext);
  let inFrame = false;
  if(window.location !== window.parent.location) {
    inFrame = true;
  }
  
  const renderAsset = ({asset}) => {    
    if(asset && Object.prototype.hasOwnProperty.call(content.asset, 'format'))
      return (<Video content={content.asset} />);
    else if(asset && Object.prototype.hasOwnProperty.call(content.asset, 'mimeType'))
      return (<Image asset={content.asset} alt={content.title} config={config} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes}/>);
    else
      return (<Image asset={content.asset} alt={content.title} config={config} imageSizes={content.style === 'hero' ? imageSizesHero : imageSizes}/>);
  };

  const editorProps = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/data/master`,
    itemType: 'reference',
    itemfilter: 'cf',
    'data-editor-itemlabel': `Teaser(${content.style})`
  };

  return (
    <div {...editorProps} itemScope>
      <section className={'teaser ' + content.style + (inFrame ? ' iframe' : '')}>
        <div className='container'>
          { renderAsset(content) }

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
