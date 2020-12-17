const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jobRegisteration', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('db Connection successful');
}).catch((e) => {
    console.log('not Connected with db');
})