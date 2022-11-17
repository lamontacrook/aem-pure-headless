
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
    headerOfPage
    teaserTitle
    teaserPreTitle
    teaserAsset {
      ...on MultimediaRef {
        _authorUrl
        format
        _publishUrl
      }
    }
    teaserDescription {
      html
    }
    teaserCallToAction
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


      <section className={'teaser ' + content.teaserStyle}>

        <div className='container'>
          {Object.prototype.hasOwnProperty.call(content.teaserAsset, 'format') &&
            (<Video content={content.teaserAsset} />)}

          {Object.prototype.hasOwnProperty.call(content.teaserAsset, 'mimeType') &&
            (<Image src={content.teaserAsset._publishUrl} />)}

          <div className='content-block'>
            {content.teaserTitle && content.teaserStyle === 'hero' && (
              <h1>{content.teaserTitle}</h1>
            )}

            {content.teaserTitle && content.teaserStyle === 'featured' && (
              <h2>{content.teaserTitle}</h2>
            )}

            <span className='seperator'></span>

            {content.teaserPreTitle && content.teaserStyle === 'hero' && (
              <h2>{content.teaserPreTitle}</h2>
            )}

            {content.teaserPreTitle && content.teaserStyle === 'featured' && (
              <h5>{content.teaserPreTitle}</h5>
            )}


            {content.teaserDescription && (
              <p>{content.teaserDescription.plaintext}</p>
            )}
          </div>
        </div>

        <div className='arrow'></div>

      </section>





      {/* {!content.headerOfPage && (
        <section className={'teaser ' + content.teaserStyle}>
          <div className='content-block'>
            <h2>{content.teaserTitle}</h2>
            <h5>{content.teaserPreTitle}</h5>
            <p>{content.teaserDescription.plaintext}</p>
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
