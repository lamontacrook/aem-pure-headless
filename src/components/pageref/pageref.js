import React, { useEffect, useState, useContext } from 'react';
import Proptypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import { AppContext } from '../../utils/context';

import './pageref.css';
import { pageRef } from '../../api/api';

const PageRef = ({ content, config }) => {
  const context = useContext(AppContext);
  const [json, setJSON] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    const url = content._authorUrl.replace('.html', '.model.json');

    pageRef(url, context)
      .then(res => ({
        res: res.text().then(json => {
          json = JSON.parse(json);
          setJSON(json[':items'].root[':items']);
        })
      }))
      .catch(error => {
        handleError(error);
      });

  }, [content, handleError, config, context]);

  const editorProps = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/data/master`,
    itemType: 'container',
    'data-editor-itemlabel': 'article',
    'data-editor-behavior': 'container'
  };

  return (
    <div className='article-screen' {...editorProps} itemScope>
      {json && Object.keys(json).map((item) => {
        const itemProps = {
          itemID: `urn:aemconnection:${content._path}/jcr:content/root/${item}`,
          'data-editor-behavior':'component'
        };
        if (item === 'title') {
          itemProps.itemProp = 'jcr:title';
          itemProps.itemType = 'text';
          return (
            <h1 key={item} {...itemProps}>{json[item].text}</h1>
          );
        } else if (item.startsWith('text')) {
          itemProps.itemProp = 'text';
          itemProps.itemType = json[item].richText ? 'richtext' : 'text';
          return (
            <p key={item} {...itemProps} dangerouslySetInnerHTML={{ __html: json[item].text }} />
          );
        } else if (item.startsWith('image')) {
          itemProps.itemProp = 'image';
          itemProps.itemType = 'media';
          return (
            <div key={item} className='interstitial-image'>
              <img {...itemProps} src={`${context.serviceURL}${json[item].src}`} />
            </div>
          );
        }
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