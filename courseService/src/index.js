const express = require('express');
const { PORT } = require('./config');
const expressApp = require('./express-app');
//const { connect } = require('./database');

(async()=>{
    //init app
    const app = express();

    //connect to database
    //await connect();
    
    //config app
    await expressApp(app);

    //listen port
    app.listen(PORT, ()=>{
        console.log(`authentication service is listening in PORT ${PORT}`);
    })
    .on('error', (error)=>{
        console.log('error when connected: ', error);
        process.exit();
    })
})()