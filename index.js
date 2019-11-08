var express = require('express');
const cors =  require('cors');
var path = require('path');
var app = express();
const port = process.env.PORT || 3100;
var server = app.listen(port, () => console.log(`Listening on ${ port }`));
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use('/node_modules',express.static('node_modules'));
app.get('/index', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'Frontend', 'index.html'));
});