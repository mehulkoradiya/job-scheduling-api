const { Router } = require('express');

const workerRouter = Router();

const workerController = require('../controllers/workerController');


/**
 * @typedef addWorker
 * @property {string} name
 * @property {string} email
 */
/**
 * @group Worker - Worker
 * For addWorker
 * @route POST /worker/addWorker
 * @param {addWorker.model} addWorker.body.required
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
workerRouter.post('/addWorker', workerController.addWorker)


/**
 * @group Worker - Worker
 * For Get Workers
 * @route GET /worker/getWorkers
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
workerRouter.get('/getWorkers', workerController.getWorkers)


/**
 * @typedef addSchedule
 * @property {string} workerId
 * @property {string} day
 * @property {string} startTime
 * @property {string} endTime
 */
/**
 * @group Worker - Worker
 * For addSchedule
 * @route POST /worker/addSchedule
 * @param {addSchedule.model} addSchedule.body.required
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
workerRouter.post('/addSchedule', workerController.addSchedule)



/**
 * @typedef getScheduleByWorkerId
 * @property {string} workerId
 */
/**
 * @group Worker - Worker
 * For getScheduleByWorkerId
 * @route POST /worker/getScheduleByWorkerId
 * @param {getScheduleByWorkerId.model} getScheduleByWorkerId.body.required
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
workerRouter.post('/getScheduleByWorkerId', workerController.getScheduleByWorkerId)

/**
 * @typedef checkWorkerAvailability
 * @property {string} workerId
 * @property {string} day
 * @property {string} requestedStartTime
 * @property {string} requestedEndTime
 */
/**
 * @group Worker - Worker
 * For checkWorkerAvailability
 * @route POST /worker/checkWorkerAvailability
 * @param {checkWorkerAvailability.model} checkWorkerAvailability.body.required
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
workerRouter.post('/checkWorkerAvailability', workerController.checkWorkerAvailability)



module.exports = workerRouter