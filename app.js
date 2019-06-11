const express = require('express');
const app = express();
const path = require('path')
const fetch = require('node-fetch');
const csvjson = require('csvjson');
const readFile = require('fs').readFile;
const {
  convertCSVToArray
} = require('convert-csv-to-array');
const converter = require('convert-csv-to-array');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

var dataAll = [];
var count;
var products = [];
var pages;
limit = 250;


var productsCVS;

readFile('./proepta-loader_metafields_10Junio2019.csv', 'utf-8', (err, fileContent) => {
  if (err) {
    console.log(err); // Do something to handle the error or just throw it
    throw new Error(err);
  }
  productsCVS = convertCSVToArray(fileContent, {
    type: 'array',
    separator: ',', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
  });
});


// app.get('/', function (req, res) {
//   res.render('home')
// })

// app.listen(3200, function () {
//   console.log('up and running on 3200');

// });


// async function getCount() {
//   let response = await fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/products/count.json');
//   let data = await response.json()
//   return data;
// }

// async function getProducts(count, pages) {
//   let response = await fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/products.json?limit=' + limit + '&page=' + i + '?fields=id,handle');
//   let data = await response.json();
//   return data;
// }

// getCount().then(data => {
//   count = parseInt(data.count);
//   pages = Math.ceil(count / 250.0);
//   for (i = 1; i <= pages; i++) {
//     getProducts().then(data => {

//       data.products.forEach(product => {
//                               products.push(product);

//                              });
//     })

//   }
//   console.log('-------')
//   console.log(products.length)
// }); 

fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/products/count.json')
  .then((response) => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }

    // Examine the text in the response
    response.json()
      .then(function (data) {
        count = parseInt(data.count);
        pages = Math.ceil(count / 250.0)
        for (i = 1; i <= pages; i++) {
          fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/products.json?limit=' + limit + '&page=' + i + '?fields=id,sku')
            .then((response) => {
              if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                  response.status);
                return;
              }

              // Examine the text in the response
              response.json()
                .then(function (data) {
                  data.products.forEach(product => {
                    products.push(product);
                  });
                  if (products.length == count) {
                    let h = 0;
                    for (let k = 0; k < productsCVS.length; k++) {
                      for (let j = 0; j < products.length; j++) {
                        products[j].variants.forEach((variant) => {
                          if (productsCVS[k][3] == variant.sku) {
                            setInterval(()=>{
                              let Url = 'https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com//admin/api/2019-04/products/' + products[j].id + '/metafields.json';
                              let data = JSON.stringify({
                                "metafield": {
                                  "namespace": "informacion_linea",
                                  "key": "texto",
                                  "value": productsCVS[k][7],
                                  "value_type": "string"
                                }
                              });
  
                              let params = {
                                headers: {
                                  "Content-Type": "application/json; charset=utf-8"
                                },
                                method: 'POST',
                                body: data
                              };
  
                              fetch(Url, params)
                                .then(function (data) {
                                  console.log('Data created', data);
                                })
                                .catch(function (error) {
                                  console.log('Request failed', error);
                                });
                            }, 500)
                        

                          }
                        })
                      }
                    }

                  }

                });
            })
            .catch(function (err) {
              console.log('Fetch Error :-S', err);
            });
        }




      });
  })





fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com//admin/api/2019-04/products/3805698359360/metafields.json', {
    method: 'post',
    headers: {
      "Content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({

      "metafield": {
        "namespace": "microondas",
        "key": "si",
        "value": "Se puede meter al micro",
        "value_type": "string"
      }
    })
  })
  .then(function (data) {
    console.log('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });







// fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/orders.json')
//   .then(response => response.json())
//   .then(data => console.log(data))