import React, { useEffect, useState, useContext } from 'react';
import Proptypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import { AppContext } from '../../utils/context';

import './pageref.css';
import { pageRef } from '../../api/api';

const PageRef = ({ content, config }) => {
  const context = useContext(AppContext);
  const [article, setArticle] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cfPath, setCFPath] = useState('');
  const [json, setJSON] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {

    // const url = content._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    // pageRef(url, context)
    //   .then(res => ({
    //     res: res.text().then(html => {
    //       let body = new DOMParser().parseFromString(html, 'text/html'); //externalizeImagesFromString(html, context);
    //       body.querySelector('.contentfragment > article') && setCFPath(body.querySelector('.contentfragment > article').getAttribute('data-cmp-contentfragment-path'));
    //       body.querySelector('h1') && setTitle(body.querySelector('h1').innerHTML);
    //       body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)') && setArticle(new XMLSerializer().serializeToString(body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)'), 'text/html'));
    //       body.querySelector('h4.cmp-title__text') && setAuthor(body.querySelector('h4.cmp-title__text').innerHTML);
    //     })
    //   }))
    //   .catch(error => {
    //     handleError(error);
    //   });

    const url = content._authorUrl.replace('.html', '.model.json');

    pageRef(url, context)
      .then(res => ({
        res: res.text().then(json => {
          json = JSON.parse(json);
          setJSON(json[':items'].root[':items']);
          Object.keys(json[':items'].root[':items']).forEach((keys) => {
            console.log(keys);
            console.log(json[':items'].root[':items'][keys]);
          });
        })
      }))
      .catch(error => {
        handleError(error);
      });

  }, [content, handleError, config, context]);

  return (
    <div className='article-screen'>
      {/* <h1 itemID={`urn:aemconnection:${content._path}/jcr:content/root/container/title`} itemProp='jcr:title' itemType='text'>{title}</h1>
      <h4>{author}</h4>
      <div itemID={`urn:aemconnection:${cfPath}/jcr:content/data/master`} itemfilter='cf' itemType='reference' itemScope className={content.__typename.toLowerCase()} dangerouslySetInnerHTML={{ __html: article }} />
       */}

      {json && Object.keys(json).map((item) => {
        if (item === 'title')
          return (
            <h1
              itemID={`urn:aemconnection:${content._path}/jcr:content/root/title`}
              itemProp='jcr:title' itemType='text'>{json[item].text}</h1>
          );
        else if (item.startsWith('text'))
          return (
            <p
              itemID={`urn:aemconnection:${content._path}/jcr:content/root/${item}`}
              itemProp='jcr:text' itemType='text' dangerouslySetInnerHTML={{ __html: json[item].text }} />
          );
        else if (item.startsWith('image'))
          return (
            <img src={`${context.serviceURL}${json[item].src}`} />
          );
      })}

    </div>


  );
};

PageRef.propTypes = {
  content: Proptypes.object,
  config: Proptypes.object,
  context: Proptypes.object
};

export default PageRef;