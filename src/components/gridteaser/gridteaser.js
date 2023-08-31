
import React from 'react';
import PropTypes from 'prop-types';
import Image from '../image';
import './gridteaser.css';

const Gridteaser = ({ content, config }) => {
  const editorProps = {
    itemID: `urn:aemconnection:${content._path}/jcr:content/data/master`,
    itemfilter: 'cf',
    itemType: 'reference',
    'data-editor-itemlabel': 'GridTeaser'
  };

  console.log(content);
  return (
    <div {...editorProps} itemScope>
      <section className='gridteaser'>
        <div className='left'><Image asset={content.imagePosition1} config={config} /></div>
        <div className='right-topbar'>
          <h4>Recommended for You</h4>
          <ul>
            <li>
              <div>
                <Image asset={content.product1} config={config} />
                <p>{content.product1Title}</p>
              </div>
            </li>
            <li>
              <div>
                <Image asset={content.product2} config={config} />
                <p>{content.product2Title}</p>
              </div>
            </li>
            <li>
              <div>
                <Image asset={content.product3} config={config} />
                <p>{content.product3Title}</p>
              </div>
            </li>
            <li>
              <div>
                <Image asset={content.product4} config={config} />
                <p>{content.product4Title}</p>
              </div>
            </li>
          </ul>
        </div>
        <div className='bottom-left-box'><Image asset={content.imagePosition3} config={config} /></div>
        <div className='bottom-right-box'>
          <div>
            <Image asset={content.product1} config={config} />
            <p>{content.product1Title}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

Gridteaser.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

export default Gridteaser;
