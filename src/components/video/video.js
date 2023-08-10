import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';

const Video = ({ content }) => {
  const context = useContext(AppContext);
  const defaultConfig = context.serviceURL === context.defaultServiceURL;
  let poster =  defaultConfig ? content._publishUrl : content._authorUrl;
  poster += '/jcr%3Acontent/renditions/cq5dam.zoom.2048.2048.jpeg';
  
  return (<video
    autoPlay
    playsInline
    muted
    loop
    src={defaultConfig ? content._publishUrl : content._authorUrl}
    poster={poster} itemProp="asset" itemType="media" />);
};

Video.propTypes = {
  content: PropTypes.object,
  context: PropTypes.object
};

export default Video;
