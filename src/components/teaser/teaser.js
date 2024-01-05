
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { Link } from 'react-router-dom';
import { AppContext } from '../../utils/context';
import { TextWithPlaceholders } from '../../utils/placeholders';
import { LinkManager } from '../../utils';
import './teaser.css';

const imageSizes = [
  // {
  //   imageWidth: '660px',
  //   renditionName: 'web-optimized-large.webp',
  //   size: '(min-width: 1000px) 660px'
  // },
  // {
  //   imageWidth: '1000px',
  //   renditionName: 'web-optimized-large.webp',
  // },
  // {
  //   imageWidth: '800px',
  //   renditionName: 'web-optimized-large.webp',
  // },
  // {
  //   imageWidth: '600px',
  //   renditionName: 'web-optimized-large.webp',
  // },
  // {
  //   imageWidth: '412px',
  //   renditionName: 'web-optimized-medium.webp',
  // },
  {
    imageWidth: '280px',
    renditionName: '54vert',
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
  if (window.location !== window.parent.location) {
    inFrame = true;
  }

  const renderAsset = ({ asset, style, title }, useDM=false) => {
    if (asset && Object.prototype.hasOwnProperty.call(asset, 'format'))
      return (<Video content={asset} />);
    else if (asset && Object.prototype.hasOwnProperty.call(asset, 'mimeType'))
      return (<Image asset={asset} useDM={useDM} alt={content.title} config={config} imageSizes={style === 'hero' ? imageSizesHero : imageSizes} />);
    else
      return (<Image asset={asset} useDM={useDM} alt={title} config={config} imageSizes={style === 'hero' ? imageSizesHero : imageSizes} />);
  };

  const editorProps = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/data/master`,
    itemType: 'reference',
    itemfilter: 'cf',
    'data-editor-itemlabel': content.style.includes('adventure') ? 'Adventure Teaser' : `Teaser(${content.style})`
  };

  return (
    <div>
      <section className={'teaser ' + content.style + (inFrame ? ' iframe' : '')}>

        {content.title && content.style.includes('hero') && content.style.includes('adventure') && (
          <div className='container'>
            {renderAsset(content)}
            <HeroRender content={content} />
          </div>
        )}

        {content.title && content.style.includes('hero') && !content.style.includes('adventure') && (
          <div className='container' {...editorProps} itemScope>
            {renderAsset(content)}
            <HeroRender content={content} />
          </div>
        )}

        {content.title && content.style === 'featured' && (
          <div className='container' {...editorProps} itemScope>
            {renderAsset(content, true)}
            <FeaturedRender content={content} config={config} context={context} />
          </div>
        )}

        <div className='arrow'></div>
      </section >
    </div >
  );
};

const FeaturedRender = ({ content, config, context }) => {
  return (
    <div className='content-block'>
      <h2 itemProp='title' itemType='text' data-editor-itemlabel='Title'>{content.title}</h2>
      <h5 itemProp='preTitle' itemType='text' data-editor-itemlabel='Pre-Title'>{content.preTitle}</h5>
      <p itemProp='description' itemType='text'><TextWithPlaceholders>{content.description.plaintext}</TextWithPlaceholders></p>
      {content.callToAction && content.callToActionLink && (
        <Link to={LinkManager(content.callToActionLink._path, config, context)}
          itemType='reference' itemProp='callToActionLink' data-editor-itemlabel='Call to Action' className='button'>{content.callToAction}</Link>
      )}
    </div>
  );
};

FeaturedRender.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

const HeroRender = ({ content }) => {
  return (
    <div className='content-block'>
      <h1 itemProp='title' itemType='text' data-editor-itemlabel='Title'>{content.title}</h1>
      <span className='seperator'></span>
      <h2 itemProp='preTitle' itemType='text' data-editor-itemlabel='Pre-Title'>{content.preTitle}</h2>
    </div>
  );
};

HeroRender.propTypes = {
  content: PropTypes.object
};

Teaser.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

export default Teaser;
