// Dibuat oleh khansa
// Impor berbagai modul

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';   // Lokasi file layout untuk halaman admin.
const jwtSecret = process.env.JWT_SECRET;       // Akses rahasia JWT yang seharusnya disimpan sebagai variabel lingkungan untuk keamanan.


// Memeriksa apakah pengguna yang meminta halaman admin telah terautentikasi.
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;            // Mendapatkan token dari cookie yang dikirimkan oleh browser.

  if(!token) {          // Jika token tidak ada, kembalikan respons JSON dengan 
                        // status 401 (Unauthorized) dan pesan "unauthorized".
    return res.status(401).json( { message: 'unauthorized' } );
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next()
  } catch(error) {
    res.status(401).json( { message: 'unauthorized' } );
  }
}


// GET
// admin login page

// Mendefinisikan rute yang dipicu oleh permintaan ke URL "/admin".
router.get('/admin', async (req, res) => {    
    try {
      const locals = {
        title: "Admin",
      }

     // Menjalankan fungsi render dari Express untuk merender template tampilan "admin/index.ejs"
      res.render('admin/index', { locals, layout: adminLayout }); 
    } catch (error) {
      console.log(error);
    }

  });


  //check login

// Melakukan routing untuk login admin. Jika pengguna melakukan POST request ke URL /admin, 
// maka kode ini akan dieksekusi.
  router.post('/admin', async (req, res) => {
    try {

      const { username, password } = req.body;

      const user = await User.findOne( { username} );

      if(!user) {
        return res.status(401).json( { message: 'invalid credentials'} );
      }

      // Jika user ditemukan, kode ini akan membandingkan password yang dikirimkan 
      // di request body dengan password user yang tersimpan di database 

      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Jika password valid, kode ini akan menghasilkan token JWT (JSON Web Token) menggunakan library jwt. 
      // Token ini kemudian disimpan sebagai cookie di browser user dengan nama token.

      if(!isPasswordValid) {
        return res.status(401).json( { message: 'invalid credentials'} );
      }

      const token = jwt.sign({userId: user._id}, jwtSecret)
      res.cookie('token', token, { httpOnly: true});
      res.redirect('/dashboard')
    
    } catch (error) {
      console.log(error);
    }
  });

// Routing untuk dashboard admin.
// authMiddleware digunakan untuk mengecek apakah user sudah ter-autentikasi 
// sebelum mengakses halaman dashboard.

  router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Dashboard",
        description: "simple blog"
      }

      const data = await Post.find();
      res.render('admin/dashboard', {
        locals,
        data,
        layout: adminLayout
      });
  
  
    } catch (error) {
      console.log(error);
      
    }
  });

  // Jika user berhasil melewati middleware authMiddleware, kode ini akan mengambil data blog 
  // post menggunakan fungsi Post.find dan kemudian merender halaman admin/dashboard dengan data tersebut.
  router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Add Post",
        description: "simple blog"
      }

      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
  
    } catch (error) {
      console.log(error);
      
    }
  });


  // Menambahkan postingan baru oleh admin.
  router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });

        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
      
  
    } catch (error) {
      console.log(error);
    }

  });

    // Mengedit Postingan
    router.get('/edit-post/:id', authMiddleware, async (req, res) => {
      try {

        const locals = {
          title: "Edit Post"
        }
        
        // Menemukan postingan di database yang memiliki ID yang sesuai 
        // dengan parameter :id yang dikirimkan.
        const data = await Post.findOne({ _id: req.params.id });      
        
        res.render('admin/edit-post', {
          locals,
          data,
          layout: adminLayout
        })

      } catch (error) {
        console.log(error);
        
      }
    });


  // Memperbarui postingan yang diedit
  router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
      
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });

      res.redirect(`/edit-post/${req.param.id}`);
  
    } catch (error) {
      console.log(error);
    }
  });

//Route ini menangani permintaan login pengguna. Kode ini mencoba mengambil username 
// dan password dari request body dan kemudian mencoba melakukan login.
// Jika berhasil, kode akan mengalihkan pengguna ke halaman admin (/admin).
router.post('/admin', async (req, res) => {
  try {

    const { useername, password } = req.body;

    console.log(req.body);
    res.redirect('/admin');


  } catch (error) {
    console.log(error);
  }
});

//register
// Route ini menangani permintaan pendaftaran pengguna baru.
// Kode ini mencoba mengambil username dan password dari request body. Kemudian, kode akan hashing password pengguna menggunakan bcrypt
router.post('/register', async (req, res) => {
  try {

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User Created', user})      //status code 201 (Created).
    } catch (error) {
      if (error.code === 11000 ) {
        // res.send("user already in use")
        res.status(409).json({ message: 'User already in use'})   //status code 409 (Error).
      }
      res.status(500).json({message: 'internal server error'})    // status code 500 (Internal Server Error)
    }

  } catch (error) {
    console.log(error);
  }
});

//admin - delete post
// Menangani permintaan menghapus postingan.
// Hanya user yang terautentikasi sebagai admin yang bisa menghapus postingan.
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id} );
    res.redirect('/dashboard');
  } catch (error) {
    
  }
});

//get admin logout
// Menangani permintaan logout user admin. 
// Kode ini akan menghapus cookie token admin dan kemudian mengalihkan admin ke halaman root (/).
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/')
})



module.exports = router;