const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAc14sGGh4GkLDL28BRDaVtGPHHYaYSzZ8",
  authDomain: "modern-javascript-5a9c3.firebaseapp.com",
  databaseURL: "https://modern-javascript-5a9c3-default-rtdb.firebaseio.com",
  projectId: "modern-javascript-5a9c3",
  storageBucket: "modern-javascript-5a9c3.appspot.com",
  messagingSenderId: "139331487950",
  appId: "1:139331487950:web:84c54017d631af4cdde89f",
  measurementId: "G-S01M941EDN",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

var selectedRow = null;

function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-{className"}`;

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);

  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}
function showSuccess(message, className) {
  const div = document.createElement("div");

  div.className = `success success-{className"}`;

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);

  setTimeout(() => document.querySelector(".success").remove(), 3000);
}
function clearField() {
  document.querySelector("#name").value = "";
}

// add data

const addMembers = (members, id) => {
  const list = document.querySelector("#crew-list");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td data-id="${id}" colspan="3">${members.Argonaute}</td>
        <td>
          <a href="#" class="edit">Modifier</a>
          <a href="#" class="delete">Supprimer</a>
        </td>
      `;
  list.appendChild(row);
};

// delete data

const deleteMember = (id) => {
  const members = document.querySelectorAll("td");
  members.forEach((member) => {
    if (member.getAttribute("data.id") === id) {
      member.remove();
      showAlert("Argonaute supprimer");
    }
  });
};

// realtime data

db.collection("members").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;
    if (change.type === "added") {
      addMembers(doc.data(), doc.id);
    } else if (change.type === "removed") {
      deleteMember(doc.id);
    }
  });
});

// add

document.querySelector("#argonaute-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;

  if (name == "") {
    showAlert("Entrez le nom d'un Argonaute");
  } else if (selectedRow == null) {
    db.collection("members")
      .add({
        Argonaute: name,
      })
      .then(() => {
        showSuccess("Et 1 Argonaute de plus !");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  clearField();
});

// edit

document.querySelector("#crew-list").addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("edit")) {
    const id =
      e.target.parentElement.previousElementSibling.getAttribute("data-id");
    const editRow = target.parentElement.parentElement;
    editRow.innerHTML = `
    <td data-id="${id}" colspan="3">
      <textarea name="" id="text" cols="20" rows="1"></textarea>
    </td>
    <td>
      <a href="#" class="confirm">Valider</a>
      <a href="#" class="delete">Supprimer</a>
    </td>
  `;
  } else if (target.classList.contains("confirm") && text.value !== "") {
    const id =
      e.target.parentElement.previousElementSibling.getAttribute("data-id");
    const editRow = target.parentElement.parentElement;
    const newValue = text.value;
    editRow.innerHTML = `
    <td data-id="${id}" colspan="3">${text.value}</td>
    <td>
      <a href="#" class="edit">Modifier</a>
      <a href="#" class="delete">Supprimer</a>
    </td>
  `;
    db.collection("members")
      .doc(id)
      .update({
        Argonaute: newValue,
      })
      .then(() => {
        showSuccess("Nom de l'Argonaute modifié avec succes");
      });
  } else if (target.classList.contains("confirm")) {
    showAlert("Entrez le nom d'un Argonaute");
  }
});

// delete

document.querySelector("#crew-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.parentElement.remove();
    showAlert("Argonaute supprimer");
    const id =
      e.target.parentElement.previousElementSibling.getAttribute("data-id");
    db.collection("members")
      .doc(id)
      .delete()
      .then(() => {});
  }
});
