import { proxyURL } from '../utils';

export const pageRef = (url, context) => {
  const usePub = JSON.parse(context.publish);

  const headers = usePub ?
    new Headers({
      'Authorization': '',
      'Content-Type': 'text/html'
    }) :
    new Headers({
      'Authorization': `Bearer ${context.auth}`,
      'Content-Type': 'text/html'
    });

  context.useProxy && headers.append('aem-url', url);

  const req = context.useProxy ?
    new Request(proxyURL, {
      method: 'get',
      headers: headers,
      mode: 'cors',
      credentials: 'same-origin',
      referrerPolicy: 'origin-when-cross-origin'
    }) :
    new Request(url, {
      method: 'get',
      headers: headers,
      mode: 'cors',
      credentials: 'same-origin',
      referrerPolicy: 'origin-when-cross-origin'
    });


  return fetch(req);

};