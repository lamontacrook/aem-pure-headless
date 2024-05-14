import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import { srcSet, sizes } from '../../utils/responsive-image';

const Video = ({ content, videoProps = {
  'data-aue-prop': 'asset',
  'data-aue-type': 'media',
  'data-aue-label': 'Asset'
}}) => {
  const context = useContext(AppContext);
  const [display, setDisplay] = useState('image');

  const posterSrc = context.serviceURL.replace(/\/$/, '') + content._path;
  const videoSrc = context.serviceURL.replace(/\/$/, '') + content._path; 

  useEffect(() => {
    if (!document.querySelector(`head link[rel="preload"][href="${videoSrc}"]`)) {
      document.querySelector('head').insertAdjacentHTML('beforeend', `<link rel="prefetch" href="${videoSrc}" as="video"/>`);
    }
  }, [videoSrc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplay('video');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (display === 'image') {
    return renderImagePlaceholder(posterSrc, context);
  } else {
    return (
      <>
        {renderImagePlaceholder(posterSrc, context)}
        {renderVideo(videoSrc, posterSrc, videoProps)}
      </>
    );
  }
};

function renderVideo(videoSrc, posterSrc, videoProps) {
  return (<video
    className='video'
    autoPlay
    playsInline
    muted
    loop
    src={videoSrc}
    poster={posterSrc} 
    {...videoProps} />);
}

function renderImagePlaceholder(posterSrc, context) {
  const imageSizes = context.defaultServiceURL === context.serviceURL ? [
    {
      imageWidth: '1080px',
      renditionName: 'cq5dam.zoom.2048.2048.jpeg',
    },
    {
      imageWidth: '412px',
      renditionName: 'cq5dam.zoom.1280.1280.jpeg',
    },
    {
      size: '100vw'
    }
  ] : [];

  const src = posterSrc + '/_jcr_content/renditions/cq5dam.zoom.2048.2048.jpeg';

  return (
    <img
      className='video-placeholder'
      alt={'Its the WKND!'} src={src} width={412} srcSet={srcSet(posterSrc, imageSizes)}
      sizes={sizes(imageSizes)} itemProp="asset" itemType="media" data-editor-itemlabel='Asset'
    />
  );
}

Video.propTypes = {
  content: PropTypes.object,
  context: PropTypes.object,
  videoProps: PropTypes.object
};

export default Video;
