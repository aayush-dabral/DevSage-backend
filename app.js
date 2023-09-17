const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const ensureLogin = require('connect-ensure-login')
const cors = require('cors')
const Authenticate = require('./middleware/Authenticate')
const CheckAdmin = require('./middleware/CheckAdmin')

const app = express();
// app.use(cors());
app.use('*',cors({
    origin: true,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
const { MONGO_URL, PORT, session_secret } = process.env

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const checkAdmin = require('./middleware/CheckAdmin');


// app.use(passport.authenticate('session'));

app.use('/auth', authRoutes);
app.use('/admin', Authenticate, checkAdmin, adminRoutes);
app.use('/user', Authenticate, userRoutes);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => {
    console.log("connected to MongoDB")
    app.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}`)
    })
}).catch((error) => {
    console.log(error);
})

