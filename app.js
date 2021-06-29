
const express = require('express')
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact ,addContact, cekDuplikat, deleteContact, updateContacts} = require('./utils/contacts')
const { body, validationResult ,check} = require('express-validator');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

//Gunakan ejs
app.set('view engine', 'ejs');
//Third party middleware
app.use(expressLayouts)
//Built in middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended : true }))

//
app.use(cookieParser('secret'))
app.use(session({
  cookie: {maxAge : 6000},
  secret : 'secret',
  resace: true,
  saveUninitialized:true
})
)

app.use(flash());

//App level middleware

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama :'iki',
      email: 'iki@gmail.xom'
    },
    {
      nama :'ika',
      email: 'ika@gmail.xom'
    },{
      nama :'ike',
      email: 'ike@gmail.xom'
    }
  ]
  console.log(mahasiswa)
  
  res.render('index', { nama:'iki',
   mahasiswa : mahasiswa,
   layout:'layout/main-layout'
  });
})

app.get('/about', (req, res) => {
  res.render('about', {
    layout :'layout/main-layout',
    
  });
  
  })

  app.get('/contact', (req, res) => {
    const contacts = loadContact()
    res.render('contact', {
      layout :'layout/main-layout',contacts,
      msg : req.flash('msg')
    });
    
    })

    //Form tambah data kontak
    app.get('/contact/add', (req,res)=>{
      res.render('add-contact',  {
        layout :'layout/main-layout'
      })
    })


    //proses data kontak
    app.post('/contact',[
      body('nama').custom((value) => {
        const duplikat =cekDuplikat(value)
        if(duplikat){
          throw new Error('Contact name has already been used')
        }
        return true
      }),
      check('hp', 'Phone number invalid').isMobilePhone('id-ID'),
      check('email', 'Email invalid').isEmail()
      
        
      
    ], (req,res)=> {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
       // return res.status(400).json({errors : errors.array()})
       res.render('add-contact', {
         layout :'layout/main-layout',
         errors :errors.array()
       })
      }else{
        
      addContact(req.body)
      req.flash('msg', 'Data input success')
      res.redirect('/contact')
      }
    })
    //Proses delete contact
    app.get('/contact/delete/:nama', (req,res) => {
      const contact = findContact(req.params.nama);
      //Jika kontak tidak ada
      if(!contact){
        res.status(404)
        res.send('<h1>404<h1>')
      }else{
        deleteContact(req.params.nama)
        req.flash('msg', 'Data deleted ')
      res.redirect('/contact')
      }
    })


    //Ubah data kontak
    app.get('/contact/edit/:nama', (req,res)=>{
      const contact = findContact(req.params.nama)
      res.render('edit-contact',  {
        layout :'layout/main-layout', contact
      })
    })

    //Proses ubah data
    app.post('/contact/update',[
      body('nama').custom((value, {req}) => {
        const duplikat =cekDuplikat(value)
        if(duplikat && value !== req.body.oldName){
          throw new Error('Contact name has already been used')
        }
        return true
      }),
      check('hp', 'Phone number invalid').isMobilePhone('id-ID'),
      check('email', 'Email invalid').isEmail()
      
        
      
    ], (req,res)=> {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
       // return res.status(400).json({errors : errors.array()})
       res.render('edit-contact', {
         layout :'layout/main-layout',
         errors :errors.array(),
         contact: req.body
       })
      }else{
        
      updateContacts(req.body)
      req.flash('msg', 'Data edit success')
      res.redirect('/contact')
      }
    })


    //Halaman detail kontak
    app.get('/contact/:nama', (req, res) => {
      const contact = findContact(req.params.nama)
      res.render('detail', {
        layout :'layout/main-layout', contact: contact
      });
      
      })

app.get('/product/:id', (req,res)=> {
  res.send(`Product ID : + ${req.params.id} <br> Category :${req.query.category}`)
})

app.use('/', (req,res) => {
    res.status(404)
    res.send('test')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




// const http = require('http');
// const fs = require('fs');


// const renderHtml = (path, res) => {
//     fs.readFile(path, (err, data)=>{
//         if(err){
//             res.writeHead(404);
//             res.write('Error : File not dound')
//         }else {
//             res.write(data);
//         }
//         res.end();
//     })
// }

// const server = http.createServer((req,res) =>{
    

//     res.writeHead(200,{
//         'Content-Type':'text/html'
//     })
//     const url = req.url;
//     if (url === '/about'){
//         renderHtml('./about.html',res)
//     }else {
//         renderHtml('./index.html', res)
//     }
    
// });

// server.listen(3000, () => {
//     console.log("Server is listening on port 3000")
// })