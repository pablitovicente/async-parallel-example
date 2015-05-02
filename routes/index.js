var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');

// helper function to get the weather details from openweathermap
function getWeather( city,country,asyncsCallback){
  request('http://api.openweathermap.org/data/2.5/weather?q='+city+','+country, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      var celcius = body.main.temp -  273.15;
      celcius = celcius.toFixed(2);
      var response = {};
      response.celcius = celcius;
      response.city = body.name;
      asyncsCallback( null, response );
    }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // Call Async Parallel, it takes an object or array of function to execute in parallel as first argument
  // and the second argument is the function that gets executed once all parallel tasks are done
  async.parallel({
    BuenosAires: function(callback) {
      getWeather('Buenos Aires','ar', callback);
    },
    Washington: function(callback) {
      getWeather('Washington','us', callback);
    },
    London: function(callback) {
      getWeather('London','uk', callback);
    },
    Paris: function(callback) {
    getWeather('Paris','fr', callback);
  }
  }, function(err, results) {
    res.send(results);
  });
});

module.exports = router;
