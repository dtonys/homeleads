import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import styles from './NotFound.scss';


let NotFoundPage = () => {
  return (
    <div className={styles.notFound} >
      <Header> Page Not Found </Header>
    </div>
  );
};

if ( module.hot ) {
  const { hot } = require('react-hot-loader');
  NotFoundPage = hot(module)(NotFoundPage);
}
export default NotFoundPage;
