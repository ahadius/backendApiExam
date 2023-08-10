const mongoose = require('mongoose');

const SchemaActivity = new mongoose.Schema({
    department:[ {
        type: String,
    }],
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    hours: [
        {
            status: {
                type: String,
                enum: ["available", "taken"]
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
            }
        }
    ]
}, { timestamps: true });

const Activity = mongoose.model("Activity", SchemaActivity);

module.exports = Activity;
