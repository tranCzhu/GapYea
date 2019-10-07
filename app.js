var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");
app.use(express.static("assets"));

app.get("/", function(req, res) {
    res.render("search");
});

// v0.6 as of 10/06/19
// Updates:
// 1. refined ui for home/search page, Why GapYea page, and Contact page
// 2. implementing better ui for search results in process
// 3. adopted alternating background images from unsplash
// 4. fixed error when only 1 result is available, redirects to city page for the result
// TODOs for v0.7:
// 1. badges for unsplash background images and location tags
// 2. refined ui for search results and city page
// 3. enable search beyond country name
// 4. implementation of more city page functions

// deployment will work if API key is inserted

// Search (v0.6 only supports search of a country)
app.get("/results", function(req, res) {
    // req.query not req.body
    var keyword = req.query.keyword;
    console.log(keyword);
    // use RESTCountries API: https://restcountries.eu/
    var url = "https://restcountries.eu/rest/v2/name/" + keyword;
    request(url, function(error, response, body) {
        if (!error && res.statusCode == 200) {
            var parsedData = JSON.parse(body);
            console.log(parsedData.length);
            if (parsedData.length == 1) {
                var cityPage = "/r/" + parsedData[0]["capital"];
                res.redirect(cityPage);
            }
            else if (parsedData.length > 1) {
                res.render("results", {data: parsedData});
            }
            else {
                res.send("something went wrong, {$error}");
            }
        }
        else {
            res.send("something went wrong, {$error}");
        }
    });
});

app.get("/r/:city", function(req, res) {
    var city = req.params.city;
    var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + req.params.city + "&key=";
    request(url, function(error, response, body) {
        if (!error && res.statusCode == 200) {
            var cityData = JSON.parse(body).results[0];
            // TODO: capitalize first letter of the city before pass it to ejs
            res.render("city.ejs", {city: city, cityData: cityData});
        } 
        else {
            res.send("something went wrong, {$error}");
        }
    });
});

app.get("/why", function(req, res) {
    res.render("why.ejs");
});

app.get("/contact", function(req, res) {
    res.render("contact.ejs");
});

// search autocomplete thru google api: https://developers.google.com/places/web-service/autocomplete

// Explore by continent
app.get("/continents", function(req, res) {
    var continents = [
        {name: "North America", image: "/imgs/banter-snaps-gdQnsMbhkUs-unsplash.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@bantersnaps?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Banter Snaps"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Banter Snaps</span></a>
        {name: "South America", image: "/imgs/raphael-nogueira-JMYBetGDIKY-unsplash.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@phaelnogueira?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Raphael Nogueira"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Raphael Nogueira</span></a>
        {name: "Europe", image: "/imgs/anthony-delanoix-aDxmYZtYj7g-unsplash.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@anthonydelanoix?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Anthony DELANOIX"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Anthony DELANOIX</span></a>
        {name: "Africa", image: "/imgs/annie-spratt-SPS796v4KmM-unsplash.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@anniespratt?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Annie Spratt"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Annie Spratt</span></a>
        {name: "Asia", image: "/imgs/Asia.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@trapnation?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Andre Benz"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Andre Benz</span></a>
        {name: "Australia", image: "/imgs/jamie-davies-Hao52Fu9-F8-unsplash.jpg"},
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@jamie_davies?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Jamie Davies"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Jamie Davies</span></a>
        {name: "Antarctica", image: "/imgs/torsten-dederichs-MXcYsZU6e74-unsplash.jpg"}
        // <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@tdederichs?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Torsten Dederichs"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Torsten Dederichs</span></a>
    ];
    res.render("continents.ejs", {continents: continents});
});

// Explore by country thru continent entry
app.get(":continent/countries", function(req, res) {
    var countries = [];
    // different countries based on different continent
    res.render("continents.ejs", {continents: continents});
});

// Explore by city, list out experiences

// Allow entry of experiences for city exploration

// use filter: explore by parts of city

// Allow entry of experiences for parts of city exploration


app.listen(3000, function() {
    console.log("The server is set up...");
});