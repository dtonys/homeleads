import React from 'react';
import { hot } from 'react-hot-loader';
import styles from './NotFound.scss';


const NotFoundPage = () => {
  return (
    <div className={styles.notFound} >
      <h1> Page Not Found </h1>
    </div>
  );
};

export default hot(module)(NotFoundPage);
