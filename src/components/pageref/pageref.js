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
        if (item.startsWith('title')) return <Title obj={json[item]} content={content} item={item} key={item} />; 
        else if (item === 'contentfragment') return <ContentFragment obj={json[item]} key={item} />;
        else if (item.startsWith('text')) return <Text key={item} obj={json[item]} item={item} content={content} />;
        else if (item.startsWith('image')) return <Image key={item} obj={json[item]} context={context} />;
      })}
    </div>
  );
};

const ContentFragment = ({ obj }) => {

  let x = 1;
  return obj.paragraphs.map((par) => {
    const parNo = obj[':items'][`par${x++}`];

    return (
      <React.Fragment key={par}>
        <div key={par} dangerouslySetInnerHTML={{ __html: par }} />
        {parNo && Object.prototype.hasOwnProperty.call(parNo, ':items') && (
          <Par obj={parNo[':items']} />
        )}
      </React.Fragment>
    );
  });
};

ContentFragment.propTypes = {
  obj: Proptypes.object,
};

const Text = ({ obj, content, item }) => {
  const props = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/root/${item}`,
    itemProp: item,
    itemType: 'richtext',
    'data-editor-itemlabel': 'Paragraph'
  };

  const { id, text } = obj;
  return (<div className='text' {...props} key={id} dangerouslySetInnerHTML={{ __html: text }} />);
};

Text.propTypes = {
  obj: Proptypes.object,
  content: Proptypes.object,
  item: Proptypes.string
};

const Title = ({ obj, content, item }) => {
  const { type, text, id } = obj;

  const props = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/root/${item}`,
    itemProp: item,
    itemType: 'text',
    'data-editor-itemlabel': `Title ${type}`
  };
  
  const Element = `${type || 'p'}`;
  return <Element {...props} key={id}>{text}</Element>;
};

Title.propTypes = {
  obj: Proptypes.object,
  content: Proptypes.object,
  item: Proptypes.string
};

const Image = ({ obj }) => {
  const context = useContext(AppContext);
  const { srcset, id, alt, src } = obj;

  if (typeof srcset === 'string') {
    obj.srcset = srcset.split(',').map((item) => {
      return item = `${context.serviceURL}${item.substring(1)}`;
    });
  }
  return (
    <div key={id} className='image'>
      <picture>
        <img src={`${context.serviceURL}${src.substring(1)}`} alt={alt} srcSet={obj.srcset} />
      </picture>
    </div>
  );

};

Image.propTypes = {
  obj: Proptypes.object
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