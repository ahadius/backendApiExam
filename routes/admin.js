const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror');

const User = require('../model/user.js')
const { verifyToken, isadmin } = require('../middlewares/verifyauth');
const jwt = require('jsonwebtoken');
const Activity = require('../model/Activity.js');

router.post('/addactivity', verifyToken, isadmin, asyncerror(async (req, res, next) => {
    const hours = []
    for (let index = 0; index < req.body.numberofhour; index++) {
        let data = {
            status: "available",
        }
        hours.push(data)
    }
    req.body.hours = hours
    const activity = await Activity.create(req.body)
    res.status(200).send({ success: true, activity })
}));

router.post('/allusers', verifyToken, isadmin, asyncerror(async (req, res, next) => {
    const departments = req.body.department; 
    
    const users = await User.find({ department: { $in: departments },role:"user" });
    res.status(200).send({ success: true, users });
}));

router.get('/activity', verifyToken, isadmin, asyncerror(async (req, res, next) => {
    const activity = await Activity.find().sort({createdAt:-1});
    const availableHours = activity.map(activity => {
        const availableHoursForActivity = activity.hours.filter(hour => hour.status === "available");
        return {
            ...activity._doc,
            availableHours: availableHoursForActivity
        };
    });

    res.status(200).send({ success: true, activity:availableHours })
}));

router.put('/activity/user',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const users = req.body.users;
    const department = req.body.department;
    const activityId = req.body.id;
    const activity = await Activity.findById(activityId);
    if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    activity.users=users;
    activity.department=department;

    activity.hours.forEach(hour => {
        if (!users.includes(hour.user)) {
            hour.user = null;
            hour.status = 'available';
        }
    });
    await activity.save();
    res.status(200).json({ success: true, activity });
}));

router.delete('/activity',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const activityId = req.body.activity;
    const activity = await Activity.findByIdAndDelete(activityId);
    res.status(200).json({ success: true, activity });
}));

module.exports = router