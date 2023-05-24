import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { defaultServiceURL } from '../../utils';
import { AppContext } from '../../utils/context';

const Video = ({ content }) => {
  const context = useContext(AppContext);
  let poster = context.serviceURL === defaultServiceURL ? content._publishUrl : content._authorUrl;
  poster += '/jcr%3Acontent/renditions/cq5dam.zoom.2048.2048.jpeg';
  
  return (<video
    autoPlay
    playsInline
    muted
    loop
    src={content._authorUrl}
    poster={poster} />);
};

Video.propTypes = {
  content: PropTypes.object,
  context: PropTypes.object
};

export default Video;
