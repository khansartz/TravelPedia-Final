// Dibuat oleh Khansa
//Fungsi ini digunakan uutuk menambahkan CSS active ke elemen ejs sesuai dengan 
//rute yang aktif agar membantu  untuk mengetahui rute mana yang sedang mereka akses saat ini.

function isActiveRoute(route, currentRoute) {
    return route === currentRoute ? 'active' : '';
  }
  
  module.exports = { isActiveRoute };