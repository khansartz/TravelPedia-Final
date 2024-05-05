// Dibuat oleh Aliyah dan Puspa
function displayGallery(images) {
  const galleryContainer = document.querySelector(".gallery-container");

  images.forEach((image) => {
    // Buat elemen div untuk setiap gambar dalam galeri
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = `http://localhost:5000/img/${image.imagePath}`;
    img.alt = image.title;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    overlay.innerHTML = `
      <h3>${image.title}</h3>
      <p>${image.description}</p>
    `;

    const editDeleteButtons = document.createElement("div");
    editDeleteButtons.classList.add("edit-delete-buttons");

    editDeleteButtons.innerHTML = `
    <ion-icon name="pencil-sharp" onclick="showEditForm('${image._id}', '${image.title}', '${image.description}')"></ion-icon>
      <ion-icon name="trash-sharp" onclick="deleteImage('${image._id}')"></ion-icon>
    `;

    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    galleryItem.appendChild(editDeleteButtons);

    galleryContainer.appendChild(galleryItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/gallery")
    .then((response) => response.json())
    .then((images) => {
      displayGallery(images);
    })
    .catch((error) => {
      console.error("Error fetching gallery data:", error);
    });
});

function showEditForm(imageId, currentTitle, currentDescription) {
  // Tampilkan form edit
  const addForm = document.getElementById("addForm");
  addForm.style.display = "block";

  // Isi nilai input dengan data saat ini
  const titleInput = document.getElementById("titleInput");
  const descriptionInput = document.getElementById("descriptionInput");

  titleInput.value = currentTitle;
  descriptionInput.value = currentDescription;

  // Ubah label tombol "Upload" menjadi "Update"
  const uploadButton = document.querySelector(
    "#uploadForm button[type='button']"
  );
  uploadButton.textContent = "Update";
  uploadButton.onclick = () => updateImage(imageId); // Mengarahkan tombol "Upload" ke fungsi updateImage
}

async function updateImage(imageId) {
  const formData = new FormData();
  const imageInput = document.getElementById("imageInput");
  const titleInput = document.getElementById("titleInput").value;
  const descriptionInput = document.getElementById("descriptionInput").value;

  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput);
  formData.append("description", descriptionInput);

  try {
    const response = await fetch(`/api/gallery/${imageId}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Image updated successfully!");
      // Refresh atau lakukan operasi lain setelah berhasil
      location.reload(); // Contoh: Refresh halaman setelah berhasil
    } else {
      throw new Error("Failed to update image.");
    }
  } catch (error) {
    console.error("Error updating image:", error);
    alert("Failed to update image. Please try again.");
  }
}

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

// Fungsi untuk menavigasikan pengguna ke halaman home
function navigateToHome() {
  // Mengganti window.location.href dengan alamat halaman home yang diinginkan
  window.location.href = "/beranda";
}

// Menambahkan event listener untuk tombol sign up
registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

// Menambahkan event listener untuk tombol login
loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

// Menambahkan event listener untuk tombol login di dalam form login
document
  .querySelector(".form-box.login form")
  .addEventListener("submit", (event) => {
    // Menghentikan perilaku default form (pengiriman data)
    event.preventDefault();
    // Retrieve the username input value
    const usernameInputValue = document.querySelector(
      '.form-box.login input[type="text"]'
    ).value;
    // Panggil fungsi navigateToHome untuk beralih ke halaman home
    navigateToHome();
    // Simpan username ke local storage
    localStorage.setItem("username", usernameInputValue);
  });

// Menambahkan event listener untuk tombol sign up di dalam form sign up
document
  .querySelector(".form-box.register form")
  .addEventListener("submit", (event) => {
    // Menghentikan perilaku default form (pengiriman data)
    event.preventDefault();
    // Retrieve the username input value
    const usernameInputValue = document.querySelector(
      '.form-box.register input[type="text"]'
    ).value;
    // Panggil fungsi navigateToHome untuk beralih ke halaman home
    navigateToHome();
    // Simpan username ke local storage
    localStorage.setItem("username", usernameInputValue);
  });

// Menambahkan event listener untuk tombol toggle password
document.querySelectorAll(".toggle-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const passwordInput = icon.parentElement.querySelector("input");
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    // Ganti ikon berdasarkan jenis input password
    icon.innerHTML =
      type === "password"
        ? '<ion-icon name="eye-off-outline"></ion-icon>'
        : '<ion-icon name="eye-outline"></ion-icon>';
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }

  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});

// Fungsi untuk menampilkan form tambah
function showAddForm() {
  document.getElementById("addForm").style.display = "block";
}

// Fungsi untuk menyembunyikan form tambah
function hideAddForm() {
  document.getElementById("addForm").style.display = "none";
}

// Fungsi untuk mengunggah atau mengedit gambar
function uploadImage() {
  const formData = new FormData();
  const imageFile = document.getElementById("imageInput").files[0];
  const title = document.getElementById("titleInput").value;
  const description = document.getElementById("descriptionInput").value;

  formData.append("image", imageFile);
  formData.append("title", title);
  formData.append("description", description);

  fetch("/gallery/add", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        // Jika pengunggahan berhasil, muat ulang halaman untuk memperbarui galeri
        window.location.reload();
      } else {
        // Jika terjadi kesalahan, tampilkan pesan kesalahan
        alert("Gagal mengunggah gambar.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal mengunggah gambar.");
    });
}

// Fungsi untuk menghapus gambar
function deleteImage(imageId) {
  fetch(`/gallery/delete/${imageId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Jika penghapusan berhasil, muat ulang halaman untuk memperbarui galeri
        window.location.reload();
      } else {
        // Jika terjadi kesalahan, tampilkan pesan kesalahan
        alert("Gagal menghapus gambar.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal menghapus gambar.");
    });
}
// Fungsi untuk filter kategori berdasarkan lokasi "Pulau Jawa" atau "Luar Pulau Jawa"
document.getElementById("filter-btn").addEventListener("click", function () {
  var selectedLocation = document
    .getElementById("location-filter")
    .value.toLowerCase();

  var items = document.querySelectorAll(".gallery-item");
  items.forEach(function (item) {
    var title = item.querySelector("h4").innerText.toLowerCase();
    var isPulauJawa =
      title.includes("bali") ||
      title.includes("yogyakarta") ||
      title.includes("bandung") ||
      title.includes("lawu") ||
      title.includes("bromo");
    if (selectedLocation === "pulau jawa" && isPulauJawa) {
      item.style.display = "block";
    } else if (selectedLocation === "luar pulau jawa" && !isPulauJawa) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});
