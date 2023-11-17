function id(arg) {
    return document.getElementById(arg);
}
var tempo = -id("tempo").value * 10;
var notes = [130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9, 261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9, 523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740.0, 784.0, 830.6, 880.0, 932.3, 987.8, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951, 4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902];
id("tempo").onchange = function () {
    tempo = -id("tempo").value * 10;
}
id("arpSpeed").onchange = function () {
    arpSpeed = -id("arpSpeed").value;
}
id("volume").onchange = function () {
    volume = -id("volume").value * 0.01;
}

var arpSpeed = -id("arpSpeed").value;
var DO = [];
var DO1 = [];
var RE = [];
var RE1 = [];
var MI = [];
var FA = [];
var FA1 = [];
var SOL = [];
var SOL1 = [];
var LA = [];
var LA1 = [];
var SI = [];
for (let i = 0; i < notes.length; i++) {
    switch (i % 12) {
        case 0:
            DO.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 1:
            DO1.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 2:
            RE.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 3:
            RE1.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 4:
            MI.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 5:
            FA.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 6:
            FA1.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 7:
            SOL.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 8:
            SOL1.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 9:
            LA.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 10:
            LA1.push({
                frequency: notes[i],
                i: i
            });
            break;
        case 11:
            SI.push({
                frequency: notes[i],
                i: i
            });
            break;
    }
}
var arpeggio = true;

function playChord(note, type) {
    playNote(note.frequency);
    switch (type) {
        case "mag":
            if (arpeggio) {
                setTimeout(function () {
                    playNote(notes[note.i + 4]);
                }, arpSpeed)
                setTimeout(function () {
                    playNote(notes[note.i + 7]);
                }, arpSpeed * 2)
            } else {
                playNote(notes[note.i + 4]);
                playNote(notes[note.i + 7]);
            }
            break;
        case "min":
            if (arpeggio) {
                setTimeout(function () {
                    playNote(notes[note.i + 3]);
                }, arpSpeed)
                setTimeout(function () {
                    playNote(notes[note.i + 7]);
                }, arpSpeed * 2)
            } else {
                playNote(notes[note.i + 3]);
                playNote(notes[note.i + 7]);
            }
            break;
        case "set":
            if (arpeggio) {
                setTimeout(function () {
                    playNote(notes[note.i + 4]);
                }, arpSpeed)
                setTimeout(function () {
                    playNote(notes[note.i + 7]);
                }, arpSpeed * 2)
                setTimeout(function () {
                    playNote(notes[note.i + 10]);
                }, arpSpeed * 3)
            } else {
                playNote(notes[note.i + 4]);
                playNote(notes[note.i + 7]);
                playNote(notes[note.i + 10]);
            }
            break;
    }
}
var contextes = [];
var volume = -id("volume").value * 0.01;

function playNote(frequency, flag) {
    let context = new AudioContext();
    let o = context.createOscillator();
    let g = context.createGain();
    let freq = frequency;

    if (flag) {
        for (let i = 0; i < notes.length; i++) {
            if (freq == notes[i]) {
                freq = notes[i + 24];
                break;
            }
        }
    }
    
    g.connect(context.destination);
    //console.log(frequency);
    o.frequency.value = freq;
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 2);

    o.connect(g);
    contextes.push(context);
    if (contextes.length >= 10) {
        contextes[contextes.length - 10].close();
    }

    o.start(volume)
}
var melodyOn=true;
id("melody").onchange=function(){
    melodyOn=!melodyOn;
}
var notesInChords;
var ST = setTimeout(function () {}, 1000);
var btn1 = id("generate");
btn1.onclick = function () {

    clearTimeout(ST);
    var chords = generateChords();
    notesInChords = findNotes(chords);
    if (melodyOn) {
        playMelody(notesInChords);
    }
    for (let i = 0; i < chords.length; i++) {
        id("" + i).innerHTML = chords[i].note + " " + chords[i].type;
    }
    var iter = 0;

    function x() {
        ST = setTimeout(x, tempo);
        switchChord(chords, iter);
        iter++;
        if (iter >= chords.length) {
            iter = 0;
        }
    }
    x();


}
var y=setTimeout(function () {},1000);
function playMelody(notesInChords) {
    clearTimeout(y);
    let nIC = notesInChords;
    playNote(nIC[Math.random() * nIC.length | 0], 1);
    y=setTimeout(function () {
        playMelody(notesInChords)
    }, tempo / (Math.random() * 8 | 0 + 1) * 2);
    console.log(nIC)
}

