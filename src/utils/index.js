import PropTypes from 'prop-types';
import AEMHeadless from '@adobe/aem-headless-client-js';


export const rootPath = '/content/dam';
export const accessToken = 'https://20409-gqldemo202212-stage.adobeioruntime.net/api/v1/web/gql-demo-jwt/service-credentials';
export const defaultEndpoint = '/content/_cq_graphql/aem-demo-assets/endpoint.json';
export const defaultProject = 'gql-demo-template';
export const defaultServiceURL = 'https://author-p91555-e868145.adobeaemcloud.com/';
export const proxyURL = 'https://102588-505tanocelot-stage.adobeioruntime.net/api/v1/web/aem/proxy';

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
    path = path.replace(`${rootPath}/${context.project}`, '');
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
    const pub = context.serviceURL.replace('author', 'publish');

    [...body.images][i].src = [...body.images][i].src.replace(document.location.origin, pub);
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/adobe/dynamicmedia/', `${pub}/adobe/dynamicmedia/`);
    [...body.images][i].srcset = [...body.images][i].srcset.replaceAll('/content/experience-fragments/', `${pub}/content/experience-fragments/`);

  }
  return body;
};


export const externalizeImages = (image, context) => {
  if (image.includes('/content'))
    image = image.replaceAll('/content/', `${context.serviceURL.replace('author', 'publish')}/content/`);
  else if (image.includes('/adobe/dynamicmedia'))
    image = image.replaceAll('/adobe/dynamicmedia/', `${context.serviceURL.replace('author', 'publish')}/adobe/dynamicmedia/`);
  return image;
};

export const prepareRequest = (context) => {
  if (!context) return;

  const usePub = JSON.parse(context.publish);
  const url = usePub ?
    context.serviceURL.replace('author', 'publish') :
    context.serviceURL;



  if (context.useProxy) {
    return new AEMHeadless({
      serviceURL: proxyURL,
      endpoint: context.endpoint,
      auth: context.auth,
      headers: { 'aem-url': url }
    });
  } else {
    return new AEMHeadless({
      serviceURL: url,
      endpoint: context.endpoint,
      auth: context.auth,
    });
  }
};
