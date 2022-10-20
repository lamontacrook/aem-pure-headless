import React from 'react';
import ModelManager from '../modelmanager';
import gql from '../api/gql.json';
import { ScreenQry } from '../api/query';

import './screen.css';

const Screen = () => {

  const data = gql['data'];
  let i = 0;

  if (Array.isArray(data.screen.body)) data.screen.body = data.screen.body[0];
  console.log(ScreenQry());
  return (
    <React.Fragment>
      <div className='main-body'>
        {/* <div className='fly-out-gql payload'><pre>{JSON.stringify(gql, null, 2)}</pre></div> */}
        {/* <div className='fly-out-gql request'><pre>{JSON.stringify(ScreenQry(), null, 2)}</pre></div> */}
        {data.screen.body.block.map((item) => (
          <div
            key={`${item._model.title
              .toLowerCase()
              .replace(' ', '-')}-block-${item._model._path}-${i}`}
            className='block'
          >
            
            <ModelManager
              key={`${item._model.title
                .toLowerCase()
                .replace(' ', '-')}-entity-${item._model._path}-${i++}`}
              type={item._model.title}
              content={item}
              references={data.screen._references}
            >

            </ModelManager>
          </div>
        ))}
        
      </div>
    </React.Fragment>
  );
};

export default Screen;
