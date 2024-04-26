import { createContext } from 'react';
import BrokenImage from '../media/broken.jpg';

const accessToken = 'https://20409-gqldemo202212-stage.adobeioruntime.net/api/v1/web/gql-demo-jwt/service-credentials';
const defaultEndpoint = '/content/_cq_graphql/aem-demo-assets/endpoint.json';
const defaultProject = 'gql-demo-template'; //'wknd-headless';
const defaultServiceURL = 'https://publish-p24020-e1129912.adobeaemcloud.com/'; //'https://publish-p101152-e938206.adobeaemcloud.com/';
const defaultPlaceholdersExtensionURL = 'https://1154643-geoipplaceholders.adobeio-static.net/api/v1/web/geoip-placeholders';
const {host} = location;
const defaultVersion = (host === 'aem-pure-headless.vercel.app' || host === 'localhost:3000') ? 'v1' : 'v2';

export const AppContext = createContext({
  auth: sessionStorage.auth || '',
  endpoint: localStorage.endpoint || defaultEndpoint,
  project: localStorage.project || defaultProject,
  serviceURL: localStorage.serviceURL || defaultServiceURL,
  accessToken: accessToken,
  defaultServiceURL: defaultServiceURL,
  placeholdersExtensionURL: localStorage.placeholdersExtensionURL || defaultPlaceholdersExtensionURL,
  brokenImage: BrokenImage,
  screenResponse: {},
  navigationResponse: {},
  version: localStorage.version || defaultVersion,
  lang: localStorage.lange ? JSON.parse(localStorage.lang) : {value:'en',label:'English'},
  audience: localStorage.audience ? JSON.parse(localStorage.audience) : {},
  rootPath: localStorage.rootPath || 'content/dam'
});
