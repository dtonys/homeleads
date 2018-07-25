import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { phone as normalizePhone } from 'helpers/normalizers';
import {
  Form as RFForm,
  FormSpy as RFFormSpy,
  Field as RFField,
} from 'react-final-form';
import {
  required as requiredValidator,
  email as emailValidator,
  exactLength as exactLengthValidator,
  composeValidators,
} from 'helpers/validators';
import styles from 'pages/Signup/Signup.scss';


const SignupForm = ({
  isMobile,
  onSubmit,
  onSignupFormRef,
  onFormStateChange,
}) => (
  <div className={styles.signupForm__wrap} >
    <RFForm
      onSubmit={ onSubmit }
    >
      {({ handleSubmit }) => (
        <form
          className={ styles.signupForm }
          onSubmit={ handleSubmit }
          ref={ onSignupFormRef }
        >
          <RFFormSpy onChange={onFormStateChange} />
          <div style={{ display: 'flex' }} >
            <RFField name="first_name" >
              {({ input, meta }) => (
                <div
                  className={
                    classnames(styles.signupForm__inputWrap, {
                      [styles.mobile]: isMobile,
                      [styles.error]: meta.touched && meta.error,
                    })
                  }
                  style={{ width: '50%', borderRight: 'solid #EDEDED 1px' }}
                >
                  <img
                    style={{
                      width: isMobile ? 22 : 32,
                      position: 'absolute',
                      left: 30,
                      top: '50%',
                      marginTop: isMobile ? -8 : -13,
                    }}
                    src="/homeleads/Desktop_form_01/list/ic_profile_firstname/ic_name@2x.svg"
                  />
                  <input
                    {...input}
                    style={{ paddingLeft: 67 }}
                    className={classnames(styles.signupForm__input, { [styles.mobile]: isMobile }) }
                    type="text"
                    placeholder="First name"
                  />
                </div>
              )}
            </RFField>
            <RFField name="last_name" >
              {({ input, meta }) => (
                <div
                  className={
                    classnames(styles.signupForm__inputWrap, {
                      [styles.mobile]: isMobile,
                      [styles.error]: meta.touched && meta.error,
                    })
                  }
                  style={{ display: 'flex', width: '50%' }}
                >
                  <input
                    {...input}
                    className={classnames(styles.signupForm__input, { [styles.mobile]: isMobile })}
                    type="text"
                    placeholder="Last name"
                  />
                </div>
              )}
            </RFField>
          </div>

          <div style={{ display: 'flex' }} >
            <RFField
              name="email"
              validate={composeValidators(requiredValidator, emailValidator)}
            >
              {({ input, meta }) => (
                <div
                  className={
                    classnames(styles.signupForm__inputWrap, {
                      [styles.mobile]: isMobile,
                      [styles.error]: meta.touched && meta.error,
                    })
                  }
                >
                  <img
                    style={{
                      width: isMobile ? 22 : 32,
                      position: 'absolute',
                      left: 30,
                      top: '50%',
                      marginTop: isMobile ? -8 : -13,
                    }}
                    src="/homeleads/Desktop_form_01/list%20copy%202/ic_profile_email/ic_email@2x.svg"
                  />
                  <input
                    {...input}
                    style={{ paddingLeft: 67 }}
                    className={classnames(styles.signupForm__input, { [styles.mobile]: isMobile })}
                    type="text"
                    placeholder="Email"
                  />
                </div>
              )}
            </RFField>
          </div>
          <div style={{ display: 'flex' }} >
            <RFField
              name="password"
              validate={requiredValidator}
            >
              {({ input, meta }) => (
                <div
                  className={
                    classnames(styles.signupForm__inputWrap, {
                      [styles.mobile]: isMobile,
                      [styles.error]: meta.touched && meta.error,
                    })
                  }
                >
                  <img
                    style={{
                      width: isMobile ? 16 : 22,
                      position: 'absolute',
                      left: isMobile ? 34 : 36,
                      top: '50%',
                      marginTop: isMobile ? -12 : -17,
                    }}
                    src="/homeleads/Desktop_form_01/list%20copy%203/ic_profile_password/ic_password@2x.svg"
                  />
                  <input
                    {...input}
                    style={{ paddingLeft: 67 }}
                    className={classnames(styles.signupForm__input, { [styles.mobile]: isMobile })}
                    type="password"
                    placeholder="Password"
                  />
                </div>
              )}
            </RFField>
          </div>

          <div style={{ display: 'flex' }} >
            <RFField
              name="phone"
              validate={composeValidators(
                requiredValidator, exactLengthValidator(14, 'Invalid phone number')
              )}
              parse={normalizePhone}
            >
              {({ input, meta }) => (
                <div
                  className={
                    classnames(styles.signupForm__inputWrap, {
                      [styles.mobile]: isMobile,
                      [styles.error]: meta.touched && meta.error,
                    })
                  }
                >
                  <img
                    style={{
                      width: isMobile ? 15 : 21,
                      position: 'absolute',
                      top: '50%',
                      left: isMobile ? 35 : 37,
                      marginTop: isMobile ? -10 : -16,
                    }}
                    src="/homeleads/Desktop_form_01/list%20copy%204/ic_profile_phone/ic_phhone@2x.svg"
                  />
                  <input
                    {...input}
                    style={{ paddingLeft: 67 }}
                    className={classnames(styles.signupForm__input, { [styles.mobile]: isMobile })}
                    type="text"
                    placeholder="Phone number"
                  />
                </div>
              )}
            </RFField>
          </div>
        </form>
      )}
    </RFForm>
  </div>
);

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onSignupFormRef: PropTypes.func.isRequired,
  onFormStateChange: PropTypes.func.isRequired,
};
export default SignupForm;
