const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//schema

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//middleware

//1:to register tokken

employeeSchema.methods.genrateAuthToken = async function () {
    try {
        //console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        //console.log(token);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send('the error part' + error);
        console.log('the error part' + error);
    }
}

//2:bcrypt before save in db

employeeSchema.pre("save", async function (next) {

    if (this.isModified('password')) {

        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);

    }
    next();
});

//collection

const Register = new mongoose.model('Register', employeeSchema);

module.exports = Register;