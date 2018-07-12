import React, { Component } from 'react';
// TODO(@dtonys): Add proptypes
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { compose } from 'redux';

import { hot } from 'react-hot-loader';
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
import {
  phone as normalizePhone,
  number as normalizeNumber,
} from 'helpers/normalizers';

import PlacesAutocomplete from 'react-places-autocomplete';

import styles from './Home.scss';
import {
  Header,
  Table,
  Form,
  Button,
  Input,
} from 'semantic-ui-react';


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

const getRentRange = ( suggestedMonthlyRent ) => {
  return [
    suggestedMonthlyRent ? suggestedMonthlyRent - ( suggestedMonthlyRent * 0.1 ) : '',
    suggestedMonthlyRent ? suggestedMonthlyRent + ( suggestedMonthlyRent * 0.1 ) : '',
  ];
};
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
                <input {...input} placeholder='first name' />
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
                <input {...input} placeholder='last name' />
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
                <input {...input} placeholder='email' />
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

const SearchedProperties = ({ searchHistory }) => (
  <div>
    <Header as="h3"> Searched Properties </Header>
    <Table celled compact="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Property</Table.HeaderCell>
          <Table.HeaderCell>Rent Min</Table.HeaderCell>
          <Table.HeaderCell>Rent Max</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { searchHistory.map(( [ street, suggestedMonthlyRent ], index ) => {
          const [ rentMin, rentMax ] = getRentRange(suggestedMonthlyRent);
          return (
            <Table.Row key={ index } >
              <Table.Cell>{street}</Table.Cell>
              <Table.Cell>{rentMin}</Table.Cell>
              <Table.Cell>{rentMax}</Table.Cell>
            </Table.Row>
          );
        }) }
      </Table.Body>
    </Table>
  </div>
);

const Instructions = () => (
  <div>
    <Header as="h3"> Start collecting leads for your home </Header>
    <div style={{ textAlign: 'left' }} >
      <p> {'Please fill out the form on this page to signup to our service.'} </p>
      <p> {'First, enter your basic information.'} </p>
      <p> {`Next, enter the address of your home, and we'll look up your
              expected monthly rent for this property, fetched from Zillow.`}
      </p>
      <p> {`Finally, enter the rent you would like to associate with this property,
                    and hit the submit button to save this property and signup for our service.`}
      </p>
      <p> {'We\'ll save every property you search for, along with its expected monthly rent.'} </p>
    </div>
  </div>
);

// Window width helpers
const WINDOW_WIDTH_MOBILE = 750;
const getWindowWidth = () => ( Math.max(document.documentElement.clientWidth, window.innerWidth || 0) );
const windowWidthIsMobile = ( windowWidth ) => ( windowWidth <= WINDOW_WIDTH_MOBILE );
const currentWindowWidthIsMobile = () => ( windowWidthIsMobile( getWindowWidth() ) );

