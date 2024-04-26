import React, { useContext} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppContext } from '../context';

const LinkManager = ({children, item, className}) => {
  const context = useContext(AppContext);
  
  let path = item._path ? item._path.replace(`/${context.rootPath}`, '') : '';
  let previous = '';
  const paths = path.split('/').map((item) => {
    if(item === 'article') return previous;
    previous = item;
    return item;
  });

  path = paths.join('/');
  

  return (
    <Link key={path} className={className} name={item.title || item.name} to={path}>
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