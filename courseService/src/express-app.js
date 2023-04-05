const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {connectDatabase} = require('./database');
const {connectRabbitMQ} = require('./lib');
const {courseApi, eventApi} = require('./api');

module.exports = async(app)=>{
    //config req.body
    app.use(express.json({limit: '1mb'}));
    app.use(express.urlencoded({extended: true, limit: '1mb'}));

    //config header
    app.use(cors());

    //config cookie parser
    app.use(cookieParser());
    
    //config static file
    app.use(express.static(__dirname+'/public'));

    //rabbit mq connection
    const conn = await connectRabbitMQ();
    //database connection
    await connectDatabase();

    //config api;
    courseApi(app, conn);
    eventApi(app, conn);
}