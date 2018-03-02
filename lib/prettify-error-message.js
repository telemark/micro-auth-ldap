module.exports = error => {
  let msg = 'Ukjent feil'

  if (/525/.test(error)) {
    msg = 'Ugyldig brukernavn eller passord'
  }

  if (/52e/.test(error)) {
    msg = 'Ugyldig brukernavn eller passord'
  }

  if (/530/.test(error)) {
    msg = 'Du får ikke logge inn på dette tidspunktet'
  }

  if (/531/.test(error)) {
    msg = 'Du får ikke logge inn fra denne enheten'
  }

  if (/532/.test(error)) {
    msg = 'Passordet har utløpt'
  }

  if (/533/.test(error)) {
    msg = 'Brukerkontoen er sperret'
  }

  if (/701/.test(error)) {
    msg = 'Brukerkontoen har utløpt'
  }

  if (/773/.test(error)) {
    msg = 'Passordet må nullstilles'
  }

  if (/775/.test(error)) {
    msg = 'Brukerkontoen er låst'
  }

  return msg
}
