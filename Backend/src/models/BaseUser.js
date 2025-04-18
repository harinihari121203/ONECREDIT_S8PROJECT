// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const BaseUserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["Admin", "Student", "Trainer"], required: true },
// }, { timestamps: true });

// // Hash password before saving
// BaseUserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // Compare password method
// BaseUserSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const BaseUser = mongoose.model("BaseUser", BaseUserSchema);
// module.exports = BaseUser;







const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  picture: String,
  role: { type: String, enum: ['student', 'trainer', 'admin','HOD','Autonomy Affairs','Head Academics','COE'], required: true },  // Add role field
},   { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
