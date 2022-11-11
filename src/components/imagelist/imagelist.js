import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './imagelist.css';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

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
const promises = [];
const ImageList = ({ content }) => {
  const [items, setItems] = useState([]);

  const externalizeImages = (image) => {
    image = image.replaceAll('/content/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/content/`);
    return image;
  };
  let imageArray = [];
  useEffect(() => {
    if (i++ == 0) {
      content.imageListItems.map(({ _authorUrl }) => {
        let promise = fetch(_authorUrl.replace('.html', '.content.html?wcmmode=disabled'), {
          method: 'get',
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.auth}`,
            'Content-Type': 'text/html'
          })
        }).then(res => ({ res: res.text().then(html => {
          if (html) {
            
            let body = new DOMParser().parseFromString(html, 'text/html');
            let title = body.querySelector('h1');
            let image = body.querySelector('.cmp-image');
            image = externalizeImages(image.innerHTML);
      
            setItems(item => [...item, { title: title.innerHTML, image: image }]);
            // console.log(title.innerHTML);

            // setItems({ title: title.innerHTML, image: image });
          }
        }).catch(err => console.log(err)) , promise: 'promise' }));


        promises.push(promise);
      });

      Promise.all(promises).then(respsonses => {
       
        respsonses.map((response) => {
          // console.log(items.length);
          // setItems(item => [...item, { title: title.innerHTML, image: image }]);
          // setItems(imageArray);
          // console.log(response.res);
          // response.res
        });
      }).catch(error => console.log(error));
    }

  }), [items];

  return (
    <React.Fragment>
      {content._metadata.stringMetadata[0].value && <h4>{content._metadata.stringMetadata[0].value}</h4>}
      <ul className='image-list'>
        {items.map((item) => (
          <li key={item.title}>
            <div className='list-item tooltip'>
              <span className='list-item-title tooltiptext'>{item.title}</span>
              <div dangerouslySetInnerHTML={{ __html: item.image }} />
            </div>
          </li>
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