function findNotes(chords) {
    let notesList = [];
    let note;
    for (let i = 0; i < chords.length; i++) {
        switch (chords[i].note) {
            case "DO":
                note = DO[0];
                break;
            case "DO#":
                note = DO1[0];
                break;
            case "RE":
                note = RE[0];
                break;
            case "RE#":
                note = RE1[0];
                break;
            case "MI":
                note = MI[0];
                break;
            case "FA":
                note = FA[0];
                break;
            case "FA#":
                note = FA1[0];
                break;
            case "SOL":
                note = SOL[0];
                break;
            case "SOL#":
                note = SOL1[0];
                break;
            case "LA":
                note = LA[0];
                break;
            case "LA#":
                note = LA1[0];
                break;
            case "SI":
                note = SI[0];
                break;
        }
        switch (chords[i].type) {
            case "mag":
                notesList.push(notes[note.i], notes[note.i + 4], notes[note.i + 7])
                break;
            case "min":
                notesList.push(notes[note.i], notes[note.i + 3], notes[note.i + 7])
                break;
            case "set":
                notesList.push(notes[note.i], notes[note.i + 4], notes[note.i + 7], notes[note.i + 10])
                break;
        }
    }
    for (let i = 0; i < notesList.length; i++) {
        for (let j = i + 1; j < notesList.length; j++) {
            if (notesList[i] == notesList[j]) {
                notesList.splice(j);
                j--;
            }
        }
    }
    return notesList;
}

function switchChord(chords, iter) {
    switch (chords[iter].note) {
        case "DO":
            playChord(DO[1], chords[iter].type);
            break;
        case "DO#":
            playChord(DO1[1], chords[iter].type);
            break;
        case "RE":
            playChord(RE[1], chords[iter].type);
            break;
        case "RE#":
            playChord(RE1[1], chords[iter].type);
            break;
        case "MI":
            playChord(MI[1], chords[iter].type);
            break;
        case "FA":
            playChord(FA[1], chords[iter].type);
            break;
        case "FA#":
            playChord(FA1[1], chords[iter].type);
            break;
        case "SOL":
            playChord(SOL[1], chords[iter].type);
            break;
        case "SOL#":
            playChord(SOL1[1], chords[iter].type);
            break;
        case "LA":
            playChord(LA[1], chords[iter].type);
            break;
        case "LA#":
            playChord(LA1[1], chords[iter].type);
            break;
        case "SI":
            playChord(SI[1], chords[iter].type);
            break;
    }
    id("0").style.color = "gray";
    id("1").style.color = "gray";
    id("2").style.color = "gray";
    id("3").style.color = "gray";
    id("" + iter).style.color = "black";
}

function generateChords() {
    let noteList = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
    let type = ["mag", "min", "set"];
    return [
        {
            note: noteList[Math.random() * 12 | 0],
            type: type[Math.random() * 2 | 0]
        },
        {
            note: noteList[Math.random() * 12 | 0],
            type: type[Math.random() * 2 | 0]
        },
        {
            note: noteList[Math.random() * 12 | 0],
            type: type[Math.random() * 2 | 0]
        },
        {
            note: noteList[Math.random() * 12 | 0],
            type: type[Math.random() * 2 | 0]
        }
    ]
}
