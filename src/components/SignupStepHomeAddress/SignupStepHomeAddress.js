import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from 'pages/Signup/Signup.scss';
import classnames from 'classnames';
import PlacesAutocomplete from 'react-places-autocomplete';


class SignupStepHomeAddress extends Component {
  static propTypes = {
    onSubmitBtnClick: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    fetchZillowData: PropTypes.func.isRequired,
    onAutoCompleteChange: PropTypes.func.isRequired,
    onAutoCompleteSelect: PropTypes.func.isRequired,
    autoCompleteAddress: PropTypes.string.isRequired,
    noZillowDataOnAddress: PropTypes.bool.isRequired,
    onAutocompleteXClick: PropTypes.func.isRequired,
    autoCompleteSelected: PropTypes.bool.isRequired,
  }

  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onSubmitBtnClick,
      isMobile,
      onAutoCompleteChange,
      onAutoCompleteSelect,
      autoCompleteAddress,
      noZillowDataOnAddress,
      onAutocompleteXClick,
      autoCompleteSelected,
    } = this.props;

    return (
      <div className={styles.signupStepHomeAddress} >
        <div style={{ paddingBottom: isMobile ? 10 : 121 }} ></div>
        <div className={styles.signupStepHomeAddress__inputWrap} >
          { autoCompleteAddress &&
            <img
              onClick={ onAutocompleteXClick }
              className={
                classnames(styles.signupStepHomeAddress__input__clearX, { [styles.mobile]: isMobile } )
              }
              src="/homeleads/FORM_02/input_color copy/ic_remove_normal@2x.svg"
            />
          }
          <PlacesAutocomplete
            value={ autoCompleteAddress }
            onChange={ onAutoCompleteChange }
            onSelect={ onAutoCompleteSelect }
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
                  type="text"
                  className={
                    classnames(styles.signupStepHomeAddress__input, { [styles.mobile]: isMobile } )
                  }
                  placeholder="Search for Address"
                />
                { noZillowDataOnAddress && autoCompleteAddress &&
                  <div style={{ color: 'red', fontSize: 16, paddingTop: 15 }} >
                    We could not find this address
                  </div>
                }
                <div className="autocomplete-dropdown-container">
                  {loading &&
                    <div className={
                      classnames(styles.suggestionItemText, {
                        [styles.mobile]: isMobile,
                      })
                    }>
                      Loading...
                    </div>
                  }
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
                        <span className={ classnames(styles.suggestionItemText, {
                          [styles.mobile]: isMobile,
                        }) } >
                          {suggestion.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div style={{ paddingBottom: 94 }} ></div>
        <button
          disabled={!autoCompleteSelected || noZillowDataOnAddress || !autoCompleteAddress}
          className={ classnames(styles.signupBtn, {
            [styles.mobile]: isMobile,
            [styles.disabled]: ( !autoCompleteSelected || noZillowDataOnAddress || !autoCompleteAddress ),
          }) }
          onClick={onSubmitBtnClick}
        >
          ESTIMATE RENT
        </button>
      </div>
    );
  }

}

export default SignupStepHomeAddress;
