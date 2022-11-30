import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkManager, externalizeImages, MagazineStore } from '../../utils';
import Image from '../image';

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

const promises = [];
const ImageList = ({ content, config }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    content.imageListItems.map(({ _path, _authorUrl, _publishUrl, __typename, title, primaryImage }) => {
      if (__typename === 'PageRef') {
        const usePub = JSON.parse(localStorage.getItem('publish'));

        const url = usePub ?
          _publishUrl.replace('.html', '.content.html') :
          _authorUrl.replace('.html', '.content.html?wcmmode=disabled');

        const headers = usePub ?
          new Headers({
            'Authorization': '',
            'Content-Type': 'text/html'
          }) :
          new Headers({
            'Authorization': `Bearer ${localStorage.auth}`,
            'Content-Type': 'text/html'
          });

        let promise = fetch(url, {
          method: 'get',
          headers: headers
        }).then(res => ({
          res: res.text().then(html => {
            if (html) {
              let body = new DOMParser().parseFromString(html, 'text/html');
              let title = body.querySelector('h1');
              let image = body.querySelector('.cmp-image');
              image = externalizeImages(image.innerHTML);

              setItems((item) => {
                MagazineStore(LinkManager(_path, config), { path: _path, article: html });
                return [...item, { title: title.innerHTML, image: image, path: _path, type: 'xf' }];
              });

            }
          }).catch(err => console.log(err)), promise: 'promise'
        }));

        promises.push(promise);
      } else if (__typename === 'AdventureModel') {
        setItems((item) => {
          return [...item, { title: title, image: primaryImage._publishUrl, path: _path, type: 'cf' }];
        });
      }
    });

    if (promises.length > 0) Promise.all(promises);

  }, [content.imageListItems, config]);

  const title = content._metadata.stringMetadata.map(item => {
    if (item.name === 'title') return item.value;
    else return '';
  });

  let rightPos = 0;
  const scrollLeft = (e, num) => {
    rightPos -= num;
    const element = document.getElementById('list-container-body');
    element.scrollTo({
      left: rightPos,
      behavior: 'smooth'
    });

    setArrows();
  };
 
  const scrollRight = (e, num) => {
    rightPos += num;
    const element = document.getElementById('list-container-body');
    element.scrollTo({
      left: rightPos,
      behavior: 'smooth'
    });

    setArrows();
  };

  const setArrows = () => {
    document.querySelectorAll('.list-container.slider-list .arrow').forEach(item => {
      const element = document.getElementById('list-container-body');
      if (element.scrollWidth - element.clientWidth - rightPos > 0) {
        if (!item.classList.value.includes('left') || rightPos > 0)
          item.style.display = 'unset';
        if(item.classList.value.includes('left') && rightPos <= 0)
          item.style.display = 'none';
      }
    });
  };

  setArrows();

  return (
    <React.Fragment>
      <section className={`list-container ${content.style}`} data-model={title.join('')} data-fragment={content._path}>
        {title && <h4>{title.join('')}</h4>}
        <i className='arrow left' onClick={e => scrollLeft(e, 300)}></i>
        <div className='list' id='list-container-body'>

          {[...new Map(items.map(itm => [itm['path'], itm])).values()].map((item) => (
            <Card key={item.title} item={item} config={config} />
          ))}

        </div>
        <i className='arrow right' onClick={e => scrollRight(e, 300)}></i>
      </section>
    </React.Fragment>
  );
};

ImageList.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object
};

const Card = ({ item, config }) => {
  return (
    <div className='list-item tooltip' key={item.title}>
      <Link key={item.path} to={LinkManager(item.path, config)}>

        <span className='list-item-title tooltiptext'>{item.title}</span>
        {item.type === 'xf' && (
          <picture dangerouslySetInnerHTML={{ __html: item.image }} />)}
        {item.type === 'cf' && (
          <Image src={item.image} />
        )}

      </Link>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
  config: PropTypes.object
};

export default ImageList;
