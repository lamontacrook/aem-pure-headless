
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

  //const [offset, setOffset] = useState(0);

  useEffect(() => {
    const video = document.querySelector('video').offsetHeight;
    const featured = document.querySelector('.featured').offsetHeight;
    let i = .1;
    console.log(window.pageYOffset);
    window.onscroll = function () {
      document.querySelector('video').style.opacity = 1 - ((window.pageYOffset + 180) / video);
      if (window.pageYOffset > (video - featured)) {
        console.log(document.querySelector('.featured').style.opacity);
        document.querySelector('.featured').style.opacity = i;
        i = i + .01;
      } 
      // if(window.pageYOffset > .8 ) {
      //   console.log('here');
      //   document.querySelector('.featured').style.opacity = 1;
      // }
    };
  }, []);



  return (
    <React.Fragment>
      {content.headerOfPage && (
        <header className='home-hero' role='banner'>
          <section className='teaser hero'>
            <div className='container'>
              {content.teaserAsset.format.includes('video') &&
                (<Video content={content.teaserAsset} />)}

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
