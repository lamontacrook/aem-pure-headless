import PropTypes from 'prop-types';

export const rootPath = `${localStorage.getItem('project')}`;
const store = {};
export const MagazineStore = (key, value) => {
  if(key && value)
    store[key] = value;
  else if(key)
    return store[key];
    
  return store;
};

export const LinkManager = (path) => {

  let site = path.indexOf('/site/');

  if (site > 0)
    path = path.substring(path.indexOf(rootPath) + rootPath.length, path.length);
  else { //if(path.includes('/experience-fragments/')) {
    path = path.split('/');
    const pos3 = path.pop();
    const pos2 = path.pop();
    const pos1 = path.pop();
    path = `/${pos1}/${pos2}/${pos3}`;

  }
  // console.log(path);

  // const paths = path.split('/');
  // const folder = paths.pop();
  // const screen = paths.pop();

  // const route = folder === screen ? screen : `${folder}/${screen}`;

  return (
    path
  );
};

LinkManager.propTypes = {
  path: PropTypes.object
};

export const externalizeImages = (image) => {
  image = image.replaceAll('/content/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/content/`);
  return image;
};