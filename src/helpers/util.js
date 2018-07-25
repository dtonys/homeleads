export const getRentRange = ( suggestedMonthlyRent ) => { // eslint-disable-line
  return [
    suggestedMonthlyRent ? suggestedMonthlyRent - ( suggestedMonthlyRent * 0.1 ) : '',
    suggestedMonthlyRent ? suggestedMonthlyRent + ( suggestedMonthlyRent * 0.1 ) : '',
  ];
};