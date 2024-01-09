/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export function sizes(definitions = []) { 
  return definitions
    .filter((definition) => definition.size)
    .map((definition) => definition.size)
    .join(', ');
}

export function srcSet(url, definitions = []) { 
  if (url?.indexOf('/adobe/dynamicmedia/deliver/dm-') >= 0) {
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';

    return definitions
      .filter((definition) => definition.imageWidth)
      .map((definition) => {   
        return `${url}${delimiter}width=${definition.imageWidth?.replace('px', '')} ${definition.imageWidth?.replace('px', 'w')}`;
      }).reverse();
  } else {
    return definitions
      .filter((definition) => definition.imageWidth)
      .map((definition) => {   
        return `${url}/_jcr_content/renditions/${definition.renditionName} ${definition.imageWidth?.replace('px', 'w')}`;
      }).reverse();
  }
}