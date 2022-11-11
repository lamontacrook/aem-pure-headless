import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import { LinkManager } from '../../utils';

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
const promises = [];
const ImageList = ({ content }) => {
  const [items, setItems] = useState([]);

  const externalizeImages = (image) => {
    image = image.replaceAll('/content/', `${localStorage.getItem('serviceURL').replace('author', 'publish')}/content/`);
    return image;
  };
  
  useEffect(() => {
    if (i++ == 0) {
      content.imageListItems.map(({ _path, _authorUrl }) => {
        let promise = fetch(_authorUrl.replace('.html', '.content.html?wcmmode=disabled'), {
          method: 'get',
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.auth}`,
            'Content-Type': 'text/html'
          })
        }).then(res => ({
          res: res.text().then(html => {
            if (html) {

              let body = new DOMParser().parseFromString(html, 'text/html');
              let title = body.querySelector('h1');
              let image = body.querySelector('.cmp-image');
              image = externalizeImages(image.innerHTML);

              setItems(item => [...item, { title: title.innerHTML, image: image, path: _path }]);
            }
          }).catch(err => console.log(err)), promise: 'promise'
        }));


        promises.push(promise);
      });

      Promise.all(promises);
    }

  }), [items];

  return (
    <React.Fragment>

      {content._metadata.stringMetadata[0].value && <h4>{content._metadata.stringMetadata[0].value}</h4>}
      <ParallaxProvider scrollAxis="horizontal">
        <ul className='image-list'>
          {items.map((item) => (
            <li key={item.title}>
              <Link key={item.path} to={LinkManager(item.path)}>
                <div className='list-item tooltip'>
                  <span className='list-item-title tooltiptext'>{item.title}</span>
                  <div dangerouslySetInnerHTML={{ __html: item.image }} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </ParallaxProvider>
    </React.Fragment>
  );
};

ImageList.propTypes = {
  content: PropTypes.object
};

export default ImageList;
