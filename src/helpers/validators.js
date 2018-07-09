function isEmpty(value) {
  return (value === undefined || value === null || value === '');
}

export function required( value ) {
  if ( isEmpty(value) ) {
    return 'Required field';
  }
  return undefined;
}

export function email(value) {
  // http://emailregex.com/
  const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (isEmpty(value) || !emailRE.test(value)) {
    return 'Invalid email';
  }
  return undefined;
}

export function truthy( value ) {
  if ( !value ) {
    return 'Must not be blank';
  }
  return undefined;
}

export function minLength(min, filterRegex) {
  return (value) => {
    if ( isEmpty(value) ) return value;
    let result = value;
    if ( filterRegex ) {
      result = result.replace(filterRegex, '');
    }
    if (result.length < min) {
      return `Must contain ${min} or more characters`;
    }
    return undefined;
  };
}

export function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Must contain ${max} or fewer characters`;
    }
    return undefined;
  };
}

export function exactLength(len, errorMessage) {
  return (value) => {
    if ( isEmpty(value) ) return value;
    let result = value;
    if (result.length !== len) {
      return errorMessage || `Must contain exactly ${len} characters`;
    }
    return undefined;
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be a whole number';
  }
  return undefined;
}

// Run one validator after another, return the first error found
export const composeValidators = (...validators) => (value) => {
  for ( let i = 0; i < validators.length; i++ ) {
    const error = validators[i](value);
    if ( error ) {
      return error;
    }
  }
  return undefined;
};
