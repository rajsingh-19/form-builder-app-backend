const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/user.schema");

dotenv.config();                                                 // Load environment variables from .env file

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
    //          payload for the JWT token (information we want to encode into the token)
    const payload = {
        id: isUserValid._id                         // Include mongodb id in the token payload
    }
    //          create the JWT token with the payload, using a secret key from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({status: true, message: "Login Successfully", token: token});
}

module.exports = loginHandler;
