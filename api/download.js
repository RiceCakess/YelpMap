var axios = require('axios').default;
var yelp_api = "https://api.yelp.com/v3/businesses/search";
var api_key = require('./config').YELP_API_KEY;

//console.log(api_key);

console.log(YelpMatch({
    lat:37.7598202, 
    lng:-122.4522538,
    rad: 1500
}));
function YelpMatch(loc) {
  var query = {
        latitude: loc.lat, 
        longitude: loc.lon, 
        radius: loc.rad,
        categories: "restaurants",
        limit: 50,
        offset: 0,
        sort_by: "review_count"
  };
  axios.get(yelp_api, {
    params: query,
    headers: {"Authorization": "Bearer " + api_key}
  }).then((res)=>{
    console.log(JSON.stringify(res.data));
    return res.data;
  }).catch((err) =>{
    console.log(JSON.stringify(err));
  });
}