
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Image from '../image';
import { AppContext } from '../../utils/context';
import './testimonial.css';

const Testimonial = ({ content }) => {
  const context = useContext(AppContext);
  return (
    <div className='testimonial' itemID={`urn:aemconnection:${content._path}/jcr:content/data/master`} itemfilter='cf' itemType='reference' data-editor-itemlabel='Customer Testimonial' itemScope>
      <h3>Customer Testimonial</h3>
      <div>
        <span className='caption' itemProp='caption' itemType='richtext' data-editor-itemlabel='Caption'>{content.caption.plaintext}</span>
        <div className='customer-photo'>
          <Image asset={content.asset} />
        </div>
      </div>
    </div>
  );
};

Testimonial.propTypes = {
  content: PropTypes.object,
};

export default Testimonial;
