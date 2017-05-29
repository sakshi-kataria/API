var http = require('http');
var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
var request=require("request");


app.listen(port);


app.get('/list', function (req, res) {
    console.log("id",req.query.q)
    var newObj=getCountriesList(req.query.q);
    newObj
      .then(function (fulfilled) {
        res.status(200).send(fulfilled);
      })
      .catch(function (reject) {
         res.status(400).send(reject);
      });
})


function getCountriesList(q) {
    var options={};
    options.method='GET';
    options.url="https://restcountries.eu/rest/v2/region/"+ q;
    return new Promise(function (fulfill, reject) {
     request(options, function (error, response, body) {
        var countryArr=[];
        if (!error && response.statusCode === 200) {
             var data = JSON.parse(body);
//            if(sort){
//                data.sort(function(a, b) {
//                    return (a.population)-(b.population);
//                });
//            }
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
var arrList=[];
app.get('/list/:country/sort', function (req, res) {
    var newObj=getCountriesList(req.params.country,true);
    newObj
      .then(function (fulfilled) {
        var arr=fulfilled;
       // console.log('arr',arr)
        for(let i=0;i<arr.length;i++){
            var options={};
            options.method='GET';
            options.url="https://restcountries.eu/rest/v2/name/"+ arr[i];
            let a=new Promise((resolve, reject) => { 
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
                })
//            consol.log(a);
            arrList.push[a]
        }
        console.log(arrList);
        Promise.all(arrList).then(values => { 
            console.log('test',values); // [3, 1337, "foo"] 
        });
//        res.status(200).send(fulfilled);
      })
      .catch(function (reject) {
         res.status(400).send(reject);
      });
})