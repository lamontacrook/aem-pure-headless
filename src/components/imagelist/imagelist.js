import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkManager, externalizeImages, MagazineStore } from '../../utils';
import Image from '../image';

import './imagelist.css';
import { useErrorHandler } from 'react-error-boundary';
import { pageRef } from '../../api/api';

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
const ImageList = ({ content, config, context }) => {

  const [items, setItems] = useState([]);
  const [position, setPosition] = useState(0);
  const [pageType, setPageType] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {

    content.imageListItems.map(({ _path, _authorUrl, adventureType, activity, tripLength, price, _publishUrl, __typename, title, primaryImage }) => {
      setPageType(__typename);
      if (__typename === 'PageRef') {
        const usePub = JSON.parse(context.publish);

        const url = usePub ?
          _publishUrl.replace('.html', '.content.html') :
          _authorUrl.replace('.html', '.content.html?wcmmode=disabled');

        let promise = pageRef(url, context).then(res => ({
          res: res.redirected ? handleError({ message: 'Bad Authentication.  Try again.' }) :
            res.text().then(html => {

              if (html) {
                let body = new DOMParser().parseFromString(html, 'text/html');
                let title = body.querySelector('h1');
                let name = body.querySelector('h3');
                let profession = body.querySelector('h5');

                let image = body.querySelector('.cmp-image');
                if (image && image.innerHTML)
                  image = externalizeImages(image.innerHTML, context);

                setItems((item) => {
                  MagazineStore(LinkManager(_path, config, context), { path: _path, article: html });
                  return [...item, { 
                    kind: __typename, 
                    style: content.style, 
                    name: name && name.innerHTML, 
                    profession: profession && profession.innerHTML, 
                    title: title && title.innerHTML, 
                    image: image, 
                    path: _path, 
                    type: 'xf' }];
                });

              }
            }).catch(err => handleError(err)), promise: 'promise'
        }));

        promises.push(promise);
      } else if (__typename === 'AdventureModel') {
        setItems((item) => {
          return [...item, { 
            kind: __typename, 
            style: content.style, 
            title: title, 
            activityType: adventureType, 
            activity: activity, 
            tripLength: tripLength, 
            price: price, 
            image: primaryImage, 
            path: _path, 
            type: 'cf' }];
        });
      }
    });

    if (promises.length > 0) Promise.all(promises);

  }, [context, content.imageListItems, content.style, config, handleError]);

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
            <React.Fragment key={`${item.kind}-${item.title || item.name}`}>
              {(pageType === 'PageRef' && pageType !== 'AdventureModel') && <Card key={item.name} item={item} config={config} context={context} />}
              {(pageType === 'AdventureModel' && pageType !== 'PageRef') && <AdventureCard key={item.title} item={item} config={config} context={context} />}
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
  config: PropTypes.object,
  context: PropTypes.object
};

const Card = ({ item, config, context }) => {
  return (
    <div className='list-item' key={item.title}>
      <picture dangerouslySetInnerHTML={{ __html: item.image }} />

      <Link key={item.path} to={LinkManager(item.path, config, context)}>
        <span className='title'>{item.title || item.name}</span>
        {item.style === 'image-grid' && (
          <div className='details'>
            <ul>
              <li>{item.profession}</li>
            </ul>
          </div>
        )}
      </Link>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

const AdventureCard = ({ item, config, context }) => {
  return (
    <div className='list-item' key={item.title}>
      <Image asset={item.image} config={config} context={context}/>
      <Link key={item.path} to={LinkManager(item.path, config, context)}>
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
  config: PropTypes.object,
  context: PropTypes.object
};

export default ImageList;
