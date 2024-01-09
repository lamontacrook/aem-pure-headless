/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from 'react';
import BrokenImage from '../media/broken.jpg';

const accessToken = 'https://20409-gqldemo202212-stage.adobeioruntime.net/api/v1/web/gql-demo-jwt/service-credentials';
const defaultEndpoint = '/content/_cq_graphql/aem-demo-assets/endpoint.json';
const defaultProject = 'pure-headless';
const defaultServiceURL = 'https://publish-p127526-e1240386.adobeaemcloud.com/'; 
const defaultPlaceholdersExtensionURL = 'https://1154643-geoipplaceholders.adobeio-static.net/api/v1/web/geoip-placeholders';

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
  navigationResponse: {}
});
