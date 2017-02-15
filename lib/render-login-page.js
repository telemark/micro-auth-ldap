'use strict'

module.exports = data => {
  const html = `<html><body><form action="/auth" method="POST" enctype="application/x-www-form-urlencoded">
<input type="hidden" name="redirectUrl" value="${data.origin}"/>
<input type="text" name="username" placeholder="Brukernavn">
<input type="password" name="password" placeholder="Passord">
<button type="submit">Logg inn</button>
</form></body></html>`

  return html
}
