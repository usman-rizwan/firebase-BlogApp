// var toolbarOptions = [
//     ["bold", "italic", "underline", "strike"], // toggled buttons
//     ["blockquote", "code-block"],

//     [{ header: 1 }, { header: 2 }], // custom button values
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ script: "sub" }, { script: "super" }], // superscript/subscript
//     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//     [{ direction: "rtl" }], // text direction

//     [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],

//     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//     [{ font: [] }],
//     [{ align: [] }],

//     ["clean"], // remove formatting button
// ];

var quill = new Quill("#editor", {
    theme: "snow",
});
import {
    app, collection, addDoc, setDoc, doc, db, serverTimestamp ,getDocs ,onSnapshot ,orderBy ,query ,limit
} from "/firebase.js";

let title = document.getElementById("title");
let card = document.getElementById("card");
let btnText = document.getElementById("btnText");
let loader = document.getElementById("loader");
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
                timestamp: serverTimestamp()
            });

            btnText.style.display = "block";
            blogBtn.disabled = false;
            loader.style.display = "none";
            console.log("Document written with ID: ", docRef.id);
            // console.log(editorContent);
      
            title.value = ""
            quill.root.innerHTML = "";
        }
        catch (error) {
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
            }
        });
        Toast.fire({
            icon: "error",
            title: "Both title and post fields are required "
        });
    }
};

let blogBtn = document.getElementById("blogBtn");
blogBtn && blogBtn.addEventListener("click", addBlog);

let getBlogData = async () => {
    card.innerHTML = `<div class="text-center">
     <div class="spinner-border text-primary" role="status" id="loader" style="width: 80px; height: 80px; ">
    <span class="visually-hidden">Loading...</span>
  </div>
  </div> `
 
    const q =  query(collection(db, "blogs") , orderBy("timestamp" , "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const blogsData = [];
       card.innerHTML = ""
      querySnapshot.forEach((doc) => {
        blogsData.push(doc.data());
        card.innerHTML += ` <div class="card mt-4" >         
        <div class="card-body">
        <h4 class="card-title text-capitalize">Title: ${doc.data().title}</h4>
        <hr/>
        <p class="card-text">${doc.data().blogContent}</p>
        <div class="d-flex justify-content-end">
            <!-- Edit Icon -->
            <button type="button" class="btn btn-warning mx-2">
                <i class="fas fa-edit"></i> Edit
            </button>
            <!-- Delete Icon -->
            <button type="button" class="btn btn-danger">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </div>
        </div>
        </div>`;
      });
  
      console.log(blogsData);
    });
    
}
getBlogData()
