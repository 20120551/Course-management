const express = require('express');
const { PORT } = require('./config');
const expressApp = require('./express-app');


(async()=>{
    //init app
    const app = express();
    
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