class HomePage extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      isMobile: currentWindowWidthIsMobile(),
      progressStep: 1,
      autoCompleteAddress: '',
      autoCompleteSelected: false,
      addressTouched: false,
      suggestedMonthlyRent: null,
      apiLoading: false,
      noZillowDataOnAddress: false,
      searchHistory: [],
      submitSuccess: false,
      initialFormValues: {},
      formValuesLoaded: false,
    };
    this.addressInputValue = '';
  }

  componentDidMount() {
    this.handleWindowWidthChanged();
    this.hydrateDataFromLocalStorage();
  }

  componentDidUpdate( prevProps, prevState ) {
    const stateChanged = (this.state !== prevState);
    if ( stateChanged ) {
      // save state to localStorage
      const savedState = this.state;
      localStorage.setItem('state', JSON.stringify(savedState) );
    }
  }

  handleWindowWidthChanged = () => {
    let windowWidth = getWindowWidth();
    window.addEventListener('resize', () => {
      const nextWindowWidth = getWindowWidth();
      const windowWidthChanged = ( windowWidthIsMobile(nextWindowWidth) !== windowWidthIsMobile(windowWidth) );
      if ( windowWidthChanged ) {
        this.setState({
          isMobile: windowWidthIsMobile(nextWindowWidth),
        });
      }
      windowWidth = nextWindowWidth;
    });
  }

  hydrateDataFromLocalStorage = () => {
    const localStateData = localStorage.getItem('state');
    let localStateParsed = null;
    const localFormData = localStorage.getItem('formValues');
    let localFormDataParsed = null;
    if ( localStateData ) {
      try {
        localStateParsed = JSON.parse(localStateData);
      }
      catch ( e ) {
        // IGNORE EXCEPTION
      }
    }
    if ( localFormData ) {
      try {
        localFormDataParsed = JSON.parse(localFormData);
      }
      catch ( e ) {
        // IGNORE EXCEPTION
      }
    }
    let updatedState = {};
    if ( localStateParsed ) {
      updatedState = localStateParsed;
    }
    if ( localFormDataParsed ) {
      updatedState.initialFormValues = localFormDataParsed;
    }
    updatedState.formValuesLoaded = true;
    this.setState(updatedState);
  }

  updateProgress = ( formState ) => {
    const {
      autoCompleteSelected,
      suggestedMonthlyRent,
      submitSuccess,
    } = this.state;

    const emailValid = !!(formState.values.email) && !formState.errors.email;
    const phoneValid = !!(formState.values.phone) && !formState.errors.phone;
    const basicInfoValid = (emailValid && phoneValid);
    const actualMonthlyRentValid = !!(autoCompleteSelected && formState.values.actual_monthly_rent);

    let newProgressStep = 1;
    if ( basicInfoValid ) {
      newProgressStep = 2;
    }
    if ( basicInfoValid && suggestedMonthlyRent ) {
      newProgressStep = 3;
    }
    if ( basicInfoValid && suggestedMonthlyRent && actualMonthlyRentValid ) {
      newProgressStep = 4;
    }
    if ( submitSuccess ) {
      newProgressStep = 5;
    }

    const progressStateChanged = (newProgressStep !== this.state.progressStep);
    if ( progressStateChanged ) {
      this.setState({
        progressStep: newProgressStep,
      });
    }
  }

  onFormStateChange = ( formState ) => {
    this.saveFormValuesToLocalStorage(formState.values);
    this.updateProgress( formState );
  }

  onSubmit = async ( values ) => {
    const apiValues = {
      ...values,
      address: this.state.autoCompleteAddress,
    };
    const response = await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(apiValues),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    alert( 'Submit success! Thank you for signing up.' );

    this.setState({
      progressStep: 5,
      submitSuccess: true,
    });
  }

  fetchZillowData = async (address) => {
    // naive parsing strategy
    const [ street, city, state_zip ] = address.split(',').map((item) => ( item.trim() ));
    const [ state ] = state_zip.split(' ');

    const qs = queryString.stringify({
      address: street,
      citystatezip: `${city}, ${state}`,
    });
    this.setState({
      apiLoading: true,
      noZillowDataOnAddress: false,
      suggestedMonthlyRent: null,
    });
    const response = await fetch('/property-data?' + qs);
    const responseData = await response.json();
    const updatedState = {
      apiLoading: false,
    };
    let suggestedMonthlyRent = null;
    if ( !responseData.data ) {
      updatedState.noZillowDataOnAddress = true;
      updatedState.suggestedMonthlyRent = null;
      updatedState.progressStep = 2;
    }
    else if ( responseData.data.monthlyRent ) {
      suggestedMonthlyRent = responseData.data.monthlyRent;
    }
    else if ( responseData.data.totalPrice ) {
      const computedMonthlyRent = responseData.data.totalPrice * 0.05;
      suggestedMonthlyRent = parseFloat(computedMonthlyRent.toFixed(2));
    }
    if ( suggestedMonthlyRent ) {
      const suggestedMonthlyRentNum = parseInt(suggestedMonthlyRent, 10);
      updatedState.noZillowDataOnAddress = false;
      updatedState.suggestedMonthlyRent = suggestedMonthlyRentNum;
      updatedState.searchHistory = [
        ...this.state.searchHistory,
        [ street, suggestedMonthlyRentNum ],
      ];
      updatedState.progressStep = 3;
    }
    else {
      updatedState.noZillowDataOnAddress = true;
      updatedState.suggestedMonthlyRent = null;
      updatedState.progressStep = 2;
    }
    this.setState( updatedState );
  }

  onAutoCompleteSelect = (address /* , placeId */) => {
    this.setState({
      autoCompleteAddress: address,
      autoCompleteSelected: true,
    });
    this.fetchZillowData(address);
  }

  onAutoCompleteChange = ( address ) => {
    this.setState({
      autoCompleteAddress: address,
      autoCompleteSelected: false,
      progressStep: 2,
    });
  }

  onAddressBlur = () => {
    this.setState({
      addressTouched: true,
    });
  }

  saveFormValuesToLocalStorage = ( formValues ) => {
    if ( !this.state.formValuesLoaded ) {
      return;
    }
    localStorage.setItem('formValues', JSON.stringify(formValues));
  }

  render() {
    const {
      isMobile,
      progressStep,
      autoCompleteAddress,
      addressTouched,
      autoCompleteSelected,
      apiLoading,
      noZillowDataOnAddress,
      suggestedMonthlyRent,
      searchHistory,
      initialFormValues,
    } = this.state;
    return (
      <div className={styles.home}>
        { !isMobile &&
          (
            <div className={styles.fourSquare} >
              <div className={classnames(styles.fourSquare__item, styles._1)} >
                <Instructions />
              </div>
              <div className={classnames(styles.fourSquare__item, styles._2)} >
                <SearchedProperties searchHistory={searchHistory} />
              </div>
              <div className={classnames(styles.fourSquare__item, styles._3)} >
                <SignupForm
                  onSubmit={ this.onSubmit }
                  onFormStateChange={ this.onFormStateChange }
                  progressStep={ progressStep }
                  onAddressInputChange={ this.onAddressInputChange }
                  autoCompleteAddress={ autoCompleteAddress }
                  onAutoCompleteSelect={ this.onAutoCompleteSelect }
                  onAutoCompleteChange={ this.onAutoCompleteChange }
                  onAddressBlur={ this.onAddressBlur }
                  addressTouched={ addressTouched }
                  autoCompleteSelected={ autoCompleteSelected }
                  apiLoading={ apiLoading }
                  noZillowDataOnAddress={ noZillowDataOnAddress }
                  suggestedMonthlyRent={ suggestedMonthlyRent }
                  initialFormValues={ initialFormValues }
                />
              </div>
              <div className={classnames(styles.fourSquare__item, styles._4)} >
                <SignupFormProgress progressStep={progressStep} />
              </div>
            </div>
          )
        }
        { isMobile &&
          <div className={styles.fourSquare} >
            <div className={styles.fourSquare__item__mobile} >
              <SignupFormProgress progressStep={progressStep} />
            </div>
            <div className={styles.fourSquare__item__mobile} >
              <SignupForm
                onSubmit={ this.onSubmit }
                onFormStateChange={ this.onFormStateChange }
                progressStep={ progressStep }
                onAddressInputChange={ this.onAddressInputChange }
                autoCompleteAddress={ autoCompleteAddress }
                onAutoCompleteSelect={ this.onAutoCompleteSelect }
                onAutoCompleteChange={ this.onAutoCompleteChange }
                onAddressBlur={ this.onAddressBlur }
                addressTouched={ addressTouched }
                autoCompleteSelected={ autoCompleteSelected }
                apiLoading={ apiLoading }
                noZillowDataOnAddress={ noZillowDataOnAddress }
                suggestedMonthlyRent={ suggestedMonthlyRent }
                initialFormValues={ initialFormValues }
              />
            </div>
            <div className={styles.fourSquare__item__mobile} >
              <SearchedProperties searchHistory={searchHistory} />
            </div>
            <div className={styles.fourSquare__item__mobile} >
              <Instructions />
            </div>
          </div>
        }
      </div>
    );
  }
}

// compose
export default compose(
  hot(module),
)(HomePage);
