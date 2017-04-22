const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var port = process.env.PORT || 3000;
var app = express();

var underMaintenance = false;

app.use((req, res, next) => {
    if (underMaintenance) {
        res.render('maint.hbs', {
            pageTitle: 'Home Page',
            welcomeMessage: 'Welcoming to Netting the Grade!'
        });
    } else {
        next();
    }
});

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('failed to write to server.log');
        }
    });
    next();
});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcoming to Netting the Grade!'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Request failed',
        errorCode: 400
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.listen(port, () => {
    var dt = new Date;
    console.log(dt.toString(),
        'server is up and listeniing on port', port);
});