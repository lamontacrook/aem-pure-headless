
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';

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

  const scrollHandler = () => {
    const hero = document.querySelector('.hero');
    const distanceToTop = window.pageYOffset + hero.getBoundingClientRect().top;
    const elementHeight = hero.offsetHeight - 500;
    const scrollTop = document.documentElement.scrollTop;

    let opacity = .8;

    if(scrollTop > distanceToTop)
      opacity = 1 - (scrollTop - distanceToTop) / elementHeight;

    if(opacity >= 0) {
      hero.style.opacity = opacity;
      // console.log(opacity);
    }
  };

  const fadeInHandler = () => {
    const featured = document.querySelector('.featured');
    const distanceToTop = window.pageYOffset + featured.getBoundingClientRect().top;
    const elementHeight = featured.offsetHeight;
    const scrollTop = document.documentElement.scrollTop;

    let opacity = .1;

    if(scrollTop > distanceToTop)
      opacity = .5 + (scrollTop + distanceToTop) / elementHeight;

    if(opacity >= 0) {
      featured.style.opacity = opacity;
      console.log(opacity);
    }
  };

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('scroll', fadeInHandler);

  useEffect(() => {
    
  }, []);



  return (
    <React.Fragment>
      {content.headerOfPage && (
        <header className='home-hero' role='banner'>
          <section className='teaser hero'>
            <div className='container'>
              {Object.prototype.hasOwnProperty.call(content.teaserAsset, 'format') &&
                (<Video content={content.teaserAsset} />)}

              {Object.prototype.hasOwnProperty.call(content.teaserAsset, 'mimeType') && 
                (<picture><img src={content.teaserAsset._publishUrl} /></picture>)}

              <div className='content-block'>
                {content.teaserTitle && (
                  <h1>{content.teaserTitle}</h1>
                )}

                <span className='seperator'></span>

                {content.teaserPreTitle && (
                  <h2>{content.teaserPreTitle}</h2>
                )}


                {content.teaserDescription && (
                  <p>{content.teaserDescription.html}</p>
                )}
              </div>
            </div>

            <div className='arrow'></div>

          </section>
        </header>
      )
      }

      {!content.headerOfPage && (
        <section className='featured'>
          <div className='content-block'>
            <h2>{content.teaserTitle}</h2>
            <h5>{content.teaserPreTitle}</h5>
          </div>
          <div className="teaser-image">
            <img src={content.teaserAsset._publishUrl} />
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

Teaser.propTypes = {
  content: PropTypes.object
};

export default Teaser;
