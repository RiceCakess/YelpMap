var express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors");

var API_PORT = process.env.PORT || 3001;
var app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('json spaces', 2); //prettify

app.use('/api', router);
router.use('/search',require("./search"));

app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });


var server = app.listen( API_PORT , function(){
    console.log('Listening on port ' + server.address().port);
});
