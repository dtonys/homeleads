export function phone( value ) {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7) {
    return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 7)}`;
  }
  return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`;
}

export function number( value ) {
  if ( !value ) {
    return value;
  }

  return value.replace(/[^0-9]/g, '');
}

export function commify( value ) {
  if (!value) {
    return value;
  }

  return value.toString().replace(/\B(?=([0-9]{3})+(?![0-9]))/g, ',');
}
