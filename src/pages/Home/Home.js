import React, { Component } from 'react';
import classnames from 'classnames';
import queryString from 'querystring';
import { hot } from 'react-hot-loader';

import styles from './Home.scss';

import Instructions from 'components/Instructions/Instructions';
import SignupFormProgress from 'components/SignupFormProgress/SignupFormProgress';
import SignupForm from 'components/SignupForm/SignupForm';
import SearchedProperties from 'components/SearchedProperties/SearchedProperties';
import {
  getWindowWidth,
  windowWidthIsMobile,
  currentWindowWidthIsMobile,
} from 'helpers/browser';


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
    await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(apiValues),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    alert( 'Submit success! Thank you for signing up.' ); // eslint-disable-line no-alert

    this.setState({
      progressStep: 5,
      submitSuccess: true,
    });
  }

  fetchZillowData = async (address) => {
    // naive parsing strategy
    const [ street, city, stateZip ] = address.split(',').map((item) => ( item.trim() ));
    const [ state ] = stateZip.split(' ');

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

export default hot(module)(HomePage);
