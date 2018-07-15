import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import classnames from 'classnames';
import styles from '../../pages/Home/Home.scss';


const SignupFormProgress = ({ progressStep }) => (
  <div>
    <Header as="h3"> Your Progress </Header>
    <div className={styles.circleContainer} >
      <div className={styles.circleRegion} >
        <div className={classnames(
          styles.circle,
          progressStep > 1 ? styles.completed : null,
          progressStep === 1 ? styles.active : null,
        )} >
          <div className={styles.circleText} > {'Basic Info'} </div>
        </div>
      </div>
      <div className={styles.circleRegion} >
        <div className={classnames(
          styles.circle,
          progressStep > 2 ? styles.completed : null,
          progressStep === 2 ? styles.active : null,
        )} >
          <div className={styles.circleText} > {'Home Address'} </div>
        </div>
      </div>
      <div className={styles.circleRegion} >
        <div className={classnames(
          styles.circle,
          progressStep > 3 ? styles.completed : null,
          progressStep === 3 ? styles.active : null,
        )} >
          <div className={styles.circleText} > {'Monthly Rent'} </div>
        </div>
      </div>
      <div className={styles.circleRegion} >
        <div className={classnames(
          styles.circle,
          progressStep > 4 ? styles.completed : null,
          progressStep === 4 ? styles.active : null,
        )} >
          <div className={styles.circleText} > {'Signup Complete'} </div>
        </div>
      </div>
    </div>
  </div>
);
SignupFormProgress.propTypes = {
  progressStep: PropTypes.number.isRequired,
};

export default SignupFormProgress;
