var router = require('express').Router();
var axios = require('axios').default;
var yelp_api = "https://api.yelp.com/v3/businesses/search";
var api_key = require('./config').YELP_API_KEY;
const fs = require('fs');

const config = require("./config");

var mysql = require('mysql');

router.get('/', async (req, res) => {
    conn = mysql.createConnection(config.mysql);
    conn.connect((err) =>{
        if(err){
            next(e);
        }
    });
    const { latitude, longitude, radius, categories } = req.query;

    if(typeof loc === undefined || typeof rad === undefined)
        res.status(400).json({error: "missing coordinates or radius"});
    try{
        await YelpSearch({
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius,
            "categories": categories
        },conn);
    }
    catch(e){
        next(e);
    }
    await close(conn);
    res.json({status: "complete"});
});
async function YelpSearch(query) {
    let id = 0;
    let errored = false;
    await queryDB("INSERT INTO yelpmap (query, status) VALUES (?,?)", [JSON.stringify(query), 0]).then(res =>{
        id = res.insertId;
    });
    let listings = {total: 0, businesses: []};
    let reachedEnd = false;
    let currentOffset = 0;
    console.log(query);
    if(query.cat === null)
        query.cat = "restaurants";
    try{
        while(!reachedEnd){
            var q = {
                latitude: query.latitude, 
                longitude: query.longitude,
                radius: query.radius,
                categories:  query.categories,
                limit: 50,
                offset: currentOffset,
                sort_by: "review_count"
            };
            await axios.get(yelp_api, {
                params: q,
                headers: {"Authorization": "Bearer " + api_key}
            }).then((res)=>{
                listings.total = res.data.total;
                listings.businesses = listings.businesses.concat(res.data.businesses);
                console.log(res.data.total + " " + listings.businesses.length);
                if(currentOffset > res.data.total || currentOffset + 50 > 1000)
                    reachedEnd = true;
                else
                    currentOffset += 50;
            }).catch((err) =>{
                //console.log(err);
                console.log("Request failed");
                setFailed(id);
                reachedEnd = true;
                throw err;
            });
        }
    }
    catch(e){
        setFailed(id);
    }
    let fileName = Date.now() + ".csv";
    
    listings.businesses = listings.businesses.map((x) => {
        x.categories = x.categories.map( c => { return c.title; });
        return  {
            "id": x.id,
            "name": x.name,
            "url": x.url.split("?adjust_creative")[0],
            "review_count": x.review_count,
            "categories": x.categories.join(', '),
            "rating": x.rating,
            "price": x.price,
            "address": x.location.display_address.join(", "),
            "phone": x.display_phone
        };
    });
    await writeFile("./generatedFiles/" + fileName, arrayToCSV(listings.businesses)).catch((e)=>{setFailed(id);});
    await queryDB("UPDATE yelpmap SET status=?, filepath=? WHERE id=? AND status = 0", [1, fileName, id]);
    console.log("Save Complete");
}

function arrayToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
        return str;
       }, str);
}
function writeFile(path, str){
    return new Promise((resolve, reject) =>{
        fs.writeFile(path, str, (err)=> {
            if(err)
                reject(err);
            else
                resolve(path);
        });
    });
}

async function setFailed(id){
    await queryDB("UPDATE yelpmap SET status=2 WHERE id=?", id).catch((e)=>{console.log(e);});
}

function queryDB(sql, values){
    return new Promise((resolve,reject) =>{
        conn.query(sql, values, (error, results, fields)=>{
            if(error)
                reject(error);
            else
                resolve(results);
        });
    });
}

function close(conn){
    return new Promise((resolve, reject)=>{
        conn.end((err)=>{
            if(err)
                reject(err);
            else
                resolve();
        });
    });
}

module.exports = router;