const fs = require('fs')

module.exports = data => {
  if (!data.origin) {
    throw new Error('Missing required input: origin')
  }
  const error = data.error ? `<br/><br/>${data.error}<br/><br/>` : ''
  let html = fs.readFileSync('lib/login.html', 'utf-8')
  html = html.replace('{{origin}}', data.origin)
  html = html.replace('{{nextPath}}', data.nextPath || '')
  html = html.replace('{{error}}', error)
  return html
}
