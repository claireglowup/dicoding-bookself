/** @format */

// /** @format */

//show tambah buku
const buttonAdd = document.getElementById("add-book");

let containerAdd = document.getElementById("container-add");
buttonAdd.addEventListener("click", () => {
  if (window.getComputedStyle(containerAdd).getPropertyValue("display") === "none") {
    containerAdd.style.display = "block";
    containerAdd.classList.toggle("show");
    buttonAdd.innerText = "Sembunyikan";
  } else {
    containerAdd.style.display = "none";
    buttonAdd.innerText = "Tambah Buku";
  }
});

//form action

const RENDER_EVENT = "render-books";
const storageKey = "secret";
let books = JSON.parse(localStorage.getItem(storageKey));
if (books === null) {
  books = [];
}

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form-add");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
});

addBook = () => {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;
  const tahun = document.getElementById("tahun").value;
  const dibaca = document.getElementById("dibaca").checked;

  const generatedID = generateID();
  const bookObject = generateBookObject(generatedID, judul, penulis, tahun, dibaca);
  books.push(bookObject);

  localStorage.setItem(storageKey, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

generateID = () => {
  return +new Date();
};

generateBookObject = (id, judul, penulis, tahun, dibaca) => {
  return {
    id,
    judul,
    penulis,
    tahun,
    dibaca,
  };
};

document.addEventListener(RENDER_EVENT, () => {
  const sudahBaca = document.getElementById("sudahbaca");
  const belumBaca = document.getElementById("blumbaca");

  sudahBaca.innerHTML = "";
  belumBaca.innerHTML = "";

  let bookElement;

  books.forEach((book) => {
    bookElement = makeBook(book);

    if (book.dibaca) {
      sudahBaca.append(bookElement);
    } else {
      belumBaca.append(bookElement);
    }
  });
});

makeBook = (book) => {
  const judul = document.createElement("h3");
  judul.innerText = `Judul : ${book.judul}`;

  const penulis = document.createElement("p");
  penulis.innerText = `Penulis : ${book.penulis}`;

  const tahun = document.createElement("p");
  tahun.innerText = `Tahun terbit : ${book.tahun}`;

  const wrap = document.createElement("div");
  wrap.classList.add("book");
  wrap.append(judul, penulis, tahun);

  const buttonWrap = document.createElement("div");
  buttonWrap.classList.add("button");

  if (book.dibaca) {
    const sudahDibacaBtn = document.createElement("button");
    sudahDibacaBtn.classList.add("belumselesai-baca");
    sudahDibacaBtn.innerText = "Belum selesai dibaca";

    sudahDibacaBtn.addEventListener("click", () => {
      addBookToSudahDibaca(book.id);
    });

    const hapusBtn = document.createElement("button");
    hapusBtn.classList.add("hapus-buku");
    hapusBtn.innerText = "Hapus buku";

    hapusBtn.addEventListener("click", () => {
      DeleteBook(book.id);
    });
    buttonWrap.append(sudahDibacaBtn, hapusBtn);

    wrap.append(buttonWrap);
  } else {
    const belumDibacaBtn = document.createElement("button");
    belumDibacaBtn.classList.add("selesai-baca");
    belumDibacaBtn.innerText = "Selesai dibaca";

    belumDibacaBtn.addEventListener("click", () => {
      repeatRead(book.id);
    });

    const hapusBtn = document.createElement("button");
    hapusBtn.classList.add("hapus-buku");
    hapusBtn.innerText = "Hapus buku";

    hapusBtn.addEventListener("click", () => {
      DeleteBook(book.id);
    });

    buttonWrap.append(belumDibacaBtn, hapusBtn);

    wrap.append(buttonWrap);
  }

  return wrap;
};

findBook = (id) => {
  for (const book of books) {
    if (id === book.id) {
      return book;
    }
  }

  return null;
};

findBookIndex = (id) => {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }

  return -1;
};

addBookToSudahDibaca = (id) => {
  const book = findBook(id);

  if (book === null) return;

  book.dibaca = false;
  localStorage.setItem(storageKey, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));
};

DeleteBook = (id) => {
  const bookIndex = findBookIndex(id);

  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  localStorage.setItem(storageKey, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));
};

repeatRead = (id) => {
  const book = findBook(id);
  if (book === null) return;

  book.dibaca = true;
  localStorage.setItem(storageKey, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER_EVENT));
};
