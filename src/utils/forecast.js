const request = require('request')

const forecast = (address, latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=c072e825d4994166c0e645f2abd49fa8&query=' + encodeURIComponent(address) + '&query=' + latitude + ',' + longitude
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to forecast services!')
        } else if (body.success === 'false') {
            callback('Unable to find forecast information. Try another search.')
        } else {
            callback(undefined, (body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees out.'))
        }
    })
}

module.exports = forecast