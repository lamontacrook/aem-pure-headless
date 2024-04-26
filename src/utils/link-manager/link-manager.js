import React, { useContext} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppContext } from '../context';

const LinkManager = ({children, item, className}) => {
  const context = useContext(AppContext);
  
  // if (!path) return '';
  
  // const pos = path.split('/');
  // const pos3 = pos.pop();
  // const pos2 = pos.pop();
  // const pos1 = pos.pop();

  // if (path.indexOf('/experience-fragments/') >= 0) {
  //   path = `/site/en/${pos1}/${pos2}/${pos3}`;
  // } else if (config && path.indexOf(config.adventuresHome) === 0) {

  //   let v = config.adventuresHome.indexOf('/') == 0 ?
  //     config.adventuresHome.substring(1, config.adventuresHome.length) :
  //     config.adventuresHome;
  //   v = v.replace('content/dam', '');
  //   let arry = v.split('/');
  //   arry.shift();
  //   arry.shift();
  //   path = `${context.project}/${arry.join('/')}/${pos2}/${pos3}`;
  // } else {
  //   path = path.replace(`/${rootPath}/${context.project}`, '');
  // }
  
  let path = item._path.replace(`/${context.rootPath}`, '');
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
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.string
};

export default LinkManager;