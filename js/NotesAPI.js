const notes = [
    {
        id: 1,
        title: "first note",
        desc: "some dummy text first",
        createAt: "2024-06-22T07:20:54.787Z"
    },
    {
        id: 2,
        title: "second note",
        desc: "some dummy text second",
        createAt: "2024-06-22T07:34:54.787Z"
    }
];

export default class NotesAPI{
    static getAllNotes(){
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        return savedNotes.sort((a,b)=>{
            return new Date(b.createAt) - new Date(a.createAt)
        })
    }

    static saveNote(note){
        const notes = NotesAPI.getAllNotes();
        const existedNote = notes.find(n => n.id === note.id);
        if(existedNote){
            existedNote.createAt = new Date().toISOString();
            existedNote.title = note.title;
            existedNote.desc = note.desc;
        }else{
            note.id = new Date().getTime();
            note.createAt = new Date().toISOString();
            notes.push(note);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        return notes;
    }

    static deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        const filteredNote = notes.filter(n => Number(n.id) !== Number(id));
        localStorage.setItem("notes", JSON.stringify(filteredNote))
    }
}
