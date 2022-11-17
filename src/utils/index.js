import PropTypes from 'prop-types';

export const rootPath = `${localStorage.getItem('project')}`;
const store = {};
export const MagazineStore = (key, value) => {
  if (key && value)
    store[key] = value;
  else if (key)
    return store[key];

  return store;
};

export const LinkManager = (path) => {
  if (!path) return '';

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
  return (
    path
  );
};

LinkManager.propTypes = {
  path: PropTypes.object
};

export const externalizeImages = (image) => {

  if (image.includes('/content'))
    image = image.replaceAll('/content/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/content/`);
  else if (image.includes('/adobe/dynamicmedia'))
    image = image.replaceAll('/adobe/dynamicmedia/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/adobe/dynamicmedia/`);

  console.log(image);
  return image;
};