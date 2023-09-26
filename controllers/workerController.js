const Joi = require('joi');
var mongoose = require('mongoose');

// models
const Worker = require('../models/Worker');
const Schedule = require('../models/Schedule');


// Create/add worker
const addWorker = async (req, res) => {
    try {
        const payload = req.body;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),

        });

        const result = schema.validate(payload);

        const { value, error } = result;

        const valid = error == null;

        if (!valid) {

            return res.status(400).json({ message: error.details[0].message, success: false, data: error })

        } else {
            const newWorker = await Worker.create(req.body);
            return res.status(200).json({ message: 'Worker added', success: true, data: newWorker });
        }
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email Already Exist!', stack: 'AlreadyExist', success: false, data: {} });
        }
        return res.status(400).json({ message: 'Something went wrong.', stack: '', success: false, data: {} });
    }
}

//Get workers

const getWorkers = async (req, res) => {
    try{
        const allWorkers = await Worker.find();
        return res.status(200).json({ message: 'Worker data fetched.', success: true, data: allWorkers });
    }
    catch(error){
        console.log(error)
        return res.status(400).json({ message: 'Something went wrong.', stack: '', success: false, data: {} });
    }
}


// Create a Worker Schedule
const addSchedule = async (req, res) => {

    try {
      const { workerId, day, startTime, endTime } = req.body;
  
      const schema = Joi.object().keys({
        workerId: Joi.string().required(),
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        });

        const result = schema.validate(req.body);

        const { value, error } = result;

        const valid = error == null;

        if (!valid) {

            return res.status(400).json({ message: error.details[0].message, success: false, data: error })

        } else {
            // Check if the worker exists
            const worker = await Worker.findById(workerId);
            if (!worker) {
                return res.status(404).json({ message: 'Worker not found', success: false });
            }
        
            // Check for an existing schedule on the same day
            const existingSchedule = await Schedule.findOne({
                worker: workerId,
                day,
                $or: [
                {
                    $and: [
                    { startTime: { $lte: startTime } },
                    { endTime: { $gte: startTime } },
                    ],
                },
                {
                    $and: [
                    { startTime: { $lte: endTime } },
                    { endTime: { $gte: endTime } },
                    ],
                },
                ],
            });
  
            if (existingSchedule) {
              return res.status(400).json({ error: 'Schedule already exists for this time slot on the same day' });
            }
            
            
            // Check for the 30-minute travel gap before the appointment
            const previousSchedule = await Schedule.findOne({
                worker: workerId,
                day,
                endTime: { $lte: startTime },
            });
            console.log('previousSchedule', previousSchedule);
            var diff = startTime - previousSchedule.endTime
            console.log('-------------', diff);
            if (previousSchedule && startTime - previousSchedule.endTime < 30) {
                return res.status(400).json({ error: 'Not enough travel time before the appointment' });
            }
  
            // Check for the 30-minute travel gap after the appointment
            const nextSchedule = await Schedule.findOne({
                worker: workerId,
                day,
                startTime: { $gte: endTime },
            });
  
            if (nextSchedule && nextSchedule.startTime - endTime < 30) {
                return res.status(400).json({ error: 'Not enough travel time after the appointment' });
            }

            // Create the new schedule
            const newSchedule = await Schedule.create({
                worker: workerId,
                day,
                startTime,
                endTime,
            });
        
            return res.status(200).json({ message: 'Schedule added.', success: true, data: newSchedule });
        }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Unable to add schedule', success: false });
    }
  };
  

// Get Worker Schedules by Worker ID

const getScheduleByWorkerId = async (req, res) => {
    try {
      const workerId = req.body.workerId;
  
      const schedules = await Schedule.find({ worker: workerId });
      return res.status(200).json({ message: 'Worker data fetched.', success: true, data: schedules });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Unable to get schedule', success: false });
    }
};

const checkWorkerAvailability = async(req, res) => {
    try {
        //workerId, day, requestedStartTime, requestedEndTime
      const { workerId, day, requestedStartTime, requestedEndTime } = req.body;
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found', success: false });
      }
  
      const existingSchedules = await Schedule.find({
        worker: workerId,
        day,
        $or: [
          {
            $and: [
              { startTime: { $lte: requestedStartTime } },
              { endTime: { $gte: requestedStartTime } },
            ],
          },
          {
            $and: [
              { startTime: { $lte: requestedEndTime } },
              { endTime: { $gte: requestedEndTime } },
            ],
          },
        ],
      });
  
      if (existingSchedules.length === 0) {
        return res.status(200).json({ message: 'Worker is available', success: true, available: true });
    } else {
        return res.status(200).json({ message: 'Worker has a schedule conflict', success: true, available: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error checking worker availability',available: false, success: false });
    }
  }
  
  

module.exports = {
    addWorker,
    getWorkers,
    addSchedule,
    getScheduleByWorkerId,
    checkWorkerAvailability,
}
