import React from 'react';
import Proptypes from 'prop-types';
import { mapJsonRichText } from '../../utils/renderRichText';

const MagazineArticle = ({ content }) => {
  console.log(content);
  return (
    <div className='article-screen' >
      {content.title}
      {mapJsonRichText(content.article.json)}
    </div>
  );
};

MagazineArticle.propTypes = {
  content: Proptypes.object
};

export default MagazineArticle;