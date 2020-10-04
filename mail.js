const port = 3000;
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer') 
const upload = multer() 
const imaps = require('imap-simple');
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

app.post('/testlogin', upload.array(), function (req, res, next) {

 var config = {
  imap: {
      user: req.body.email,
      password: req.body.password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 3000
  }
 };


 imaps.connect(config).then(function (connection) {
    
   
    
  return connection.openBox('INBOX').then(function () {
      var searchCriteria = [
          'UNSEEN'
      ];
 
      var fetchOptions = {
          bodies: ['HEADER'],
          markSeen: false
      };
 
      return connection.search(searchCriteria, fetchOptions).then(function (results) {
          var subjects = results.map(function (res) {
              return res.parts.filter(function (part) {
                  return part.which === 'HEADER';
              })[0].body.subject[0];
          });
        var froms = results.map(function (res) {
            return res.parts.filter(function (part) {
                return part.which === 'HEADER';
            })[0].body.from[0];
        });
 
        var data = {
            subject : subjects,
            from : froms
        }
          console.log(data);
          res.json(data)
      });
  });
 });
  // end here
})

app.listen(port, () => {
    console.log(`App in port http://localhost:${port}`)
  })