var http = require('http');
var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
var request=require("request");


app.listen(port);


//eg:-> Input:-http://localhost:3000/list?q=asia

app.get('/list', function (req, res) {
    if(!req.query.q){
         res.status(200).send("parameter not found");
         return;
    }
    var newObj=getCountriesList(req.query.q);
    newObj
      .then(function (fulfilled) {
        res.status(200).send(fulfilled);
      })
      .catch(function (reject) {
         res.status(400).send(reject);
      });
})

// metehod to get countries list name
function getCountriesList(q) {
    var options={};
    options.method='GET';
    options.url="https://restcountries.eu/rest/v2/region/"+ q;
    return new Promise(function (fulfill, reject) {
     request(options, function (error, response, body) {
        var countryArr=[];
        if (!error && response.statusCode === 200) {
             var data = JSON.parse(body);
            for (let i=0;i<data.length; i++) {
               if (data[i].hasOwnProperty("name")) {
                        countryArr.push(data[i]["name"]); 
                }
            }
        } else {
            reject(error);
        }
        fulfill(countryArr);
      });
     });
}

// eg:-> Input :- http://localhost:3000/list/asia/sort

app.get('/list/:country/sort', function (req, res) {
    // metehod to get countries list name
    var newObj=getCountriesList(req.params.country,true);
    newObj
      .then(function (fulfilled) {
         var arrList=[];
        var arr=fulfilled;
        // Iterate countries name to find population
         for(let i=0;i<arr.length;i++){
            var options={};
            options.method='GET';
           var promiseArr= new Promise((resolve, reject) => {
               // country detail Api
                options.url="https://restcountries.eu/rest/v2/name/"+ arr[i];
                request(options, function (error, response, body) {
                    var countryArr=[];
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);
                        if (data[0].hasOwnProperty("name")) {
                            countryArr.push({"name":data[0]["name"],"population":data[0]["population"]}); 
                        }
                    }
                    else {
                        reject(error);
                    }
                    resolve(countryArr);
                });
        });    
        // Added array of countries promises
        arrList.push(promiseArr);
         }
        Promise.all(arrList).then(values => { 
            var newArr=[]
            // sort Array by population
            values.sort(function(a, b) {
                return (a[0].population)-(b[0].population);
            });
            // extract name key from Json object
            for (let i=0;i<values.length; i++) {
               if (values[i][0].hasOwnProperty("name")) {
                        newArr.push(values[i][0]["name"]); 
                }
            }
            res.status(200).send(newArr)
        });
      })
      .catch(function (reject) {
         res.status(400).send(reject);
      });
})