import React from 'react';
import PropTypes from 'prop-types';
import './products.css';

const Products = ({ productItems }) => {
  return (
    <div className='product-container'>
      {productItems && [...new Map(productItems.map(item =>[item.product_sku, item])).values()].map((item) => (
        <Product product={item} key={item.product_sku} />
      ))}
    </div>
  );
};

Products.propTypes = {
  productItems: PropTypes.array
};

export default Products;

const Product = ({ product }) => {
  const pic = createOptimizedPicture(product.product_thumbnail_url);
  return (
    <div className='product-item'>
      <div className='product-image' dangerouslySetInnerHTML={{__html: pic.outerHTML.toString()}} />
      <p className='product-name'>{product.product_name}</p>
      <p className='product-price'>{Number(product.product_price).toLocaleString('en')}</p>
      <p className='product-description'>{product.product_description}</p>
      <button name='add-to-cart' className='button'>Add to Cart</button>
      <button name='add-to-cart' className='button'>Quick View</button>
    </div>
  );
};

function createOptimizedPicture(
  src,
  alt = '',
  eager = false,
  breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }],
) {
  const picture = document.createElement('picture');
  const pathname = src;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

Product.propTypes = {
  product: PropTypes.object
};
