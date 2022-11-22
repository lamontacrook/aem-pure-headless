
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import Image from '../image';
import { Parallax } from 'react-scroll-parallax';

import './teaser.css';

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


const Teaser = ({ content }) => {

  

  const fadeInHandler = () => {
    const featured = document.querySelector('.featured');
    if (!featured) return;

    // const distanceToTop = window.pageYOffset + featured.getBoundingClientRect().top;
    const elementHeight = featured.offsetHeight;
    const scrollTop = document.documentElement.scrollTop;

    // console.log(`distanceToTop ${distanceToTop}`);
    // console.log(`elementHeight ${elementHeight}`);
    // console.log(`scrollTop ${scrollTop}`);

    let opacity = 1;

    if (scrollTop < elementHeight) {
      opacity = scrollTop / elementHeight;
      // console.log(opacity);
    }

    if (opacity >= 0) {
      featured.style.opacity = opacity;
    }

  };



  useEffect(() => {
    
    // window.addEventListener('scroll', fadeInHandler);
  }, []);

  return (
    <React.Fragment>


      <section className={'teaser ' + content.style}>

        <div className='container'>
          {Object.prototype.hasOwnProperty.call(content.asset, 'format') &&
            (<Video content={content.asset} />)}

          {Object.prototype.hasOwnProperty.call(content.asset, 'mimeType') &&
            (<Image src={content.asset._publishUrl} />)}

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


            {content.description && (
              <p>{content.description.plaintext}</p>
            )}
          </div>
        </div>

        <div className='arrow'></div>

      </section>





      {/* {!content.headerOfPage && (
        <section className={'teaser ' + content.style}>
          <div className='content-block'>
            <h2>{content.teaserTitle}</h2>
            <h5>{content.preTitle}</h5>
            <p>{content.description.plaintext}</p>
          </div>
          <div className="teaser-image">
            {Object.prototype.hasOwnProperty.call(content.teaserAsset, 'mimeType') &&
              (<Image src={content.teaserAsset._publishUrl} />)}
          </div>
        </section>
      )} */}
    </React.Fragment>
  );
};

Teaser.propTypes = {
  content: PropTypes.object
};

export default Teaser;
