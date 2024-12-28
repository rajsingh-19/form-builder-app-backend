const bcrypt = require('bcrypt');
const UserModel = require('../models/user.schema');

// Update user settings
const updateUser = async (req, res) => {
    const { userName, email, oldPassword, newPassword } = req.body;     // Extract the username, email old and new password from request body
    const userId = req.user.id;                         // Get the user ID from the authenticated user (stored in req.user)

    // Check for unexpected keys
    const allowedFields = ['userName', 'email', 'oldPassword', 'newPassword'];
    const requestFields = Object.keys(req.body);

    // If the request contains any field other than the allowed fields, return an error
    const invalidFields = requestFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    //      Try Catch block for error handling
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update userName if provided
        if (userName) {
            user.userName = userName;
        }

        // Update email if provided
        if (email) {
            user.email = email;
        }

        // Update password if both oldPassword and newPassword are provided
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ message: 'User settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user settings', error });
    }
};

module.exports = updateUser;
