import React from 'react';
import PropTypes from 'prop-types';

const Video = ({ content }) => {
  const poster = content._publishUrl + '/jcr%3Acontent/renditions/cq5dam.zoom.2048.2048.jpeg';
  
  return (<video
    autoPlay
    playsInline
    muted
    loop
    src={content._publishUrl}
    poster={poster} />);
};

Video.propTypes = {
  content: PropTypes.object
};

export default Video;
