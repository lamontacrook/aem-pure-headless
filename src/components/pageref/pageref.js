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
  const handleError = useErrorHandler();
  
  useEffect(() => {

    const url = content._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    pageRef(url, context)
      .then(res => ({
        res: res.text().then(html => {
          let body = new DOMParser().parseFromString(html, 'text/html'); //externalizeImagesFromString(html, context);
          body.querySelector('.contentfragment > article') && setCFPath(body.querySelector('.contentfragment > article').getAttribute('data-cmp-contentfragment-path'));
          body.querySelector('h1') && setTitle(body.querySelector('h1').innerHTML);
          body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)') && setArticle(new XMLSerializer().serializeToString(body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)'), 'text/html'));
          body.querySelector('h4.cmp-title__text') && setAuthor(body.querySelector('h4.cmp-title__text').innerHTML);
        })
      }))
      .catch(error => {
        handleError(error);
      });

  }, [content, handleError, config, context]);

  return (
    <div className='article-screen'>
      <h1 itemID={`urn:aemconnection:${content._path}/jcr:content/root/container/title`} itemProp='jcr:title' itemType='text'>{title}</h1>
      <h4>{author}</h4>
      <div itemID={`urn:aemconnection:${cfPath}/jcr:content/data/master`} itemfilter='cf' itemType='reference' itemScope className={content.__typename.toLowerCase()} dangerouslySetInnerHTML={{ __html: article }} />
      <button className='button read-more'>Read More</button>
    </div>
  );
};

PageRef.propTypes = {
  content: Proptypes.object,
  config: Proptypes.object,
  context: Proptypes.object
};

export default PageRef;