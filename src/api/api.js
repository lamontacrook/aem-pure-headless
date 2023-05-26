export const pageRef = (url) => {
  
  const headers = new Headers({
    // 'Authorization': `Bearer  ${context.auth}`,
    'Content-Type': 'text/html'
  });

  const req = new Request(url, {
    method: 'get',
    headers: headers,
    // mode: 'cors',
    credentials: 'include',
    // referrerPolicy: 'origin-when-cross-origin'
  });


  return fetch(req);

};