/*
Copyright 2020 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../utils/context';

const { AEMHeadless } = require('@adobe/aem-headless-client-js');

export const pageRef = (url, context, walk) => {

  const h = context.serviceURL !== context.defaultServiceURL && !context.serviceURL.includes('publish-') ? {
    'Authorization': `Bearer  ${context.auth}`,
    'Content-Type': 'text/html'
  } : {
    'Content-Type': 'text/html'
  };

  const headers = new Headers(h);

  let obj = {
    method: 'get',
    headers: headers,
  };
  if (!url.includes('publish-')) obj.credentials = 'include';

  const req = new Request(url, obj);

  if (!walk) return fetch(req);

  return fetch(req).then((response) => {
    if (response) {
      return response.json().then((json) => {
        walk.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(json, item)) {
            json = json[item];
          }
        });
        return json;
      });
    }
  })
    .catch((error) => {
      throw (error);
    });
};

/**
 * Custom React Hook to perform a GraphQL query
 * @param path - Persistent query path
 */
export function useGraphQL(path, params = {}) {
  const context = useContext(AppContext);
  let [data, setData] = useState(null);
  let [errorMessage, setErrors] = useState(null);
  context.serviceURL.includes('author') && (params['timestamp'] = new Date().getTime());

  useEffect(() => {
    function makeRequest() {
      const sdk = new AEMHeadless({
        serviceURL: context.serviceURL,
        endpoint: context.endpoint,
      });
      const request = sdk.runPersistedQuery.bind(sdk);

      request(path, params, { credentials: 'include' })
        .then(({ data, errors }) => {
          //If there are errors in the response set the error message
          if (errors) {
            setErrors(mapErrors(errors));
          }
          //If data in the response set the data as the results
          if (data) {
            setData(data);
          }
        })
        .catch((error) => {
          setErrors(error);
          sessionStorage.removeItem('accessToken');
        });
    }

    makeRequest();
  }, [path]);


  return { data, errorMessage };
}

/**
 * concatenate error messages into a single string.
 * @param {*} errors
 */
function mapErrors(errors) {
  return errors.map((error) => error.message).join(',');
}

export default useGraphQL;