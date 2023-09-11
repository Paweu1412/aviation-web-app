export const checkIcaoCodeSyntaxValidity = (icao) => {
  if (icao.length !== 4) {
    return false;
  }

  const regex = /^[a-zA-Z]+$/;
  return regex.test(icao);
}