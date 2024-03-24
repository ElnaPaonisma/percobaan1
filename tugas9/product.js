 // Variabel global untuk menyimpan id
let id = null;

// Fungsi untuk mengedit data
const editData = (index) => {
    namaBarang.value = data[index].nama;
    hargaBarang.value = data[index].harga;
    document.getElementById("preview").src = data[index].gambar;
    id = index; // Atur id untuk mode edit
};


// Fungsi untuk menghapus data
const deleteData = async (index) => {
    try {
        const response = await fetch(`https://reqres.in/api/makanan/${data[index].id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error('Gagal menghapus data dari server');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            console.log(responseData);
        }
        data.splice(index, 1); // Hapus data dari array lokal
        saveDataToLocalStorage(data); // Simpan data ke Local Storage setelah penghapusan
        loadData(data, dataList);
    } catch (error) {
        console.error('Gagal menghapus data:', error);
    }
};



// Fungsi untuk membuat elemen input
const input = (id, type = "text", label = "", placeholder = "") => {
    if (type === "file") {
        // Tambahkan input tipe file untuk memilih gambar dari lokal
        return `
        <label>${label}</label><br>
        <input type="${type}" id="${id}" accept="image/*" onchange="previewImage(event)" style="display: none;"><br>
        <button onclick="document.getElementById('${id}').click()">Pilih Gambar</button><br>
        <span id="previewText"></span><br> <!-- Tambahkan elemen untuk menampilkan judul gambar -->
        <img id="preview" style="max-width: 100%; display: none;"><br>
        `;
    } else {
        return `
        <label>${label}</label><br>
        <input type="${type}" id="${id}" placeholder="${placeholder}"><br>
        `;
    }
};

// Fungsi untuk membuat elemen button
const button = (id, label) => {
    return `<button id="${id}">${label}</button>`;
};

// Fungsi untuk membuat elemen div
const div = (id) => {
    return `<div id="${id}"></div>`;
};

// Fungsi untuk memuat data ke dalam elemen HTML
const loadData = (data, element) => {
    // Membuat variabel untuk menyimpan HTML content
    let htmlContent = "";

    data.forEach((item, index) => {
        htmlContent += `
        <div class="product" style="display: flex; flex-direction: column; align-items: center; margin-right: 10px;">
            <img src="${item.gambar}" alt="Gambar ${item.nama}" style="max-width: 100px;">
            <p>
                ${item.nama}<br>
                Harga: ${item.harga} 
            </p>
            <button onclick="editData(${index})">Edit</button>
            <button onclick="deleteData(${index})">Hapus</button>
        </div>
        `;
    });

    // Set HTML content ke dalam elemen
    element.innerHTML = htmlContent;

    // Mengatur tampilan flex container setelah menambahkan konten
    element.style.display = "flex";
    element.style.flexWrap = "wrap";
};


// Fungsi untuk menyimpan data ke dalam Local Storage
const saveDataToLocalStorage = (data) => {
    localStorage.setItem("myData", JSON.stringify(data));
};

// Fungsi untuk mengambil data dari Local Storage
const getDataFromLocalStorage = () => {
    const savedData = localStorage.getItem("myData");
    return savedData ? JSON.parse(savedData) : [];
};

// Fungsi untuk menampilkan preview gambar
const previewImage = (event) => {
    const preview = document.getElementById("preview");
    const previewText = document.getElementById("previewText"); // Ambil elemen <span> yang ditambahkan
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
        preview.style.display = "block";
    }

    if (file) {
        reader.readAsDataURL(file);
        previewText.textContent = file.name; // Menampilkan judul gambar (nama file)
    } else {
        preview.src = "";
        previewText.textContent = ""; // Mengosongkan judul gambar jika tidak ada gambar yang dipilih
    }
};

// Variabel untuk menyimpan data dari Local Storage
let data = getDataFromLocalStorage(); // Mengambil data dari Local Storage saat halaman dimuat

// Menambahkan elemen input dan button ke dalam body
// Menambahkan elemen input dan button ke dalam body
document.body.innerHTML += input("namaBarang", "text", "Nama Barang", "Masukkan Nama Barang");
document.body.innerHTML += input("hargaBarang", "number", "Harga Barang", "Masukkan Harga Barang");
document.body.innerHTML += input("gambarBarang", "file", "Gambar Barang", "Pilih Gambar");
document.body.innerHTML += button("btnSimpan", "Simpan");
document.body.innerHTML += button("btnClear", "Clear"); // Menambahkan tombol Clear
document.body.innerHTML += div("dataList");

// Menangani klik pada button Clear
document.getElementById("btnClear").addEventListener("click", () => {
    clear(); // Memanggil fungsi clear() saat tombol Clear diklik
});

// Fungsi untuk menghapus input setelah menyimpan atau membatalkan
const clear = () => {
    namaBarang.value = ""; // Mengatur nilai input namaBarang menjadi kosong
    hargaBarang.value = ""; // Mengatur nilai input hargaBarang menjadi kosong
    document.getElementById("gambarBarang").value = null; // Mengatur nilai input gambarBarang menjadi null
    document.getElementById("preview").src = ""; // Mengatur sumber gambar pada preview menjadi kosong
    id = null;
};


// Memuat data ke dalam elemen dataList
const dataList = document.getElementById("dataList");
loadData(data, dataList);

// Menangani klik pada button Simpan
document.getElementById("btnSimpan").addEventListener("click", async () => {
    if (id == null) {
        const newProduct = {
            'nama': namaBarang.value,
            'harga': hargaBarang.value,
            'gambar': document.getElementById("preview").src // Simpan lokasi gambar yang dipilih
        };
        try {
            const response = await fetch("https://reqres.in/api/makanan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) {
                throw new Error('Gagal menyimpan data ke server');
            }
            const responseData = await response.json();
            console.log(responseData);
            newProduct.id = responseData.id; // Menyimpan id yang diberikan oleh server
            data.push(newProduct); // Tambahkan data baru ke dalam array lokal
            saveDataToLocalStorage(data); // Simpan data ke Local Storage setelah perubahan
            loadData(data, dataList);
            clear();
        } catch (error) {
            console.error('Gagal menambahkan data:', error);
        }
    } else {
        const updatedProduct = {
            'nama': namaBarang.value,
            'harga': hargaBarang.value,
            'gambar': document.getElementById("preview").src // Simpan lokasi gambar yang dipilih
        };
        try {
            const response = await fetch(`https://reqres.in/api/makanan/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct)
            });
            if (!response.ok) {
                throw new Error('Gagal memperbarui data di server');
            }
            const responseData = await response.json();
            console.log(responseData);
            data[id] = updatedProduct; // Perbarui data di dalam array lokal
            saveDataToLocalStorage(data); // Simpan data ke Local Storage setelah perubahan
            loadData(data, dataList);
            clear();
        } catch (error) {
            console.error('Gagal memperbarui data:', error);
        }
    }

    // Sembunyikan gambar setelah menyimpan data
    document.getElementById("preview").style.display = "none";
});

 

