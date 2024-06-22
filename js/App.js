import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App{
    constructor(root){
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());
        this._refreshNotes();
        this._handlers();
    }

    _refreshNotes(){
        const notes = NotesAPI.getAllNotes();

        // SET NOTES
        this._setNotes(notes);

        // SET ACTIVE NOTE
        if(notes.length > 0) this._setActiveNote(notes[0]);
    }

    _setActiveNote(note){
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _setNotes(notes){
        this.notes = notes;
        this.view.updateNoteList(notes);
    }

    _handlers(){
        return{
            onNoteAdd: () => {
                const newNote = {
                    title: "New Title...",
                    desc: "New Description..."
                }
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (newTitle, newDesc) =>{
                const note = NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title: newTitle,
                    desc: newDesc,
                });
                this._refreshNotes(); 
                // this.view.updateActiveNote(note) 
            },
            onNoteSelecte: (noteId) => {
                const selectedNote = this.notes.find(n => Number(n.id) === Number(noteId));
                this._setActiveNote(selectedNote);
            },
            onNoteDelete: (noteId) => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            }
        }
    }
}
