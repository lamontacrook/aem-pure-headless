import React, { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { externalizeImagesFromString } from '../../utils';
import { useErrorHandler } from 'react-error-boundary';

import './pageref.css';
import { pageRef } from '../../api/api';

const PageRef = ({ content, config, context }) => {
  const [article, setArticle] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const handleError = useErrorHandler();
  const usePub = JSON.parse(context.publish);

  useEffect(() => {

    const url = usePub ?
      content._publishUrl.replace('.html', '.content.html') :
      content._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

    pageRef(url, context)
      .then(res => ({
        res: res.text().then(html => {
          let body = externalizeImagesFromString(html, context);
          body.querySelector('h1') && setTitle(body.querySelector('h1').innerHTML);
          body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)') && setArticle(new XMLSerializer().serializeToString(body.querySelector('.cmp-contentfragment__elements > div:nth-child(2)'), 'text/html'));
          body.querySelector('h4.cmp-title__text') && setAuthor(body.querySelector('h4.cmp-title__text').innerHTML);
        })
      }))
      .catch(error => {
        handleError(error);
      });

  }, [content, handleError, usePub, config, context]);

  return (
    <div className='article-screen'>
      <h1>{title}</h1>
      <h4>{author}</h4>
      <div className={content.__typename.toLowerCase()} dangerouslySetInnerHTML={{ __html: article }} />
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