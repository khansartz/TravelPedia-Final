// Dibuat oleh Aliyah (sort) dan Nafisya (filter)
//  modal
var modal = document.getElementById("popup-modal");

// Dapatkan tombol yang membuka modal
var btns = document.querySelectorAll(".view-more-btn");

// Dapatkan elemen <span> yang menutup modal
var span = document.getElementsByClassName("close-btn")[0];

// Ketika pengguna mengklik tombol, buka modal
btns.forEach((btn) => {
  btn.addEventListener("click", function () {
    var imgSrc = this.getAttribute("data-img");
    var title = this.getAttribute("data-title");
    var content = this.getAttribute("data-content");

    document.getElementById("popup-img").src = imgSrc;
    document
      .getElementById("popup-text")
      .getElementsByTagName("h4")[0].innerText = title;
    document
      .getElementById("popup-text")
      .getElementsByTagName("p")[0].innerText = content;

    modal.style.display = "block";
  });
});

// Saat pengguna mengklik <span> (x), tutup modal
span.onclick = function () {
  modal.style.display = "none";
};

// Ditutup ketika pengguna mengklik di mana saja di luar modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Fungsi untuk tombol Sort by
document.getElementById("sort-btn").addEventListener("click", function () {
  var options = document.getElementById("sort-options");
  options.style.display =
    options.style.display === "none" || options.style.display === ""
      ? "block"
      : "none";
});

// Fungsi untuk sort-options by A-Z
document.getElementById("sort-a-z").addEventListener("click", function () {
  sortItems("asc");
});

// Fungsi untuk sort-options by Z-A
document.getElementById("sort-z-a").addEventListener("click", function () {
  sortItems("desc");
});

// Fungsi untuk Sorting
function sortItems(order) {
  var items = document.querySelectorAll(".gallery-item");
  var sortedItems = Array.from(items).sort(function (a, b) {
    var titleA = a.querySelector("h4").innerText.toLowerCase();
    var titleB = b.querySelector("h4").innerText.toLowerCase();
    if (order === "asc") {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });

  var gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  sortedItems.forEach(function (item) {
    gallery.appendChild(item);
  });

  // Hide sort options after sorting
  document.getElementById("sort-options").style.display = "none";
}
/// Fungsi untuk menampilkan galeri berdasarkan filter lokasi
function filterItems(location) {
  var items = document.querySelectorAll(".gallery-item");
  items.forEach(function (item) {
    var title = item.querySelector("h4").innerText.toLowerCase();
    var isPulauJawa = [
      "what about yogyakarta?",
      "hiking mount lawu",
      "visiting mount bromo",
      "attractions in bandung",
    ].includes(title.toLowerCase());
    if (
      (location === "pulau jawa" && isPulauJawa) ||
      (location === "luar pulau jawa" && !isPulauJawa)
    ) {
      item.style.display = "block";
    } else if (location === "semua kategori") {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Fungsi untuk menambahkan event listener pada tombol filter
document
  .getElementById("filter-pulau-jawa")
  .addEventListener("click", function () {
    filterItems("pulau jawa");
  });

document
  .getElementById("filter-luar-pulau-jawa")
  .addEventListener("click", function () {
    filterItems("luar pulau jawa");
  });

document.getElementById("filter-semua").addEventListener("click", function () {
  filterItems("semua kategori");
});
