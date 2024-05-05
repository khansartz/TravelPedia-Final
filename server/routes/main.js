// Dibuat oleh Khansa (bagian postingan, search, pagination), Puspa (upload gambar di Gallery), dan Aliyah (Gallery dan feedback)

// Import modul

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require("../models/User");
const Image = require("../models/Image");
const Comment = require("../models/Comment");
const multer = require("multer");
const path = require("path");
const { title } = require('process');

// Kode ini ditulis dalam Javascript dan menggunakan library multer
// untuk menangani penyimpanan file yang diupload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/img"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



// Membuat templates untuk postingan  
router.get('', async (req, res) => {
    try {
        const locals = {               // Berisi data yang akan dikirim ke template postingan
            title: "News"          
        }
        // Pagination
        // Jumlah postingan yang akan ditampilkan per halaman (diset menjadi 5).
        let perPage = 5;                 

         // Mendapatkan nomor halaman dari parameter query request. Jika tidak ada, dianggap halaman 1.
        let page = req.query.page || 1;  
    
        // Mengurutkan berdasarkan createdAt secara descending (postingan terbaru dulu).
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)   //Melewati sejumlah postingan awal berdasarkan per halaman dan nomor halaman saat ini.
        .limit(perPage)                  // Membatasi jumlah postingan yang diambil sesuai dengan perPage.
        .exec();                        // Menjalankan operasi aggregation dan menunggu hasilnya.
        

    const count = await Post.countDocuments({});          //  Menghitung jumlah total postingan
    const nextPage = parseInt(page) + 1;                  //  Menghitung nomor halaman selanjutnya.

    // Mengecek apakah ada halaman selanjutnya berdasarkan perhitungan jumlah total postingan dan perPage
    const hasNextPage = nextPage <= Math.ceil(count / perPage);   

        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage :null,
            currentRoute : '/'
        });

    } catch (error) {
        console.log(error);
    }


});

// Menampilkan detail posting
router.get('/post/:id', async (req, res) => {
    try {

        let slug = req.params.id;

        // Mencari data postingan di database berdasarkan _id yang nilainya sama dengan slug.
        const data = await Post.findById({_id: slug });

        // Berisi data yang akan dikirim ke template detail posting.
        const locals = {
            title: data.title
        }
        res.render('post', { locals, data, currentRoute : `/post/${slug}`
      });
    } catch (error) {
        console.log(error);
    }
});

// Searchterm
// Menangani permintaan pencarian (searching)
router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Search",
      }
  
      let searchTerm = req.body.searchTerm;

      // Menghilangkan karakter spesial dari keyword pencarian untuk meningkatkan akurasi pencarian.
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "") 
  
      // Kode menggunakan fungsi find dari model Post untuk mencari postingan 
      // yang judul atau isi nya mengandung keyword pencarian (case-insensitive menggunakan flag 'i').
      const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
      })

      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
        } catch (error) {
      console.log(error);
    }
  
  });

  // res.render untuk menampilkan halaman menggunakan template engine.
  // Menampilkan halaman "home.ejs".
  router.get('/home', (req, res) => {
    res.render('home', {
      currentRoute : '/home',
      title : 'TravelPedia'
    });
  });

  // Menampilkan halaman "blog.ejs".
  router.get('/blog', (req, res) => {
    res.render('blog', {
      currentRoute : '/blog',
      title : 'Blog'
    }); 
  });

  // Menampilkan halaman "gallery.ejs".
  router.get('/gallery', (req, res) => {
    res.render('gallery', {
      currentRoute : '/gallery',
      title : 'Gallery'
    });
  });

  // Mengambil data dari database dan mengembalikannya dalam format JSON melalui API.
  router.get("/api/gallery", async (req, res) => {
    try {
      const images = await Image.find();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).send("Gagal mendapatkan data galeri.");
    }
  });

// Tambahkan rute untuk menampilkan galeri.
router.get("/gallery", (req, res) => {
  res.render("gallery", {
    currentRoute: "/gallery",
  });
});

router.get("/api/gallery", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mendapatkan data galeri.");
  }
});

// Tambahkan rute untuk menyimpan gambar
router.post("/gallery/add", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file.filename;
    const newImage = new Image({ title, description, imagePath });
    await newImage.save();
    res.send("Gambar berhasil ditambahkan.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal menambahkan gambar.");
  }
});

// Tambahkan rute untuk mengedit gambar
router.put("/api/gallery/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageId = req.params.id;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).send("Image not found.");
    }

    if (req.file) {
      image.imagePath = req.file.filename; // Jika ada file gambar baru, update imagePath
    }
    image.title = title;
    image.description = description;

    await image.save();
    res.send("Image updated successfully.");
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send("Failed to update image.");
  }
});

// Tambahkan rute untuk menghapus gambar
router.delete("/gallery/delete/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    await Image.findByIdAndDelete(imageId);
    res.send("Gambar berhasil dihapus.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal menghapus gambar.");
  }
});

// Tambahkan rute untuk menampilkan feedback
router.get("/feedback", (req, res) => {
  res.render("feedback", {
    currentRoute: "/feedback",
  });
});

// Mendapatkan semua komentar
router.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Menambah komentar baru
router.post("/comments", async (req, res) => {
  const comment = new Comment({
    nama: req.body.nama,
    komentar: req.body.komentar,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Menghapus komentar
router.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Komentar berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mengupdate komentar
router.put("/comments/:id", async (req, res) => {
  const { nama, komentar } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { nama, komentar },
      { new: true } // Mengembalikan dokumen yang diperbarui
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  // Menampilkan halaman "contact.ejs".
  router.get('/contact', (req, res) => {
    res.render('contact', {
      currentRoute : '/contact',
      title : 'Contact'
    });
  });


  module.exports = router;