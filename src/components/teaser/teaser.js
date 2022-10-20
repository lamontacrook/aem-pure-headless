
import React from 'react';
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
  return (
    <React.Fragment>
      {

        content.headerOfPage && (
          <header className="home-hero" role="banner">
            <section className='teaser hero'>
              <div className="container">
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
            </section>
          </header>
        )
      }
    </React.Fragment>
  );
};

Teaser.propTypes = {
  content: PropTypes.object
};

export default Teaser;
