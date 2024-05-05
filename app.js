require('dotenv').config();

// Konfigurasi Awal
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 5000;
  
// Menyambung ke MongoDB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

app.use(express.static('public'));
app.use(express.json());

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute; 


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.post('/contact', (req, res)=>{
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'xxx@gmail.com',  // Username email pengirim
      pass: 'wvvf tthx vhcc vmya'     // Password email pengirim
    }
  })

  const mailOptions = {
    from: req.body.email,
    to: 'xxx@gmail.com',    // Alamat email penerima
    subject: `Message from ${req.body.email}: ${req.body.subject}`,
    text: req.body.message
  }

  transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
      console.log(error);
      res.send('error');
    } else {
      console.log('email sent: ' + info.response);
      res.send('success');
    }
  })

});



app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});

