import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './SignupNavbar.scss';


const SignupNavbar = ({
  label,
  flowStep,
  onBackBtnPress,
  isMobile,
}) => (
  <div className={ classnames(styles.signupNavbar, { [styles.mobile]: isMobile }) }>
    <div className={ classnames(styles.signupNavbar__content, { [styles.mobile]: isMobile }) }>
      <div className={ classnames(styles.signupNavbar__left, { [styles.mobile]: isMobile }) } >
        { flowStep === 1 &&
          <img
            width={ isMobile ? '30' : '35' }
            src="homeleads/Desktop_form_01/ic_close/ic_close@2x.png"
          />
        }
        { flowStep > 1 &&
          <img
            onClick={ onBackBtnPress }
            width={ isMobile ? '30' : '35' }
            style={{ cursor: 'pointer' }}
            src="homeleads/FORM_02/Navigation%20Bar/ic_back/ic_back@2x.png"
          />
        }
      </div>
      <div className={ classnames(styles.signupNavbar__center, { [styles.mobile]: isMobile }) } >
        { label }
      </div>
      <div className={ classnames(styles.signupNavbar__right, { [styles.mobile]: isMobile }) } >
        <img width={ isMobile ? '29' : '48' } src="homeleads/Desktop_form_01/ic_support/ic_support@2x.png" />
      </div>
    </div>
  </div>
);
SignupNavbar.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  flowStep: PropTypes.number.isRequired,
  onBackBtnPress: PropTypes.func.isRequired,
};

export default SignupNavbar;
