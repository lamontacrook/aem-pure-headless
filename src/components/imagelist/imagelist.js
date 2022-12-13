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
  const [position, setPosition] = useState(0);

  useEffect(() => {
    content.imageListItems.map(({ _path, _authorUrl, type, activity, tripLength, price, _publishUrl, __typename, title, primaryImage }) => {
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
            'Authorization': `Basic ${Buffer.from(localStorage.getItem('auth'), 'utf8').toString('base64')}`,
            'Content-Type': 'text/html',
          });

        let promise = fetch(url, {
          method: 'get',
          headers: headers,
          mode:'cors',
          referrerPolicy: 'origin-when-cross-origin'
        }).then(res => ({
          res: res.text().then(html => {
            if (html) {
              let body = new DOMParser().parseFromString(html, 'text/html');
              let title = body.querySelector('h1');
              let name = body.querySelector('h3');
              let profession = body.querySelector('h5');

              let image = body.querySelector('.cmp-image');
              image = externalizeImages(image.innerHTML);

              setItems((item) => {
                MagazineStore(LinkManager(_path, config), { path: _path, article: html });
                return [...item, { kind: __typename, style: content.style, name: name && name.innerHTML, profession: profession && profession.innerHTML, title: title && title.innerHTML, image: image, path: _path, type: 'xf' }];
              });

            }
          }).catch(err => console.log(err)), promise: 'promise'
        }));

        promises.push(promise);
      } else if (__typename === 'AdventureModel') {
        setItems((item) => {
          return [...item, { kind: __typename, style: content.style, title: title, activityType: type, activity: activity, tripLength: tripLength, price: price, image: primaryImage._publishUrl, path: _path, type: 'cf' }];
        });
      }
    });

    if (promises.length > 0) Promise.all(promises);

  }, [content.imageListItems, content.style, config]);

  const title = content._metadata.stringMetadata.map(item => {
    if (item.name === 'title') return item.value;
    else return '';
  });

  const scrollLeft = (e, num) => {
    const element = e.target.nextElementSibling;
    element.scrollTo({
      left: position - num,
      behavior: 'smooth'
    });

    setPosition(position - num);

  };

  const scrollRight = (e, num) => {
    const element = e.target.previousElementSibling;
    element.scrollTo({
      left: position + num,
      behavior: 'smooth'
    });

    setPosition(position + num);

  };

  const containerChange = (e) => {
    console.log(`${e.target.scrollWidth} ${e.target.clientWidth} ${e.target.scrollLeft}`);
    if ((e.target.scrollWidth - e.target.clientWidth - .5) <= e.target.scrollLeft) {
      e.target.nextElementSibling.style.visibility = 'hidden';
    } else {
      e.target.nextElementSibling.style.visibility = 'visible';
    }

    if (e.target.scrollLeft === 0)
      e.target.previousElementSibling.style.display = 'none';
    else
      e.target.previousElementSibling.style.display = 'unset';
  };

  return (
    <React.Fragment>
      <section className={`${content.style} list-container`} data-model={title.join('')} data-fragment={content._path}>
        {title && <h4>{title.join('')}</h4>}
        <i className='arrow left' onClick={e => scrollLeft(e, 300)}></i>
        <div className='list' id='list-container-body' onScroll={e => containerChange(e)}>

          {[...new Map(items.map(itm => [itm['path'], itm])).values()].map((item) => (
            <React.Fragment key={`${item.kind}-${item.title}`}>
              {(item.kind === 'PageRef') && <Card key={item.title} item={item} config={config} />}
              {(item.kind === 'AdventureModel') && <AdventureCard key={item.title} item={item} config={config} />}
            </React.Fragment>
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
    <div className='list-item' key={item.title}>
      <picture dangerouslySetInnerHTML={{ __html: item.image }} />
      
      <Link key={item.path} to={LinkManager(item.path, config)}>
        <span className='title'>{item.title || item.name}</span>
        {item.style === 'image-grid' && (
          <div className='details'>
            <ul>
              <li>{item.profession}</li>
              <li>{item.profession}</li>
              <li>Hold</li>
            </ul>
          </div>
        )}
      </Link>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
  config: PropTypes.object
};

const AdventureCard = ({ item, config }) => {
  return (
    <div className='list-item' key={item.title}>

      <Image src={item.image} config={config} />
    
      <Link key={item.path} to={LinkManager(item.path, config)}>
        <span className='title'>{item.title || item.name}</span>
        {item.style === 'image-grid' && (
          <div className='details'>
            <ul>
              <li>{item.activityType}</li>
              <li>{item.activity}</li>
              <li>{item.tripLength}</li>
            </ul>
          </div>
        )}
      </Link>
    </div>
  );
};

AdventureCard.propTypes = {
  item: PropTypes.object,
  config: PropTypes.object
};

export default ImageList;
