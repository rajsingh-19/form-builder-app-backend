const express = require('express');
const dotenv = require("dotenv");
const authCreater = require("../middleware/auth");
const DashboardModel = require('../models/dashboard.schema');
const FormModel = require("../models/form.schema");

dotenv.config();

const dashboardHandler = () => {
    const {} = req.body;
};


module.exports = dashboardHandler;

