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