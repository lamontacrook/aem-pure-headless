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
  path = `${path.indexOf('/experience-fragments/') >= 0 ? '/site/' : ''}${pos1}/${pos2}/${pos3}`;

  return (
    path
  );
};

LinkManager.propTypes = {
  path: PropTypes.object
};

export const externalizeImagesFromHtml = (html) => {
  let body = new DOMParser().parseFromString(html, 'text/html');

  for (let i = 0; i < [...body.images].length; i++) {
    const pub = localStorage.getItem('serviceURL').replace('author', 'publish');

    [...body.images][i].src = [...body.images][i].src.replace(document.location.origin, pub);
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/adobe/dynamicmedia/', `${pub}/adobe/dynamicmedia/`);

  }
  return new XMLSerializer().serializeToString(body, 'text/html');
};

export const externalizeImages = (image) => {

  if (image.includes('/content'))
    image = image.replaceAll('/content/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/content/`);
  else if (image.includes('/adobe/dynamicmedia'))
    image = image.replaceAll('/adobe/dynamicmedia/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/adobe/dynamicmedia/`);
  return image;
};