const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT /*variable that stores a port value*/ || 3000 //If heroku doesn't provide a port, then use localhost (3000)

//Define path for Express config
const publicDirectoryPath = (path.join(__dirname, '../public')) //This way we set /public as static directory for our HTML files
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup hablebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', { //Name of the file created in templates folder. No need for the file extension
        title: 'Weather',
        name: 'Nico Gonzalez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Nico Gonzalez'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => { /*empty object is needed as default value in case error*/
        if (error) {
            return res.send({ error })
        }
        forecast(location, latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})
app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'This is a help message.',
        title: 'Help',
        name: 'Nico Gonzalez'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nico Gonzalez',
        errorMessage: 'Help article not found'
    })
})

//Our wildcards '*' MUST go last.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nico Gonzalez',
        errorMessage: 'Page not found'
    })
})


app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})