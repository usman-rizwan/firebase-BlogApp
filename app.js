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

let getBlogData = () => {
  let card = document.getElementById("card");
  let blogLoader = document.getElementById("blogLoader");
  blogLoader.innerHTML = `<div class="text-center">
     <div class="spinner-border text-primary" role="status" id="loader" style="width: 80px; height: 80px; ">
    <span class="visually-hidden">Loading...</span>
  </div>
  </div> `;

  const ref = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(ref, (data) => {
    blogLoader.innerHTML = "";
    const bArray = [];
    // card.innerHTML = "" 
    data.docChanges().forEach((change) => {
      bArray.push(change.doc.data());
      console.log("change >>>", change);
      console.log("Araay >>>", bArray);
      console.log("This is change", change.doc.data());
      if (change.type == "removed") {
        let deleteBLog = document.getElementById(change.doc.id);
        deleteBLog.remove();
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
          icon: "success",
          title: "Post deleted successfully",
        });
      } else {
        card.innerHTML += ` <div class="card mt-4" id='${
          change.doc.id
        }' >         
     <div class="card-body">
         <h4 class="card-title text-capitalize">Title: ${
           change.doc.data().title
         }</h4>
    <hr/>
        <p class="card-text">${change.doc.data().blogContent}</p>
    <div class="d-flex justify-content-end">
    <!-- Edit Icon -->
         <button type="button" onclick="editBlog('${
           change.doc.id
         }')" class="btn btn-warning mx-2">
            <i class="fas fa-edit"></i> Edit
 </button>
            <!-- Delete Icon -->
            <button type="button" onclick="delData('${
              change.doc.id
            }')" class="btn btn-danger">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
         </div>
        </div>
        </div>`;
      }
    });
  });
};
getBlogData();
// window.onload = getBlogData;

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
      console.log("Document written with ID: ", docRef.id)
      // console.log(editorContent);
      title.value = "";
      quill.root.innerHTML = "";
    } catch (error) {
      console.log("error ===>", error);
      btnText.style.display = "block";
      blogBtn.disabled = false;
      loader.style.display = "none";
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
      title: "Both title and post fields are required ",
    });
  }
};

let blogBtn = document.getElementById("blogBtn");
blogBtn && blogBtn.addEventListener("click", addBlog);

let delData = async (id) => {
  // console.log(id);
  try {
    await deleteDoc(doc(db, "blogs", id));
    console.log(`Post of id ${id} deleted`);
  } catch (error) {
    console.log(error);
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
      title: "Action Failed , Please Try Again:(",
    });
  }
};
window.delData = delData;

let editBlog = (id) => {
    console.log(id);
};
window.editBlog = editBlog;