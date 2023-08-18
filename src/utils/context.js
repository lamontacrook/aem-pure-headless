import { createContext } from 'react';

const accessToken = 'https://20409-gqldemo202212-stage.adobeioruntime.net/api/v1/web/gql-demo-jwt/service-credentials';
const defaultEndpoint = '/content/_cq_graphql/aem-demo-assets/endpoint.json';
const defaultProject = 'gql-demo-template';
const defaultServiceURL = 'https://author-p91555-e868145.adobeaemcloud.com/';
const defaultPlaceholdersExtensionURL = 'https://1154643-geoipplaceholders.adobeio-static.net/api/v1/web/geoip-placeholders';

export const AppContext = createContext({
  auth: sessionStorage.auth || '',
  endpoint: localStorage.endpoint || defaultEndpoint,
  project: localStorage.project || defaultProject,
  serviceURL: localStorage.serviceURL || defaultServiceURL,
  accessToken: accessToken,
  defaultServiceURL: defaultServiceURL,
  placeholdersExtensionURL: localStorage.placeholdersExtensionURL || defaultPlaceholdersExtensionURL,
});


