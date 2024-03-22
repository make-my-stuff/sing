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
    notes.play("A4", 4);
});