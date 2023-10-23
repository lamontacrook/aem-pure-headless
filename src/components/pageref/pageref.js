import React, { useEffect, useState, useContext } from 'react';
import Proptypes from 'prop-types';
import { useErrorHandler } from 'react-error-boundary';
import { AppContext } from '../../utils/context';

import './pageref.css';
import { pageRef } from '../../api/api';

const PageRef = ({ content, config }) => {
  const context = useContext(AppContext);
  const [json, setJson] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    const { _publishUrl, _authorUrl } = content;

    const url = context.defaultServiceURL === context.serviceURL || context.serviceURL.includes('publish-') ?
      _publishUrl.replace('.html', '.model.json') :
      _authorUrl.replace('.html', '.model.json');
   
    const walk = [':items', 'root', ':items', 'container', ':items'];

    pageRef(url, context, walk)
      .then(res => {
        setJson(res);
      })
      .catch(error => {
        handleError(error);
      });

  }, [content, handleError, config, context]);

  return (
    <div className='article-screen' >
      {json && Object.keys(json).map((item) => {
        if (item.startsWith('title')) {
          const props = {
            itemID: `urn:aemconnection:${content._path}/jcr:content/root/container/${item}`,
            itemProp: 'jcr:title',
            itemType: 'text'
          };
          const Element = `${json[item].type}`;
          return (<Element {...props} key={json[item].id}>{json[item].text}</Element>);
        } else if (item === 'contentfragment') {
          const cf = json[item];
          let x = 1;
          return cf.paragraphs.map((par) => {
            const parNo = cf[':items'][`par${x++}`];

            return (
              <React.Fragment key={par}>
                <div key={par} dangerouslySetInnerHTML={{ __html: par }} />
                {parNo && Object.prototype.hasOwnProperty.call(parNo, ':items') && (
                  <Par obj={parNo[':items']} />
                )}
              </React.Fragment>
            );
          });
        }
      })}
    </div>
  );
};

const Par = ({ obj }) => {
  const context = useContext(AppContext);
  let image = '';
  let text = '';

  if (Object.prototype.hasOwnProperty.call(obj, 'text')) {
    text = obj.text;
  } else if (Object.prototype.hasOwnProperty.call(obj, 'image')) {
    image = obj.image;
  }

  return (
    <React.Fragment>
      {image && <img src={`${context.serviceURL}${image.src}`} />}
      <span dangerouslySetInnerHTML={{ __html: text.text }} />
    </React.Fragment>
  );
};

Par.propTypes = {
  obj: Proptypes.object
};

PageRef.propTypes = {
  content: Proptypes.object,
  config: Proptypes.object,
  context: Proptypes.object
};

export default PageRef;