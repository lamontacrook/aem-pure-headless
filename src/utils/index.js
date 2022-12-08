import PropTypes from 'prop-types';

export const rootPath = `/content/dam/${localStorage.getItem('project')}`;
const store = {};
export const MagazineStore = (key, value) => {
  if (key && value)
    store[key] = value;
  else if (key)
    return store[key];

  return store;
};

// ${dm.api-server}is/image/${dm.file}:Medium
// https://s7sps1apissl.scene7.com/is/image/DynamicMediaNA/AdobeStock_238607111:54vert
export const LinkManager = (path, config) => {
  if (!path) return '';

  const pos = path.split('/');
  const pos3 = pos.pop();
  const pos2 = pos.pop();
  const pos1 = pos.pop();

  if(path.indexOf('/experience-fragments/') >= 0) {
    path = `/site/en/${pos1}/${pos2}/${pos3}`;
  } else if(config && path.indexOf(config.adventuresHome) === 0) {
  
    let v = config.adventuresHome.indexOf('/') == 0 ? 
      config.adventuresHome.substring(1, config.adventuresHome.length): 
      config.adventuresHome;
    v = v.replace('content/dam', '');
    let arry = v.split('/');
    arry.shift();
    arry.shift();
    path = `${localStorage.getItem('project')}/${arry.join('/')}/${pos2}/${pos3}`;
  
  } else {
    path = path.replace(rootPath, '');
  }
  
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
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/content/experience-fragments/', `${pub}/content/experience-fragments/`);

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