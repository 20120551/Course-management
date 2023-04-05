const {SearchController} = require('./../controller');

function searchApi(app, conn){
    try {
        const searchController = new SearchController(conn);
        // /search?q=...
        app.post('/search', searchController.searchData);
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = searchApi;