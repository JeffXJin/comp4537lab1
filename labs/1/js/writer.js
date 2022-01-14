const MESSAGE_NOT_SUPPORTED = "Web storage is not supported";
const NOTES_JSON = "notesJSON";
const NOTE_0 = "note0";
const BUTTON_0 = "removeBtn0";

let notesJSON = {
    "note0": "",
}

let buttonsArray = [];
let removedNotes = [];
/**
 * Button object constructor
 */
function Button(btnID, noteID) {
    this.id = btnID;
    this.noteID = noteID;

    this.removeBtn = function () {
        return function () {
            removedNotes.push(noteID.slice(-1));

            noteCounter--;

            let obj = document.getElementById(this.parentNode.id);
            console.log("Removed " + noteID);
            obj.remove();
            delete notesJSON[noteID];
        }
    };
}

let note = document.createElement("div");
note.innerHTML = "<div id=\"note0\" class=\"input-group mb-3 note\">" +
    "            <textarea id=\"textarea\" placeholder=\"Write note\"><\/textarea>" +
    "            <button id=\"removeBtn0\" type=\"button\" class=\"btn btn-secondary\">Remove<\/button>" +
    "        <\/div>";

let noteCounter = 0;

buttonsArray.push(new Button(BUTTON_0, "note0"));
document.getElementById(BUTTON_0).onclick = buttonsArray[0].removeBtn();

// Check if storage is valid
if (typeof (Storage) == "undefined") {
    document.write(MESSAGE_NOT_SUPPORTED);
    window.stop();
}

/**
 * Retrieves notes (If in local storage) and displays to page
 */
function retrieveNotes() {
    let retrievedNotesJSON = localStorage.getItem(NOTES_JSON);

    if (retrievedNotesJSON != null) {
        let notesJSON = JSON.parse(retrievedNotesJSON)

        for (let i in notesJSON) {
            if (notesJSON[i] != "") {
                addTextArea(notesJSON[i]);
            }
        }
    }
}

retrieveNotes();

/**
 * Adds a note text area with remove button
 */
function addTextArea(text) {

    let clone = note.firstChild.cloneNode(true);
    let newNoteNum = noteCounter;

    if (removedNotes.length == 0) {
        clone.id = "note" + ++noteCounter;

    } else {
        clone.id = "note" + removedNotes[removedNotes.length - 1];
        newNoteNum = removedNotes[removedNotes.length - 1];
        ++noteCounter;
    }

    document.getElementById("notesSection").appendChild(clone);

    let parent = clone;
    let childNote = parent ? parent.querySelector('#textarea') : null;
    let childButton = parent ? parent.querySelector('#removeBtn0') : null;

    // Remove text from cloned textarea
    if (text == null) {
        text = "";
    }

    childNote.value = text;
    if (removedNotes.length == 0) {
        childButton.setAttribute("id", ("removeBtn" + noteCounter));

        buttonsArray.push(new Button(childButton.id, clone.id));

        document.getElementById(childButton.id).onclick = buttonsArray[noteCounter].removeBtn()
    } else {
        childButton.setAttribute("id", ("removeBtn" + newNoteNum));

        buttonsArray.push(new Button(childButton.id, clone.id));

        document.getElementById(childButton.id).onclick = buttonsArray[newNoteNum].removeBtn()
        removedNotes.pop();

    }

    console.log("Added " + clone.id);
    console.log("Added " + childButton.id);
}

/**
 * Button handler for adding a new note
 */
function addNote() {
    return function () {
        addTextArea();
    }
}

document.getElementById("addBtn").onclick = addNote();

/**
 * Removes current note from document
 */
function removeTextArea() {
    return function () {
        console.log("Removed " + this.parentNode.id);
    }
}

/**
 * Function that formats the time to 12 hour clock
 */
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes + ":" + date.getSeconds() + ampm;
    return time;
}

/**
 * Function that displays the formatted most recent updated notes
 */
function updateTime() {
    document.getElementById("storedTime").innerHTML = formatTime(new Date());
}

/**
 * Function that saves the notes to local storage every two seconds
 */
setInterval(function () {
    console.log("Notes:")

    let notesSection = document.getElementById("notesSection");

    const prevNotes = localStorage.getItem(NOTES_JSON);

    for (let i = 0; i <= noteCounter; i++) {
        let noteID = notesSection.children[i].id;
        let noteContent = document.getElementById(noteID).children[0].value;
        if (noteContent != "") {
            notesJSON[noteID] = noteContent;
        }
        if (prevNotes != JSON.stringify(notesJSON)) {
            updateReader = true;
            localStorage.setItem("updateReader", formatTime(new Date()));
            updateTime();
        }
    }

    console.log(JSON.stringify(notesJSON));
    localStorage.setItem(NOTES_JSON, JSON.stringify(notesJSON));
}, 3000);
