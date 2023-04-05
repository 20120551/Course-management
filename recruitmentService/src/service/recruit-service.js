const { FormatData } = require('../utils');
const {recruitRepository} = require('./../database');

const recruitService = {
    getAllRecruits: async()=>{
        try {
            const recruits = await recruitRepository.getAllRecruit();
            return FormatData({recruits});
        } catch(err) {
            throw err;
        }
    },

    getRecruit: async(courseId)=>{
        try {
            const recruit = await recruitRepository.getRecruit(courseId);
            return FormatData({recruit});
        } catch(err) {
            throw err;
        }
    },

    getPersonalRecruits: async(teacherId)=>{
        try {
            const recruits = await recruitRepository.getPersonalRecruits(teacherId);
            return FormatData({recruits});
        } catch(err) {
            throw err;
        }
    },

    updateRecruit: async(payload, courseId)=>{
        try {
            await recruitRepository.updateRecruitment(payload, courseId);
        } catch(err) {
            throw err;
        }
    },

    requestAssistant: async(assistantInfo, courseId)=>{
        try {
            const recruit = await recruitRepository.requestAssistant(assistantInfo, courseId);
            return FormatData({recruit});
        } catch(err) {
            throw err;
        }
    },

    cancelAssistant: async(assistantId, courseId)=>{
        try {
            const recruit = await recruitRepository.cancelAssistant(assistantId, courseId);
            return FormatData({recruit});
        } catch(err) {
            throw err;
        }
    },
}

module.exports = recruitService;