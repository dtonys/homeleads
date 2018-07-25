import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignupForm from 'components/SignupForm/SignupForm';
import classnames from 'classnames';
import styles from 'pages/Signup/Signup.scss';


class SignupStepBasicInfo extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor( props ) {
    super(props);
    this.state = {
      formValid: false,
    };
  }

  onSignupFormRef = ( element ) => {
    this.$signupForm = element;
  }

  triggerFormSubmit = () => {
    if ( this.$signupForm ) {
      this.$signupForm.dispatchEvent(new Event('submit'));
    }
  }

  onFormStateChange = ( formState ) => {
    const { formValid } = this.state;
    const formValidChanged = formValid !== formState.valid;
    if ( formValidChanged ) {
      this.setState({
        formValid: formState.valid,
      });
    }
  }

  render() {
    const { formValid } = this.state;
    const {
      isMobile,
      onSubmit,
    } = this.props;

    return (
      <div>
        <div className={ styles.signupStepBasicInfo } >
          <div style={{ paddingTop: '17px' }} ></div>
          <SignupForm
            isMobile={isMobile}
            onSubmit={onSubmit}
            onSignupFormRef={this.onSignupFormRef}
            onFormStateChange={this.onFormStateChange}
          />
          <div style={{ marginTop: 22 }} ></div>
          <div
            className={styles.signupDisclaimer}
          >
            {'By signing up, I agree to Belong\'s'}
            <a style={{ fontSize: '14px', color: '#009BFF' }} href="#" >
              {' Terms of Service '}
            </a>{'and'}
            <a style={{ fontSize: '14px', color: '#009BFF' }} href="#" >
              {' Privacy Policy'}
            </a>.
          </div>
          <div style={{ marginTop: 32 }} ></div>
          <button
            disabled={!formValid}
            className={
              classnames(styles.signupBtn, {
                [styles.mobile]: isMobile,
                [styles.disabled]: !formValid,
              }) }
            onClick={ this.triggerFormSubmit }
          >
            ENTER PROPERTY
          </button>
        </div>
      </div>
    );
  }

}

export default SignupStepBasicInfo;
