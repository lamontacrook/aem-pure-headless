import PropTypes from 'prop-types';
import AEMHeadless from '@adobe/aem-headless-client-js';


export const rootPath = 'content/dam';

const store = {};
export const MagazineStore = (key, value) => {
  if (key && value)
    store[key] = value;
  else if (key)
    return store[key];

  return store;
};

export const LinkManager = (path, config, context) => {

  if (!path) return '';

  const pos = path.split('/');
  const pos3 = pos.pop();
  const pos2 = pos.pop();
  const pos1 = pos.pop();

  if (path.indexOf('/experience-fragments/') >= 0) {
    path = `/site/en/${pos1}/${pos2}/${pos3}`;
  } else if (config && path.indexOf(config.adventuresHome) === 0) {

    let v = config.adventuresHome.indexOf('/') == 0 ?
      config.adventuresHome.substring(1, config.adventuresHome.length) :
      config.adventuresHome;
    v = v.replace('content/dam', '');
    let arry = v.split('/');
    arry.shift();
    arry.shift();
    path = `${context.project}/${arry.join('/')}/${pos2}/${pos3}`;
  } else {
    path = path.replace(`/${rootPath}/${context.project}`, '');
  }

  return (
    path
  );
};

LinkManager.propTypes = {
  path: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

export const externalizeImagesFromString = (html, context) => {
  let body = new DOMParser().parseFromString(html, 'text/html');

  for (let i = 0; i < [...body.images].length; i++) {
    const pub = context.serviceURL == context.defaultServiceURL ? context.serviceURL.replace('author', 'publish') : context.serviceURL;

    [...body.images][i].src = [...body.images][i].src.replace(document.location.origin, pub);
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/adobe/dynamicmedia/', `${pub}/adobe/dynamicmedia/`);
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/content/experience-fragments/', `${pub}/content/experience-fragments/`);

  }
  return body;
};


export const externalizeImage = (image, context) => {
 
  const serviceURL = context.serviceURL === context.defaultServiceURL ? context.serviceURL.replace('author', 'publish') : context.serviceURL.replace(/\/$/, '');

  [...image.attributes].forEach((elem) => {
    if(elem.value.startsWith('/')) {
      elem.value = elem.value.replaceAll('/content/', `${serviceURL}/content/`);    
    }
    // image.setAttribute('itemProp', 'asset');
    // image.setAttribute('itemType', 'media');
    image.setAttribute('data-editor-itemlabel', 'Image');
  });

  return image;
};

export const prepareRequest = (context) => {
  if (!context) return;

  // const usePub = JSON.parse(context.publish);
  // const url = usePub ?
  //   context.serviceURL.replace('author', 'publish') :
  //   context.serviceURL;

  const _fetch = function (resource, options) {
    if (!options) options = {};

    options.credentials = 'include';
    return window.fetch(resource, options);
  };

  // if (!usePub) {

  return new AEMHeadless({
    serviceURL: context.serviceURL,
    endpoint: context.endpoint,
    auth: context.auth,
    fetch: _fetch
  });
  // } else if (usePub) {
  //   return new AEMHeadless({
  //     serviceURL: url,
  //     endpoint: context.endpoint
  //   });
  // }
};
