const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/user.schema");
const DashboardModel = require("../models/dashboard.schema");

dotenv.config();                                                 // Load environment variables from .env file

//                      register controller         
const registerHandler = async (req, res) => {
    const {userName, email, password} = req.body;
    const isUserExists = await UserModel.findOne({email});
    //      check if user already exists
    if(isUserExists) {
        return res.status(400).json({message: "User already exists"});
    }
    //          hash the password using bcrypt
    const salting = await bcrypt.genSalt(10);                              // Generate a salt for password hashing
    const hashPassword = await bcrypt.hash(password, salting);             // Hash the password with the salt
    try {
        //          create the User in the Model
        const newUser = new UserModel({
            userName: userName,
            email: email,
            password: hashPassword
        });
        //          save the new user to the database
        await newUser.save();                                               // Save the new user to the model (MongoDB)
        res.status(201).json({message: "User Created"});

        // Automatically create a default dashboard for the user
        const dashboard = new DashboardModel({
            name: `${userName}'s Workspace`,
            owner: newUser._id,
        });
        await dashboard.save();

        // Link the dashboard to the user
        newUser.dashboards.push(dashboard._id);
        await newUser.save();

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error in Creating User"});
        return;
    }
};

//                          login controller                
const loginHandler = async (req, res) => {
    const {email, password} = req.body;
    const isUserValid = await UserModel.findOne({email});
    //          check if user is present or not
    if(!isUserValid) {
        return res.status(401).json({message: "Credential is wrong"});
    }
    //          check if the password is same or not
    const isPasswordValid = await bcrypt.compare(password, isUserValid.password);
    //          check if the password is valid or not
    if(!isPasswordValid) {
        return res.status(401).json({message: "Credential is wrong"});
    }

    // Ensure the user has a dashboard
    let dashboard = await DashboardModel.findOne({ owner: isUserValid._id });
    if (!dashboard) {
        dashboard = new DashboardModel({
            name: `${isUserValid.userName}'s Workspace`,
            owner: isUserValid._id,
        });
        await dashboard.save();

        // Link the dashboard to the user
        isUserValid.dashboards.push(dashboard._id);
        await isUserValid.save();
    }

    //          payload for the JWT token (information we want to encode into the token)
    const payload = {
        id: isUserValid._id                         // Include mongodb id in the token payload
    }
    //          create the JWT token with the payload, using a secret key from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({status: true, message: "Login Successfully", token: token, userId: isUserValid._id, dashboardId: dashboard._id });
};

module.exports = { registerHandler, loginHandler };
