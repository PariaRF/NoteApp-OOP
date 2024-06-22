export default class NotesView{
    constructor(root,handlers){
        const {onNoteAdd, onNoteEdit, onNoteSelecte, onNoteDelete} = handlers;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteSelecte = onNoteSelecte;
        this.onNoteDelete = onNoteDelete;
        this.root = root;

        this.root.innerHTML = `
        <button class="toggle-sidebar">
            <i class="fa fa-chevron-circle-left"></i>
        </button>
        <div class="note__app">
            <div class="note__sidebar">
                <div class="note__logo">
                   <h1>NOTE APP</h1> 
                </div>
                <div class="note__list">
                    
                </div>
                <div class="note__add">
                    <button class="note__add__btn add-desktop-mode">Add Note</button>
                </div>
            </div>
            <div class="note__main">
                <input placeholder="New Note..." type="text" class="main__input">
                <textarea placeholder="Take Note..." class="main__textarea"></textarea>
                <button class="note__add__btn add-mobile-mode">Add Note</button>
            </div>
        </div>
        `;

        // SELECTS  
        const toggleSidebarBtn = this.root.querySelector(".toggle-sidebar");
        const noteSidebar = this.root.querySelector(".note__sidebar");
        const noteMain = this.root.querySelector(".note__main");
        const noteAddBtns = this.root.querySelectorAll(".note__add__btn");
        const inputTitle = this.root.querySelector(".main__input");
        const inputDesc = this.root.querySelector(".main__textarea");

        // EVENTS
        toggleSidebarBtn.addEventListener("click", toggleSidebar);
        noteAddBtns.forEach(btn => {
            btn.addEventListener("click", ()=> this.onNoteAdd())
        });
        [inputTitle, inputDesc].forEach(inputField => {
            inputField.addEventListener("blur",()=>{
                let newTitle = "";
                let newDesc = "";
                if(inputTitle.value !== "") {
                    newTitle = inputTitle.value.trim();
                }
               if(inputDesc.value !== ""){
                    newDesc = inputDesc.value.trim();
               }
               this.onNoteEdit(newTitle, newDesc);
            })
        });

        // FUNCTIONS
        function toggleSidebar(){
            noteSidebar.classList.toggle("open--sidebar");
            toggleSidebarBtn.classList.toggle("toggle-sidebar--open");
            noteMain.classList.toggle("note__main--width");
        }
        // this.updateNotePreviewVisiblity(true)

    }

    _createListItemHTML(id, title, desc, createAt){
        const MAX_BODY_LENGTH = 27;
        return`
            <div class="list__item" data-note-id="${id}">
                <div class="list__item__header">
                    <h4 class="list__item__title">${title}</h4>
                    <i class="far fa-trash-alt list__item__delete" data-note-id="${id}"></i>
                </div>
                <p class="list__item__desc">
                ${desc.substring(0, MAX_BODY_LENGTH)}
                ${desc.length > MAX_BODY_LENGTH ? "..." : ""}
                </p>
                <span class="list__item__date">${new Date(createAt).toLocaleString("en",{dateStyle: "full", timeStyle: "short"})}</span>
            </div>
            <div class="note__list__divider"></div>
        `;
    }

    updateNoteList(notes){
        const noteList = this.root.querySelector(".note__list");
        

        noteList.innerHTML = "";
        let notesListItem = "";
        for(const note of notes){
            const {id, title, desc, createAt} = note;
            const listItemHtml = this._createListItemHTML(id, title, desc, createAt);
            notesListItem += listItemHtml;
        }

        noteList.innerHTML = notesListItem;
        noteList.querySelectorAll(".list__item").forEach(note=>{
            note.addEventListener("click", ()=>{
                this.onNoteSelecte(note.dataset.noteId)
            })
        })

        const listItemDelete = noteList.querySelectorAll(".list__item__delete");
        listItemDelete.forEach(item =>{
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                this.onNoteDelete(item.dataset.noteId);
            })
        })
    }

    updateActiveNote(note){
        this.root.querySelector(".main__input").value = note.title;
        this.root.querySelector(".main__textarea").value = note.desc;

        const allItem = this.root.querySelectorAll(".list__item");
        allItem.forEach(item => {
            item.classList.remove("list__item--selected");
        })

        const selectedItem = this.root.querySelector(`.list__item[data-note-id="${note.id}"`);
        selectedItem.classList.add("list__item--selected");
    }

    // updateNotePreviewVisiblity(visible){
    //     this.root.querySelector(".note__main").style.visibility = visible ? "visible" : "hidden";
    // }
}