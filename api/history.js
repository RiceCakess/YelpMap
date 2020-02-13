var router = require('express').Router();
router.get("/", (req,res,next)=>{
    res.json([
      {
        "coordinates": {lat:37.7598202, lng:-122.4522538},
        "radius": 1500,
        "id": 1
      },
      {
        "coordinates": {lat:37.78651448379856, lng: -122.41024045754449},
        "radius": 1800,
        "id": 2
      }
    ]);
  });

module.exports = router;