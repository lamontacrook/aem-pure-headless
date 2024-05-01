import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppContext } from '../context';

const LinkManager = ({ children, item, className }) => {
  const context = useContext(AppContext);

  let path = item._path ? item._path.replace(`/${context.rootPath}`, '') : '';
  let previous = '';
  const paths = path.split('/').map((item) => {
    if (item === 'article') return previous;
    previous = item;
    return item;
  });

  path = paths.join('/');

  // <Link to={LinkManager(content.callToActionLink._path, config, context)}
  //   data-aue-type='reference' data-aue-prop='callToActionLink' data-aue-label='Call to Action' className='button'>{content.callToAction}</Link>

  return (
    <Link key={path} data-aue-type='reference' data-aue-filter='cf' data-aue-prop='callToActionLink' data-aue-label='Call to Action' className={className} name={item.title || item.name} to={path}>
      {children}
    </Link>
  );
};

LinkManager.propTypes = {
  item: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.any]),
  className: PropTypes.string
};

export default LinkManager;