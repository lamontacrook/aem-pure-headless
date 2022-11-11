import PropTypes from 'prop-types';

export const LinkManager = (path) => {
  const paths = path.split('/');
  const article = paths.pop();
  const section = paths.pop();
  // const lang = paths.pop();
  
  return (
    `${section}/${article}`
  );
};

LinkManager.propTypes = {
  path: PropTypes.object
};
