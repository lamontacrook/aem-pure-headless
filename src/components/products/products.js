import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { mapJsonRichText } from '../../utils/renderRichText';
import { AppContext } from '../../utils/context';
import './products.css';

const Products = ({ content, editorProps }) => {
  const context = useContext(AppContext);
  const [products, setProducts] = useState(null);
  const {commerceSheet} = context.config.configurationByPath.item;

  useEffect(() => {
    fetch(commerceSheet).then((res) => {
      if (res) {
        res.json().then((json) => setProducts(json.data));
      }
    }).catch((error) => {
      throw (error);
    });
  }, [commerceSheet]);

  const findProduct = (product, sku) => {
    return product.product_sku === sku;
  };

  const retrieveProduct = (sku) => {
    if (!products) return;
    const product = products.find((item) => findProduct(item, sku));

    return (
      <React.Fragment>
        <img src={product.product_thumbnail_url} />
        <div className='list-item-content'> 
          <span className='product-name'>{product.product_name}</span>
          <span className='product-description'>{product.product_description}</span>
          <span className='product-price'>{product.product_price}</span>
          <button aria-label="button" className='product-favorite'></button>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className='productlist' {...editorProps}>
      <div className='product-list-title'>
        {mapJsonRichText(content?.headline?.json)}
        <button className="shop-all" aria-label="button">Shop All</button>
      </div>
      <div className='list-items'>
        {products && content.products && content.products.map((product) => (
          <div key={product} className='list-item'>
            {retrieveProduct(product)}
          </div>
        ))}
      </div>
    </div>
  );
};

Products.propTypes = {
  content: PropTypes.object,
  editorProps: PropTypes.object
};

export default Products;


//https://author-p124331-e1227315.adobeaemcloud.com/content/dam/amazon/assets/products/ullaj2263510687_1709571240895_2-0-_QL90_UX282_.jpg/_jcr_content/renditions/original?ch_ck=1711387638000