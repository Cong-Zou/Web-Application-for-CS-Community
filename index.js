var express = require('express');
const cors =  require('cors');
var path = require('path');
//var app = express();
var app = require('app')
const port = process.env.PORT || 3100;
var server = app.listen(port, () => console.log(`Listening on ${ port }`));
