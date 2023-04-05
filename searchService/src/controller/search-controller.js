const {searchService} = require('./../service');
const {status} = require('./../constant');

class SearchController {
    constructor(conn) {
        this.conn = conn;
    }

    searchData = async(req, res)=>{
        try {
            const query = req.query.q;
            const {result} = await searchService.searchData(query);
            res.status(status.OK).json(result);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = SearchController;