import AEMHeadless from '@adobe/aem-headless-client-js';

export const pqs = {
  'v1': {
    screen: 'gql-demo-screen-v2',
    config: 'gql-demo-configuration',
    nav: 'gql-demo-navigation',
    adventure: 'gql-demo-adventure-v2'
  },
  'v2': {
    screen: 'gql-demo-screen-v3',
    config: 'gql-demo-configuration-v2',
    nav: 'gql-demo-navigation-v2',
    adventure: 'gql-demo-adventure-v2'
  }
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

  if (!context.serviceURL.includes('publish-')) obj.fetch = _fetch;
  return new AEMHeadless(obj);
};
