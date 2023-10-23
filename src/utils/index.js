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

export const prepareRequest = (context) => {
  if (!context) return;

  const _fetch = function (resource, options) {
    if (!options) options = {};

    options.credentials = 'include';
    return window.fetch(resource, options);
  };

  let obj = {
    serviceURL: context.serviceURL,
    endpoint: context.endpoint,
  };

  if(!context.serviceURL.includes('publish-')) obj.fetch = _fetch;
  return new AEMHeadless(obj);
};
