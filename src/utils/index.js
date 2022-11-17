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

  const pos = path.split('/');
  const pos3 = pos.pop();
  const pos2 = pos.pop();
  const pos1 = pos.pop();
  path = `${path.indexOf('/experience-fragments/') >= 0?'/site/':''}${pos1}/${pos2}/${pos3}`;

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
  return image;
};