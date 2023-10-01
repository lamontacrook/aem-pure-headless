import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkManager, externalizeImage } from '../../utils';
import Image from '../image';
import './imagelist.css';
import { useErrorHandler } from 'react-error-boundary';
import { pageRef } from '../../api/api';
import { AppContext } from '../../utils/context';

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

const ImageList = ({ content, config }) => {
  const context = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [position, setPosition] = useState(0);
  const [pageType, setPageType] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    const promises = [];
    content.imageListItems.map(({ _path, _authorUrl, adventureType, activity, tripLength, price, _publishUrl, __typename, title, primaryImage }) => {
      setPageType(__typename);
      if (__typename === 'PageRef') {

        const url = context.defaultServiceURL === context.serviceURL ?
          _publishUrl.replace('.html', '.content.html') :
          _authorUrl.replace('.html', '.content.html?wcmmode=disabled');

        let promise = pageRef(url, context).then(res => ({
          res: res.redirected ? handleError({ message: `Bad Authentication.  Try again. ${url}` }) :
            res.text().then(html => {

              if (html) {
                const body = new DOMParser().parseFromString(html, 'text/html');
                const title = body.querySelector('h1');
                const name = body.querySelector('h3');
                const profession = body.querySelector('h5');

                let image = body.querySelector('.cmp-image > img');  
                image = image ? externalizeImage(image, context) : '';
                image.setAttribute('itemID', `urn:aemconnection:${url}/jcr:content/root/container/contentfragment/par1/image`); 
                image.setAttribute('itemProp', 'jcr:primaryType');
                image.setAttribute('itemType', 'media');

                setAuthors((item) => {
                  return [...item, {
                    kind: __typename,
                    style: content.style,
                    name: name && name.innerHTML,
                    profession: profession && profession.innerHTML,
                    title: title && title.innerHTML,
                    image: new XMLSerializer().serializeToString(image),
                    path: _path,
                    type: 'xf'
                  }];
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
            type: 'cf'
          }];
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
      <section className={`${content.style} list-container`} itemID={`urn:aemconnection:${content._path}/jcr:content/data/master`} itemfilter='cf' itemType='reference' data-editor-itemlabel={`ImageList(${content.style})`} itemScope>
        {title && <h4>{title.join('')}</h4>}
        <i className='arrow left' onClick={e => scrollLeft(e, 300)}></i>
        <div className='list' id='list-container-body' onScroll={e => containerChange(e)}>

          {pageType === 'AdventureModel' && [...new Map(items.map(itm => [itm['path'], itm])).values()].map((item) => (
            <React.Fragment key={`${item.kind}-${item.title || item.name}`}>
              <AdventureCard key={item.title} item={item} config={config} />
            </React.Fragment>
          ))}

          {pageType === 'PageRef' && [...new Map(authors.map(itm => [itm['path'], itm])).values()].map((item) => (
            <React.Fragment key={`${item.kind}-${item.title || item.name}`}>
              <Card key={item.name} item={item} config={config} />
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

const Card = ({ item, config }) => {
  const context = useContext(AppContext);

  return (
    <div className='list-item' key={item.title} itemID={`urn:aemconnection:${item.path}/jcr:content/root/container`} itemType='container' data-editor-itemlabel='Experience Fragment'>
      <picture dangerouslySetInnerHTML={{__html: item.image}}></picture>
     
      <Link key={item.path} to={LinkManager(item.path, config, context)}>
        <span className='title' itemID={`urn:aemconnection:${item.path}/jcr:content/root/container/title`} itemProp='jcr:title' itemType='text'>{item.title || item.name}</span>
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

const XFImage = ({item}) => {
  let pic = document.createElement('picture');

  pic.innerHTML = item.image;

  pic.querySelector('img');
  // pic = new XMLSerializer().serializeToString(pic);
  // console.log(pic);
  return (
    <React.Fragment >
      {new XMLSerializer().serializeToString(pic)}
    </React.Fragment>
    
  );
};

XFImage.propTypes = {
  item: PropTypes.string
};

const AdventureCard = ({ item, config }) => {
  const context = useContext(AppContext);

  return (
    <div className='list-item' key={item.title} itemID={`urn:aemconnection:${item.path}/jcr:content/data/master`} 
      itemfilter='cf' itemType='reference' data-editor-itemlabel='Adventure Fragment' itemScope>
      <Image asset={item.image} config={config} itemProp='primaryImage' />
      <Link key={item.path} to={LinkManager(item.path, config, context)}>
        <span className='title' itemProp='title' itemType='text'>{item.title || item.name}</span>
        {item.style === 'image-grid' && (
          <div className='details'>
            <ul>
              <li itemProp='activityType' itemType='text'>{item.activityType}</li>
              <li itemProp='activityLength' itemType='text'>{item.activity}</li>
              <li itemProp='tripLength' itemType='text'>{item.tripLength}</li>
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
