let retrievedNotesJSON = localStorage.getItem("notesJSON");
let notesJSON = JSON.parse(retrievedNotesJSON)
let notesLength = (Object.keys(notesJSON).length);

for (let i in notesJSON) {
    if (notesJSON[i] != "") {
        const newNote = document.createElement("div");
        newNote.setAttribute("id", "note");

        const newText = document.createTextNode(notesJSON[i]);
        newNote.appendChild(newText);

        const notesSection = document.getElementById("notesSection");
        document.body.insertBefore(newNote, notesSection);
    }
}

/**
 * Function that retrieves notes from local storage every 2 seconds
 * Displays notes to the page
 */
setInterval(function () {
    retrievedNotesJSON = localStorage.getItem("notesJSON");
    let time = localStorage.getItem("updateReader");
    
    if (time != null) {
        document.getElementById("storedTime").innerHTML = time;
    }

    console.log("Notes:");
    console.log(retrievedNotesJSON);
}, 3000);
