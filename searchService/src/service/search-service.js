const {searchRepository} = require('./../database');
const {FormatData} = require('./../utils');

const searchService = {
    searchData: async(query)=>{
        try {
            const courses = await searchRepository.searchData(query);
            if(!courses) {
                return FormatData({result: 'not found!'})
            }
            return FormatData({result: courses});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = searchService;