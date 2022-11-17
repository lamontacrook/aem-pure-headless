import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MagazineStore, LinkManager, externalizeImages } from '../../utils';
import './article.css';

export const ArticleGQL = `
...on ArticleModel {
  _model {
    title
    _path
  }
  _metadata {
    stringMetadata {
      value
    }
  }
  articleBodyXF {
    ...on PageRef {
      _path
      _authorUrl
      _publishUrl
    }
  }
}`;

const Article = ({ content }) => {
  const [article, setArticle] = useState('');

  useEffect(() => {
    const item = MagazineStore()[LinkManager(content.articleBodyXF._authorUrl)];
    if (item) setArticle(item.article);
    else {
      fetch(content.articleBodyXF._authorUrl.replace('.html', '.content.html?wcmmode=disabled'), {
        method: 'get',
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.auth}`,
          'Content-Type': 'text/html'
        })
      }).
        then((response) => {
          if (response) {
            response.text().then((html) => {
              let body = new DOMParser().parseFromString(html, 'text/html');
              
              for(let i = 0; i < [...body.images].length; i++) {
                const pub = localStorage.getItem('serviceURL').replace('author', 'publish');
                
                [...body.images][i].src=[...body.images][i].src.replace(document.location.origin, pub);
                [...body.images][i].srcset=[...body.images][i].srcset.replaceAll('/adobe/dynamicmedia/', `${pub}/adobe/dynamicmedia/`);
                
              }
              setArticle(new XMLSerializer().serializeToString(body, 'text/html'));
            });
          }
        }).catch((error) => {
          console.error(error);
        });
    }
  }, [content]);

  return (
    <div dangerouslySetInnerHTML={{__html: article}} />
  );
};

Article.propTypes = {
  content: PropTypes.object
};

export default Article;


