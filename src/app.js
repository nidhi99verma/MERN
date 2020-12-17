require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
require('./db/conn');
const Register = require('./models/registers');
const app = express();
const port = process.env.PORT || 4000;


const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', templates_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

//register

app.post('/register', async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {

            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            //console.log('the succes part ', registerEmployee);
            const token = await registerEmployee.genrateAuthToken();
            //console.log('the token part ', token);

            const registered = await registerEmployee.save();
            res.status(201).render("index");

        } else {
            res.send('password are not matching');
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

//login check

app.post('/login', async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.genrateAuthToken();
        //console.log('the token part ', token);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send('invalid login detail');
        }

    } catch (e) {
        res.status(400).send('invalid login detail');
    }
});

app.listen(port, () => {
    console.log(`surver is running on port no: ${port}`)
});
