/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkManager } from '../../utils';
import Image from '../image';
import './imagelist.css';
import { useErrorHandler } from 'react-error-boundary';
import { pageRef } from '../../api/api';
import { AppContext } from '../../utils/context';
import { sizes } from '../../utils/responsive-image';

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

const imageSizes = [
  {
    imageWidth: '500px',
    renditionName: 'web-optimized-large.webp',
    size: '(min-width: 1000px) 500px',
  },
  {
    imageWidth: '331px',
    renditionName: 'web-optimized-medium.webp',
    size: '331px'
  }
];

const ImageList = ({ content, config }) => {
  const context = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [position, setPosition] = useState(0);
  const [pageType, setPageType] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    const promises = [];
    /***
    content.imageListItems.map(({ _path, _authorUrl, adventureType, activity, tripLength, price, _publishUrl, __typename, title, primaryImage, _model }) => {
      setPageType(__typename);
      if (__typename === 'PageRef') {

        const url = context.defaultServiceURL === context.serviceURL || context.serviceURL.includes('publish-') ?
          _publishUrl.replace('.html', '.model.json?two') :
          _authorUrl.replace('.html', '.model.json');

        const walk = [':items', 'root', ':items', 'container', ':items'];
        let promise = pageRef(url, context, walk).then((json) => {

          const profession = json[Object.keys(json).find((elem) => {
            if (elem.startsWith('title_')) {
              json[elem].props = {
                'data-aue-resource': `urn:aemconnection:${url}/jcr:content/root/container/${elem}`,
                'data-aue-prop': 'jcr:title',
                'data-aue-type': 'text'
              };
              return json[elem];
            }
          })];

          json.title.props = {
            'data-aue-resource': `urn:aemconnection:${url}/jcr:content/root/container/${json?.title?.id}`,
            'data-aue-prop': 'jcr:title',
            'data-aue-type': 'text'
          };

          const title = json.title;

          const image = json?.image || json.contentfragment[':items'].par1[':items'].image || json.contentfragment[':items'].par2[':items'].image;
          if (image && image.src) {
            image.srcset = image.srcset.split(',').map((item) => {
              return item = `${context.serviceURL}${item.substring(1)}`;
            });
            if(image.srcset[0].endsWith('300w')) {
              image.src = image.srcset[0].split(' ')[0];
            } else
              image.src = `${context.serviceURL}${image.src.substring(1)}`;
            image.srcset = image.srcset.join(',');
          } else {
            image.src = context.brokenImage;
          }

          setAuthors((item) => {
            return [...item, {
              kind: __typename,
              style: content.style,
              profession: profession,
              title: title,
              image: image,
              path: _path,
              type: 'xf'
            }];
          });
        }).catch((error) => handleError(error));

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
            model: _model,
            type: 'cf'
          }];
        });
      }
    });
    */

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

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/${content._variation}`,
    'data-aue-type': 'container',
    'data-aue-label': title.join(''),
    'data-aue-behavior': 'component',
    'data-aue-model': content?._model?._path
  };

  return (
    <React.Fragment>
      <section className={`${content.style} list-container`} {...editorProps} itemScope>
        {title && <h4>{title.join('')}</h4>}
        <i className='arrow left' onClick={e => scrollLeft(e, 300)}></i>
        <div className='list' id='list-container-body' onScroll={e => containerChange(e)}>
          {content && content.listItems.map((item, i) => {
            if (item['__typename'] === 'AdventureModel') return <AdventureCard key={i} item={item} config={config} />;
            if (item['__typename'] === 'ExperienceFragmentModel') return <Card key={i} item={item} config={config} />;
          })}
          {/* {pageType === 'AdventureModel' && [...new Map(items.map(itm => [itm['path'], itm])).values()].map((item) => (
            <React.Fragment key={`${item.kind}-${item.title || item.name}`}>
              <AdventureCard key={item.title} item={item} config={config} />
            </React.Fragment>
          ))}

          {pageType === 'PageRef' && [...new Map(authors.map(itm => [itm['path'], itm])).values()].map((item) => (
            <React.Fragment key={`${item.kind}-${item.title?.id || item.name}`}>
              <Card key={item.name} item={item} config={config} />
            </React.Fragment>
          ))} */}

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
  const handleError = useErrorHandler();
  const [image, setImage] = useState('');

  const title = item._metadata.stringMetadata.filter((metadata) => {
    if (metadata.name === 'title')
      return metadata.value;
  });
  console.log(item.reference);
  useEffect(() => {
    const walk = [':items', 'root', ':items', 'container', ':items'];
    function makeRequest() {
      const url = context.serviceURL.includes('publish') ? item.reference._publishUrl.replace('.html', '.model.json') : item.reference._authorUrl.replace('.html', '.model.json');

      pageRef(url, context, walk).then((json) => {

        const profession = json[Object.keys(json).find((elem) => {
          if (elem.startsWith('title_')) {
            json[elem].props = {
              'data-aue-resource': `urn:aemconnection:${item.reference._path}/jcr:content/root/container/${elem}`,
              'data-aue-prop': 'jcr:title',
              'data-aue-type': 'text'
            };
            return json[elem];
          }
        })];

        json.title.props = {
          'data-aue-resource': `urn:aemconnection:${item.reference._path}/jcr:content/root/container/${json?.title?.id}`,
          'data-aue-prop': 'jcr:title',
          'data-aue-type': 'text'
        };

        // setTitle(json.title);

        const image = json?.image || json.contentfragment[':items'].par1[':items'].image || json.contentfragment[':items'].par2[':items'].image;
        if (image && image.src) {
          image.srcset = image.srcset.split(',').map((item) => {
            return item = `${context.serviceURL}${item.substring(1)}`;
          });
          if (image.srcset[0].endsWith('300w')) {
            image.src = image.srcset[0].split(' ')[0];
          } else
            image.src = `${context.serviceURL}${image.src.substring(1)}`;
          image.srcset = image.srcset.join(',');
        } else {
          image.src = context.brokenImage;
        }

        setImage(image);



        // setAuthors((item) => {
        //   return [...item, {
        //     kind: __typename,
        //     style: content.style,
        //     profession: profession,
        //     title: title,
        //     image: image,
        //     path: _path,
        //     type: 'xf'
        //   }];
        // })
        // }

      }).catch((error) => handleError(error));
    }
    makeRequest();
  }, [context, handleError, item]);

  const itemProps = {
    'data-aue-resource': `urn:aemconnection:${item.path}/jcr:content/root/container`,
    'data-aue-type': 'container',
    'data-aue-label': title,
    'data-aue-behavior': 'component',
  };

  return (
    <div className='list-item' key={title} {...itemProps}>
      <picture>
        <img src={image?.src} loading='lazy'
          alt={image?.alt || 'list image'}
          srcSet={image?.srcset}
          width="500"
          height="333"
          sizes={sizes(imageSizes)} />
      </picture>

      {/* <Link key={item.path} to={LinkManager(item.path, config, context)} name={title || item.name}>
        <span className='title' {...item.title.props}>{title || item.name}</span>
        {item.style === 'image-grid' && (
          <div className='details'>
            <ul>
              <li {...item.profession?.props}>{item.profession?.text}</li>
            </ul>
          </div>
        )}
      </Link> */}
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object,
};

const AdventureCard = ({ item, config }) => {
  const context = useContext(AppContext);

  const editorProps = {
    'data-aue-resource': `urn:aemconnection:${item.path}/jcr:content/data/master`,
    'data-aue-type': 'component',
    'data-aue-label': `${item.title} Adventure`,
    'data-aue-behavior': 'component',
    'data-aue-model': item.model
  };

  const adventureCardImageSizes = [
    {
      imageWidth: '350px',
      renditionName: 'web-optimized-small.webp',
      size: '350px'
    }
  ];

  let width = 500;
  let height = 360;

  if (item.style === 'image-grid') {
    width = 350;
    height = 320;
  }

  return (
    <div className='list-item' key={item.title} {...editorProps}>
      <Image asset={item.primaryImage} config={config} alt={item.title} itemProp='primaryImage' width={width} height={height} imageSizes={adventureCardImageSizes} />
      <Link key={item.path} name={item.title || item.name} to={LinkManager(item.path, config, context)}>
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
  context: PropTypes.object,
};

export default ImageList;
