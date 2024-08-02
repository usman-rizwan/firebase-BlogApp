var toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["clean"], // remove formatting button
];

var quill = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: "snow",
});

import {
  app,
  collection,
  addDoc,
  setDoc,
  doc,
  db,
  serverTimestamp,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  limit,
  deleteDoc,
  updateDoc,
} from "/firebase.js";

let title = document.getElementById("title");
let btnText = document.getElementById("btnText");
let loader = document.getElementById("loader");

let card = document.getElementById("card");
let blogLoader = document.getElementById("blogLoader");

let getBlogData = () => {
  blogLoader.innerHTML = `<div class="text-center">
     <div class="spinner-border text-primary" role="status" id="loader" style="width: 80px; height: 80px; ">
    <span class="visually-hidden">Loading...</span>
  </div>
  </div> `;

  const ref = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(ref, (snapshot) => {
    blogLoader.innerHTML = "";
    card.innerHTML = ""; // Clear card content to avoid duplicates
    snapshot.forEach((doc) => {
      let blogData = doc.data();
      card.innerHTML += ` 
        <div class="card mt-4" id='${doc.id}' >         
          <div class="card-body">
            <h4 class="card-title text-capitalize">Title: ${blogData.title}</h4>
            <hr/>
            <p class="card-text">${blogData.blogContent}</p>
            <div class="d-flex justify-content-end">
              <!-- Edit Icon -->
              <button type="button" onclick="editBlog('${doc.id}', '${blogData.blogContent}')" class="btn btn-warning mx-2">
                <i class="fas fa-edit"></i> Edit 
              </button>
              <!-- Delete Icon -->
              <button type="button" onclick="delData('${doc.id}')" class="btn btn-danger">
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
        </div>`;
    });
  });
};
getBlogData();

let addBlog = async () => {
  var editorContent = quill.root.innerHTML;
  if (title.value.trim() && editorContent.trim()) {
    btnText.style.display = "none";
    blogBtn.disabled = true;
    loader.style.display = "flex";
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        title: title.value,
        blogContent: editorContent,
        timestamp: serverTimestamp(),
      });
      btnText.style.display = "block";
      blogBtn.disabled = false;
      loader.style.display = "none";
      title.value = "";
      quill.root.innerHTML = "";
    } catch (error) {
      btnText.style.display = "block";
      blogBtn.disabled = false;
      loader.style.display = "none";
      console.log("Error:", error);
    }
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Both title and post fields are required",
    });
  }
};

let blogBtn = document.getElementById("blogBtn");
blogBtn && blogBtn.addEventListener("click", addBlog);

let delData = async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
    console.log(`Post of id ${id} deleted`);
  } catch (error) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Action Failed, Please Try Again",
    });
    console.log("Error:", error);
  }
};
window.delData = delData;

let editBlog = async (id, bContent) => {
  const docRef = doc(db, "blogs", id);
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: "BLOG",
    inputPlaceholder: "Update Your Blog Content...",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
    inputValue: bContent,
  });

  if (text) {
    try {
      await updateDoc(docRef, {
        blogContent: text,
        timestamp: serverTimestamp(),
      });
      Swal.fire("Updated!", "Your blog has been updated.", "success");
    } catch (error) {
      Swal.fire("Error!", "An error occurred while updating the blog.", "error");
      console.log("Error:", error);
    }
  }
};
window.editBlog = editBlog;
