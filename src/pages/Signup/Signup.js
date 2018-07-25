import React, { Component } from 'react';
import classnames from 'classnames';
import queryString from 'querystring';
import SignupStepBasicInfo from 'components/SignupStepBasicInfo/SignupStepBasicInfo';
import SignupStepHomeAddress from 'components/SignupStepHomeAddress/SignupStepHomeAddress';
import SignupNavbar from 'components/SignupNavbar/SignupNavbar';
import SignupStepRentPrice from 'components/SignupStepRentPrice/SignupStepRentPrice';

import { hot } from 'react-hot-loader';
import styles from './Signup.scss';

import {
  getWindowWidth,
  windowWidthIsMobile,
  currentWindowWidthIsMobile,
} from 'helpers/browser';


const FLOW_STEP_MIN = 1;
const FLOW_STEP_MAX = 3;
class SignupPage extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      isMobile: currentWindowWidthIsMobile(),

      flowStep: 1,

      // basic info form state
      formValues: {},

      // enter address state
      autoCompleteAddress: '',
      autoCompleteSelected: false,
      suggestedMonthlyRent: null,
      noZillowDataOnAddress: false,

      formValuesLoaded: false,
    };
    this.addressInputValue = '';
  }

  componentDidMount() {
    this.handleWindowWidthChanged();
  }

  prevStep = () => {
    const { flowStep } = this.state;
    if ( flowStep > FLOW_STEP_MIN ) {
      this.setState({
        flowStep: flowStep - 1,
      });
    }
  }

  nextStep = () => {
    const { flowStep } = this.state;
    if ( flowStep < FLOW_STEP_MAX ) {
      this.setState({
        flowStep: flowStep + 1,
      });
    }
  }

  onSubmitStep1 = async ( values ) => {
    const { flowStep } = this.state;
    this.setState({
      formValues: values,
      flowStep: flowStep + 1,
    });
  }

  finalSubmit = async ( preferredRent ) => {
    const {
      autoCompleteAddress,
      formValues,
    } = this.state;

    const apiValues = {
      ...formValues,
      address: autoCompleteAddress,
      actual_monthly_rent: preferredRent,
    };
    await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(apiValues),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    alert( 'Submit success! Thank you for signing up.' ); // eslint-disable-line no-alert
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

  fetchZillowData = async (address) => {
    // naive parsing strategy
    const [ street, city, stateZip ] = address.split(',').map((item) => ( item.trim() ));
    const [ state ] = stateZip.split(' ');

    const qs = queryString.stringify({
      address: street,
      citystatezip: `${city}, ${state}`,
    });
    this.setState({
      autoCompleteAddress: address,
      noZillowDataOnAddress: false,
      suggestedMonthlyRent: null,
    });
    const response = await fetch('/property-data?' + qs);
    const responseData = await response.json();
    const updatedState = {};
    let suggestedMonthlyRent = null;
    if ( !responseData.data ) {
      updatedState.noZillowDataOnAddress = true;
      updatedState.suggestedMonthlyRent = null;
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
    }
    else {
      updatedState.noZillowDataOnAddress = true;
      updatedState.suggestedMonthlyRent = null;
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
      noZillowDataOnAddress: false,
    });
  }

  onAutocompleteXClick = () => {
    this.setState({
      autoCompleteAddress: '',
    });
  }

  saveFormValuesToLocalStorage = ( formValues ) => {
    if ( !this.state.formValuesLoaded ) {
      return;
    }
    localStorage.setItem('formValues', JSON.stringify(formValues));
  }

  getNavTitle = () => {
    const { flowStep } = this.state;
    if ( flowStep === 1 ) {
      return 'Sign Up';
    }
    if ( flowStep === 2 ) {
      return 'Home Address';
    }
    if ( flowStep === 3 ) {
      return 'Success';
    }
    return 'Sign Up';
  };

  render() {
    const {
      isMobile,
      autoCompleteAddress,
      noZillowDataOnAddress,
      autoCompleteSelected,
      suggestedMonthlyRent,
      flowStep,
    } = this.state;

    return (
      <div>
        <SignupNavbar
          label={ this.getNavTitle() }
          flowStep={flowStep}
          isMobile={isMobile}
          onBackBtnPress={this.prevStep}
        />
        <div className={classnames(styles.signup, { [styles.mobile]: isMobile }) }>
          { flowStep === 1 &&
            <SignupStepBasicInfo
              isMobile={ isMobile }
              onSubmit={ this.onSubmitStep1 }
              flowStep={ flowStep }
            />
          }
          { flowStep === 2 &&
            <div>
              <SignupStepHomeAddress
                isMobile={ isMobile }
                onSubmitBtnClick={ this.nextStep }
                fetchZillowData={ this.fetchZillowData }
                onAutoCompleteChange={this.onAutoCompleteChange}
                onAutoCompleteSelect={this.onAutoCompleteSelect}
                onAutocompleteXClick={ this.onAutocompleteXClick }
                autoCompleteSelected={ autoCompleteSelected }
                autoCompleteAddress={ autoCompleteAddress }
                noZillowDataOnAddress={ noZillowDataOnAddress }
              />
            </div>
          }
          { flowStep === 3 &&
            <div>
              <SignupStepRentPrice
                isMobile={ isMobile }
                onSubmitBtnClick={ this.finalSubmit }
                suggestedMonthlyRent={ suggestedMonthlyRent }
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default hot(module)(SignupPage);
