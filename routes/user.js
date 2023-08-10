const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror');
const ErrorHandler = require('../middlewares/errorhandler');
const User = require('../model/user.js')
const { verifyToken} = require('../middlewares/verifyauth');
const jwt = require('jsonwebtoken');
const Activity = require('../model/Activity.js');

// Login
router.post('/login', asyncerror(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler('No User found', 405))
    }
    if (user.password !== req.body.password) {
        return next(new ErrorHandler('Wrong credentials', 405))
    }
    let userdata = {
        email: user.email,
        role: user.role,
        department: user.department
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).send({ success: true, token, userdata })
}));

// Book Hours
router.post('/bookhours',verifyToken, asyncerror(async (req, res, next) => {
    const userId = req._id;

    const { id, hours } = req.body;

    const activity = await Activity.findById(id);

    if (!activity) {
        return next(new ErrorHandler('Activity not found', 404));
    }

    const availableHours = activity.hours.filter(hour => hour.status === "available");

    if (availableHours.length < hours) {
        return next(new ErrorHandler('Not enough hours available', 400));
    }

    const updatedHours = [];

    for (let i = 0; i < hours; i++) {
        const availableHour = availableHours[i];
        availableHour.status = "taken";
        availableHour.user = userId;
        updatedHours.push(availableHour);
    }

    await activity.save();
    res.status(200).json({ success: true, bookedHours: updatedHours });
}));

// Get all activity

router.get('/activity', verifyToken, asyncerror(async (req, res, next) => {
    const userId = req._id;
    const activities = await Activity.find({ users: { $in: [userId] } });

    const availableHours = activities.map(activity => {
        const availableHoursForActivity = activity.hours.filter(hour => hour.status === "available");
        return {
            ...activity._doc,
            availableHours: availableHoursForActivity
        };
    });

    res.status(200).send({ success: true, activities: availableHours });
}));


module.exports = router