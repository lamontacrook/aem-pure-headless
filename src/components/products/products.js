
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Image from '../image';
import { AppContext } from '../../utils/context';
import './products.css';

const Products = ({ content, config }) => {
  console.log(content.productFeed);
  return (
    <div>
      <section className='products'>
        <div className='container'>
          <div className='left-rail'>
            <h3>Shop Refrigerators</h3>
            <ul>
              {content.productFeed.data.map((row) => (
                <li key={row.category_uid}><a href='https://www.bestbuy.com/'>{row.category_name}</a></li>
              ))}
            </ul>
          </div>
          <div className='body'>
            <h3>Shop By Type</h3>
            <div>
              {content.productFeed.data.map((row) => (
                <div className='product-item' key={`${row.category_uid}-${row.category_id}`}>
                  <img src={row.product_thumbnail_url} />
                  <p>{row.category_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Products.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  context: PropTypes.object
};

export default Products;
