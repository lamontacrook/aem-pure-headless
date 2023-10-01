import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Delayed = ({ children, waitBeforeShow = 500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? children : null;
};


Delayed.propTypes = {
  children: PropTypes.node,
  waitBeforeShow: PropTypes.number
};

export default Delayed;