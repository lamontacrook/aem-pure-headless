
export const pageRef = (url, context) => {

  const h = context.serviceURL !== context.defaultServiceURL ? {
    'Authorization': `Bearer  ${context.auth}`,
    'Content-Type': 'text/html'
  } : {
    'Content-Type': 'text/html'
  };

  const headers = new Headers(h);

  if(url.includes('publish-')) {
    const req = new Request(url, {
      method: 'get',
      headers: headers,
    });
    return fetch(req);
  } else {
    const req = new Request(url, {
      method: 'get',
      headers: headers,
      credentials: 'include',
    });
    return fetch(req);
  }
  

};