import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Input,
  Button,
} from 'semantic-ui-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  phone as normalizePhone,
  number as normalizeNumber,
} from 'helpers/normalizers';
import {
  Form as RFForm,
  Field as RFField,
  FormSpy as RFFormSpy,
} from 'react-final-form';
import {
  required as requiredValidator,
  email as emailValidator,
  exactLength as exactLengthValidator,
  composeValidators,
} from 'helpers/validators';
import { getRentRange } from 'helpers/util';
import styles from '../../pages/Home/Home.scss';


const SignupForm = ({
  onSubmit,
  onFormStateChange,
  progressStep,
  autoCompleteAddress,
  onAutoCompleteSelect,
  onAutoCompleteChange,
  onAddressBlur,
  addressTouched,
  autoCompleteSelected,
  apiLoading,
  noZillowDataOnAddress,
  suggestedMonthlyRent,
  initialFormValues,
}) => (
  <div>
    <Header as="h3"> Enter your information </Header>
    <RFForm
      onSubmit={ onSubmit }
      initialValues={ initialFormValues }
    >
      {({ handleSubmit }) => (
        <Form className={styles.form} onSubmit={ handleSubmit } >
          <RFFormSpy onChange={onFormStateChange} />
          <RFField name="first_name" >
            {({ input, meta }) => (
              <Form.Field >
                <label>first name</label>
                <input {...input} placeholder="first name" />
                { meta.touched && meta.error &&
                  <p className={styles.inputError} > {meta.error} </p>
                }
              </Form.Field>
            )}
          </RFField>
          <RFField name="last_name" >
            {({ input, meta }) => (
              <Form.Field >
                <label>last name</label>
                <input {...input} placeholder="last name" />
                { meta.touched && meta.error &&
                  <p className={styles.inputError} > {meta.error} </p>
                }
              </Form.Field>
            )}
          </RFField>
          <RFField name="email" validate={composeValidators(requiredValidator, emailValidator)} >
            {({ input, meta }) => (
              <Form.Field >
                <label>email</label>
                <input {...input} placeholder="email" />
                { meta.touched && meta.error &&
                  <p className={styles.inputError} > {meta.error} </p>
                }
              </Form.Field>
            )}
          </RFField>
          <RFField name="phone"
            validate={composeValidators(
              requiredValidator, exactLengthValidator(14, 'Invalid phone number')
            )}
            parse={normalizePhone}
          >
            {({ input, meta }) => (
              <Form.Field >
                <label>phone</label>
                <input {...input} placeholder="phone" />
                { meta.touched && meta.error &&
                  <p className={styles.inputError} > {meta.error} </p>
                }
              </Form.Field>
            )}
          </RFField>
          <br /><hr /><br />
          <Form.Field disabled={ progressStep < 2 } >
            <label>address</label>
            <PlacesAutocomplete
              value={autoCompleteAddress}
              onChange={onAutoCompleteChange}
              onSelect={onAutoCompleteSelect}
              googleLogo
            >
              {( {
                getInputProps, suggestions, getSuggestionItemProps, loading,
              } ) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Enter an address ...',
                      className: 'location-search-input',
                    })}
                    onBlur={onAddressBlur}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            { !(progressStep < 2) && addressTouched && !autoCompleteSelected &&
              <p className={styles.inputError} > Invalid Address </p>
            }
          </Form.Field>
          <Form.Field disabled={ progressStep < 2 } >
            <label>suggested monthly rent minimum</label>
            <Input
              readOnly
              placeholder=""
              label="$"
              value={ getRentRange(suggestedMonthlyRent)[0] }
              loading={apiLoading}
            />
          </Form.Field>
          <Form.Field disabled={ progressStep < 2 } >
            <label>suggested monthly rent maximum</label>
            <Input
              readOnly
              placeholder=""
              label="$"
              value={ getRentRange(suggestedMonthlyRent)[1] }
              loading={apiLoading}
            />
            { noZillowDataOnAddress &&
              <p className={styles.inputError} > {'No address data found'} </p>
            }
            <div style={{ textAlign: 'right', marginTop: 10 }} >
              <img src="/img/Zillowlogo_200x50.gif" />
            </div>
          </Form.Field>
          <br /><hr /><br />
          <RFField
            name="actual_monthly_rent"
            parse={normalizeNumber}
          >
            {({ input, meta }) => (
              <Form.Field disabled={ progressStep < 3 } >
                <label>actual monthly rent</label>
                <Input {...input} label="$" placeholder="" />
                { meta.touched && meta.error &&
                  <p className={styles.inputError} > {meta.error} </p>
                }
              </Form.Field>
            )}
          </RFField>
          <br />
          <Button fluid disabled={progressStep < 4} > Submit </Button>
        </Form>
      )}
    </RFForm>
  </div>
);

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFormStateChange: PropTypes.func.isRequired,
  progressStep: PropTypes.number.isRequired,
  autoCompleteAddress: PropTypes.string.isRequired,
  onAutoCompleteSelect: PropTypes.func.isRequired,
  onAutoCompleteChange: PropTypes.func.isRequired,
  onAddressBlur: PropTypes.func.isRequired,
  addressTouched: PropTypes.bool.isRequired,
  autoCompleteSelected: PropTypes.bool.isRequired,
  apiLoading: PropTypes.bool.isRequired,
  noZillowDataOnAddress: PropTypes.bool.isRequired,
  suggestedMonthlyRent: PropTypes.number,
  initialFormValues: PropTypes.object.isRequired,
};
SignupForm.defaultProps = {
  suggestedMonthlyRent: null,
};
export default SignupForm;
