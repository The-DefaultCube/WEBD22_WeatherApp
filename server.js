const API_KEY = "d8507594be590ae4530aabcdbffb9459"
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, function() {
    console.log("Server running at port 3000");
})

//handles GET req
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html" || __dirname + "\\index.html");
})

//handles POST request
app.post("/again", function(req, res) {
    res.redirect("/");
})

app.post("/cityReq", function(req, res) {
    console.log(req.body);
    let my_query = req.body.cityName;
    let my_url = "https://api.openweathermap.org/data/2.5/weather?q=" + my_query + "&appid=" + API_KEY + "&units=metric";
    https.get(my_url, function(response) {
        // console.log("status: "+response.statusCode);
        response.on("data", function(d) {
            const weatherData = JSON.parse(d);
            // console.log(weatherData);
            // const weatherDataStr = JSON.stringify(weatherData);
            // console.log(weatherDataStr);
            if (weatherData.cod === 200) {
                let temperature = weatherData.main.temp;
                let weatherDesc = weatherData.weather[0].main;
                let iconUrl = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@4x.png";
                res.write("<h1>The Temperature is " + temperature + " deg. Celcius.</h1>");
                res.write("<h2>The Weather of <em>" + my_query + "</em> is currently : " + weatherDesc + ".</h2>");
                res.write("<img src=" + iconUrl + " alt='weather icon'>");
                res.send();
            } else {
                res.write("<h1>Sorry!!!</h1>");
                res.write("<h3>" + my_query + " is not a valid city name.</h3>");
                res.write('<form action="/again" method="post"><button type = "submit">Try Again</button></form>');
                res.send();
            }
        })
    })
})