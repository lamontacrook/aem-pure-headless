import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import { srcSet, sizes } from '../../utils/responsive-image';

const Video = ({ content }) => {
  const context = useContext(AppContext);
  const [display, setDisplay] = useState('image');
  

  const defaultConfig = context.defaultServiceURL === context.serviceURL || context.serviceURL.includes('publish-');
  
  const posterSrc =  (defaultConfig ? content._publishUrl : content._authorUrl);
  const videoSrc = defaultConfig ? content._publishUrl : content._authorUrl;


  useEffect(() => {
    if (!document.querySelector(`head link[rel="preload"][href="${videoSrc}"]`)) {
      document.querySelector('head').insertAdjacentHTML('beforeend', `<link rel="preload" href="${videoSrc}" as="video"/>`);
    }
  },[videoSrc]);

  useEffect(() => {
    const timer = setTimeout(() => {    
      setDisplay('video');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (display === 'image') {
    return renderImagePlaceholder(posterSrc);
  } else {
    return (
      <>
        {renderImagePlaceholder(posterSrc)}
        {renderVideo(videoSrc, posterSrc)}
      </>
    );
  }
};

function renderVideo(videoSrc, posterSrc) {
  return (<video
    className='video'
    autoPlay
    playsInline
    muted
    loop
    src={videoSrc}
    poster={posterSrc} itemProp="asset" itemType="media" />);
}

function renderImagePlaceholder(posterSrc) {
  const imageSizes = [
    {
      imageWidth: '2000px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    {
      imageWidth: '1600px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    {
      imageWidth: '1200px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    {
      imageWidth: '800px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    {
      imageWidth: '412px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    { 
      size: '100vw'
    }
  ];

  const src = posterSrc + '/_jcr_content/renditions/cq5dam.zoom.2048.2048.jpeg';
  
  return (  
    <img 
      className='video-placeholder'
      alt={'Its the WKND!'} src={src} width={412} srcSet={srcSet(posterSrc, imageSizes)} sizes={sizes(imageSizes)} itemProp="asset" itemType="media" data-editor-itemlabel='Asset'/>
  );
}

Video.propTypes = {
  content: PropTypes.object,
  context: PropTypes.object
};

export default Video;
