import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './imagelist.css';

export const ImageListGQL = `
...on ImageListModel {
  _model {
    title
    _path
  }
  _metadata {
    stringMetadata {
      value
    }
  }
  imageListItems {
    ...on PageRef {
      _authorUrl
      _publishUrl
    }
  }
}`;

let i = 0;
const array = [];
const promises = [];
const ImageList = ({ content }) => {
  const [items, setItems] = useState([]);


  // const constructItems = (html) => {
  //   let body = new DOMParser().parseFromString(html, 'text/html');
  //   let title = body.querySelector('h1');

  //   array.push({
  //     title: title.innerHTML
  //   });
  //   setItems(array);
  // };



  useEffect(() => {
    if (i++ == 0) {
      content.imageListItems.map(({ _authorUrl }) => {
        let promise = fetch(_authorUrl.replace('.html', '.plain.html?wcmmode=disabled'), {
          method: 'get',
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.auth}`,
            'Content-Type': 'text/html'
          })
        }).then(res => ({ res: res, promise: 'promise' }));

        promises.push(promise);
      });

      Promise.all(promises).then(respsonses => {
        respsonses.map((response) => {
          response.res.text().then(html => {
            if (html) {
              let body = new DOMParser().parseFromString(html, 'text/html');
              let title = body.querySelector('h1');
              let image = body.querySelector('.cmp-image');
              console.log(image.innerHTML);
              setItems(item => [...item, {title: title.innerHTML, image: image.innerHTML}]);
            }
          }).catch(err => console.log(err));
        });
      }).catch(error => console.log(error));
    }
 
  }), [items];
  console.log([...items]);
  return (
    <React.Fragment>
      {content._metadata.stringMetadata[0].value && <h4>{content._metadata.stringMetadata[0].value}</h4>}
      <ul className='image-list'>
        {items.map((item) => (
          <li key={item.title}>{item.title}<div dangerouslySetInnerHTML={{__html: item.image}} /></li>
        ))}
        {/* {[...items]} */}
      </ul>
    </React.Fragment>
  );
};

ImageList.propTypes = {
  content: PropTypes.object
};

export default ImageList;
