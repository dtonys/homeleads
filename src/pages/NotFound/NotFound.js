import React from 'react';
import { Header } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import styles from './NotFound.scss';


const NotFoundPage = () => {
  return (
    <div className={styles.notFound} >
      <Header> Page Not Found </Header>
    </div>
  );
};

export default hot(module)(NotFoundPage);
