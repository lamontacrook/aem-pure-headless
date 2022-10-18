
import React from 'react';

import Video from '../../media/hero.mov';
import Poster from '../../media/poster.png';

import './teaser.css';

const Teaser = () => {

  return (
    <section className='teaser'>
      <div className="container">
        <video
          autoPlay
          playsInline
          muted
          loop
          src={Video}
          poster={Poster} />
      </div>
    </section>
  );
};

export default Teaser;
