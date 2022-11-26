import React, { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { MagazineStore, LinkManager, externalizeImagesFromHtml } from '../../utils';
import { useErrorHandler } from 'react-error-boundary';

import './pageref.css';

const PageRef = ({ content, config }) => {
  const [article, setArticle] = useState('');
  const handleError = useErrorHandler();
  const usePub = JSON.parse(localStorage.getItem('usePub'));

  useEffect(() => {
   
    if (MagazineStore(LinkManager(content._path, config)) !== undefined) {
      const article = usePub ? LinkManager(content._path, config).article : externalizeImagesFromHtml(LinkManager(content._path, config).article);
      setArticle(article);
    }
    else {
      
      const url = usePub ?
        content._publishUrl.replace('.html', '.content.html') :
        content._authorUrl.replace('.html', '.content.html?wcmmode=disabled');

      var options = usePub ? {
        method: 'get',
      } : {
        method: 'get',
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.auth}`,
          'Content-Type': 'text/html'
        })
      };


      fetch(url, options)
        .then(res => ({
          res: res.text().then(html => { 
            setArticle(usePub ? html : externalizeImagesFromHtml(html));
          })
        }))
        .catch(error => {
          handleError(error);
        });
    }
  }, [content, handleError, usePub, config]);

  return (
    <React.Fragment>
      <div className={content.__typename.toLowerCase()} dangerouslySetInnerHTML={{ __html: article}} />
    </React.Fragment>
  );
};

PageRef.propTypes = {
  content: Proptypes.object,
  config: Proptypes.object
};

export default PageRef;