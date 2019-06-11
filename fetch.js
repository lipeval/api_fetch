
// fetch('https://92a9faaa4a47e1c76da0875efd8ada54:f7aaf552f68cdaf546b61211065080d3@proepta.myshopify.com/admin/api/2019-04/products/3805698359360/metafields.json', {
//     headers: { "Content-Type": "application/json; charset=utf-8" },
//     method: 'POST',
//     body: JSON.stringify({
        
//             "metafield": {
//               "namespace": "microondas",
//               "key": "si",
//               "value": "Se puede meter al micro",
//               "value_type": "string"
//             }
//   })
// });


count = GET /admin/products/count.json
page_size = 250

pages = ceiling(count / 250.0)

current_page = 1
products = []

while(current_page <= pages)
  products += GET /admin/products.json?limit=250&page=current_page
  current_page += 1

Do things with your products



