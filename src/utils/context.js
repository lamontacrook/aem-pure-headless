import { createContext } from 'react';
import BrokenImage from '../media/broken.jpg';

const defaultEndpoint = '/content/_cq_graphql/aem-demo-assets/endpoint.json';
const defaultProject = 'wknd-headless';
const defaultServiceURL = 'https://author-p124331-e1227315.adobeaemcloud.com/';
const defaultPlaceholdersExtensionURL = 'https://1154643-geoipplaceholders.adobeio-static.net/api/v1/web/geoip-placeholders';

export const AppContext = createContext({
  auth: sessionStorage.auth || '',
  endpoint: localStorage.endpoint || defaultEndpoint,
  project: localStorage.project || defaultProject,
  serviceURL: localStorage.serviceURL || defaultServiceURL,
  defaultServiceURL: defaultServiceURL,
  placeholdersExtensionURL: localStorage.placeholdersExtensionURL || defaultPlaceholdersExtensionURL,
  brokenImage: BrokenImage,
  screenResponse: {},
  navigationResponse: {},
  pqs: {
    screen: 'gql-screen-v3',
    config: 'gql-configuration-v2',
    nav: 'gql-navigation-v2',
    adventure: 'gql-adventure-v2'
  },
  lang: localStorage.lange ? JSON.parse(localStorage.lang) : {value:'en',label:'English'},
  audience: localStorage.audience ? JSON.parse(localStorage.audience) : {},
  rootPath: localStorage.rootPath || 'content/dam',
  config: {}
});
