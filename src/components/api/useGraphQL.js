import { useState, useEffect } from 'react';

const { AEMHeadless } = require('@adobe/aem-headless-client-js');

/**
 * Custom React Hook to perform a GraphQL query
 * @param query - GraphQL query
 * @param path - Persistent query path
 */

export function useGraphQL(query) {
  let [data, setData] = useState(null);
  let [errors, setErrors] = useState(null);

  useEffect(() => {
    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    console.log(query);

    const request = query ? sdk.runQuery.bind(sdk) : sdk.runPersistedQuery.bind(sdk);
    request(query)
      .then(({ data, errors }) => { 
  
        if (errors) setErrors(mapErrors(errors));
        if (data) setData(data);
      })
      .catch((error) => {
        setErrors(error);
      });
  }, [query]);

  return { data, errors };
}

/**
 * concatenate error messages into a single string.
 * @param {*} errors
 */
export function mapErrors(errors) {
  return errors.map((error) => error.message ? error.message : error).join(',');
}