const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

//initialie express
const app = express();

//defining path
const publicDirectoryPath = path.join(__dirname, './public')

//view engine setup
app.engine('handlebars', exphbs({
    extname: "handlebars",
    defaultLayout: "main-layout",
    layoutsDir: "views/"
}))
app.set('view engine', 'handlebars')

//static folder
app.use(express.static(publicDirectoryPath))

//set body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//routes
app.get('/', (req, res) => {
  app.locals.layout = false;
	res.render('contact', {layout: false})
});

app.post('/send', (req, res) => {
	const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ' <the forwarding email goes here>', // generated ethereal user
        pass: '<forwarding email password goes here>'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <forwarding message goes here again>', // sender address
      to: 'the receiving email goes here', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'E-mail Sent! Thank you and I will get back to you.'});
  });
  });


const port = process.env.PORT || 3000


app.listen(port, () => console.log(`server is running at port ${port}`))