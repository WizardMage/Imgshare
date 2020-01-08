const express = require('express');
const config = require('./server/config');
const app = config(express());

//Database
require('./database');

//Server Starting
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
});