const mongoose = require('mongoose');
const BaseUser = require('./BaseUser');

const AdminSchema = new mongoose.Schema({});

// Prevent multiple admins from being created
AdminSchema.pre("save", async function (next) {
    const existingAdmin = await mongoose.model("Admin").findOne({ role: "Admin" });
    if (existingAdmin) {
        throw new Error("An admin already exists. Only one admin is allowed.");
    }
    next();
});

const Admin = BaseUser.discriminator("Admin", AdminSchema);
module.exports = Admin;
