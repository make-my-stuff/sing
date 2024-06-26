function playNote() {
    // create a synth
    const synth = new Tone.Synth().toDestination();
    // play a note from that synth
    synth.triggerAttackRelease("C4", "8n");
}

document.querySelector("#tonePlay").addEventListener("click", (evt) => {
    playNote();
});

document.querySelector("#notePlay").addEventListener("click", (evt) => {
    const notes = new Notes();
    notes.play("C4", 4);
});

const setupPiano = (elem) => {
    const notes = new Notes();
    const piano = new Piano();
    piano.setOctaves([3,4,5]);
    piano.setPlayer(noteName => {
        console.log("Playing:", noteName);
        notes.play(noteName);
    });
    document.querySelector("#piano").appendChild(piano.generate());
}

setupPiano();


const staff = new Staff();
const melodyTablature = {
    title: "Melody",
    tuning: ["E", "A", "D", "G", "B", "E"],
    tempo: 60,
    timeSignature: '4/4',
    notes: [
        { 'note': 'C4', 'duration': 1},
        { 'note': 'D4', 'duration': 1},
        { 'note': 'E4', 'duration': 1},
        { 'note': 'F4', 'duration': 1},
        { 'note': 'G4', 'duration': 1},
        { 'note': 'A4', 'duration': 1},
        { 'note': 'B4', 'duration': 1},
        { 'note': 'C5', 'duration': 1},
        { 'note': 'C5', 'duration': 1},
        { 'note': 'B4', 'duration': 1},
        { 'note': 'A4', 'duration': 1},
        { 'note': 'G4', 'duration': 1},
        { 'note': 'F4', 'duration': 1},
        { 'note': 'E4', 'duration': 1},
        { 'note': 'D4', 'duration': 1},
        { 'note': 'C4', 'duration': 1},
    ]
};
staff.setTablature(melodyTablature);

document.querySelector("#playMusic").addEventListener("click", (evt) => {
    staff.play();
});
document.querySelector("#pauseMusic").addEventListener("click", (evt) => {
    staff.pause();
});
document.querySelector("#resumeMusic").addEventListener("click", (evt) => {
    staff.resume();
});
