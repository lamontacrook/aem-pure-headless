export function sizes(definitions = []) {
  return definitions
    .filter((definition) => definition.size)
    .map((definition) => definition.size)
    .join(', ');
}

export function srcSet(url, definitions = []) {
  console.log(url);
  if (url?.indexOf('/adobe/dynamicmedia/deliver/dm-') >= 0) {
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';

    return definitions
      .filter((definition) => definition.imageWidth)
      .map((definition) => {
        return `${url}${delimiter}width=${definition.imageWidth?.replace('px', '')} ${definition.imageWidth?.replace('px', 'w')}`;
      }).reverse();

  } else if (url?.indexOf('smartimaging') >= 0) {
    console.log('here');
    console.log(url);
    return '';
  } else {
    return definitions
      .filter((definition) => definition.imageWidth)
      .map((definition) => {
        return `${url}/_jcr_content/renditions/${definition.renditionName} ${definition.imageWidth?.replace('px', 'w')}`;
      }).reverse();
  }
}

