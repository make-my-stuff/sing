const Notes = (function() {
    const oscillatorTypes = ['sine', 'square', 'triangle', 'sawtooth'];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteAliases = {'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'};
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function Notes() {
        this.noteTimber = 'sine';
        this.notesTable = buildNotesTable();

        const _playNote = (noteFrequency, duration, startTime) => {
            let fadeInTime = 0.01;
            let fadeOutTime = 0.01;
        
            let oscillator = audioCtx.createOscillator();
            let gainNode = audioCtx.createGain();
            oscillator.type = this.noteTimber;
            oscillator.frequency.setValueAtTime(noteFrequency, startTime);
            gainNode.gain.setValueAtTime(0, startTime);
        
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        
            gainNode.gain.linearRampToValueAtTime(1, startTime + fadeInTime);
            oscillator.start(startTime);
        
            gainNode.gain.setValueAtTime(1, startTime + duration);
            gainNode.gain.linearRampToValueAtTime(0, startTime + duration + fadeOutTime);
            oscillator.stop(startTime + duration + fadeInTime + fadeOutTime);
        
            this.oscillator = oscillator;
        };
        
        this.play = function(noteToPlay, duration = 1, startTime = 0) {
            const currNote = this.notesTable.find(note => note.note === noteToPlay.toUpperCase());
            if (!currNote) {
                console.error(`Note ${noteToPlay} not found.`);
                return;
            }
            _playNote(currNote.frequency, duration, startTime);
        };
    }

    function buildNotesTable() {
        let notesTable = [];
        for (let octave = 0; octave < 9; octave++) {
            noteNames.forEach((note) => {
                const alias = noteAliases[note] ? `${noteAliases[note]}${octave}` : '';
                notesTable.push({ note: `${note}${octave}`, alias });
            });
        }
        const a4Index = noteNames.indexOf('A') + 4 * 12; // A4 is the 49th note when starting from C0
        notesTable.forEach((item, i) => {
            const distanceFromA4 = i - a4Index; 
            const frequency = 440 * Math.pow(2, distanceFromA4 / 12);
            item.frequency = parseFloat(frequency.toFixed(2));
        });
        return notesTable;
    }

    Notes.prototype.setTimber = function(timber) {
        if (!oscillatorTypes.includes(timber)) {
            console.error(`Invalid timber. Possible values are '${oscillatorTypes.join(", ")}'`);
            return;
        }
        this.noteTimber = timber;
    };

    Notes.prototype.getTimber = function() {
        return this.noteTimber;
    };

    Notes.prototype.getTable = function() {
        return this.notesTable;
    };

    Notes.prototype.getAudioCtx = function() {
        return audioCtx;
    }

    return Notes;
})();

const Staff = (function() {    let _tempo = 90;
    let _tablature = { notes: [] };
    let _timeSignature = [4, 4];
    let _tuning = ["E", "A", "D", "G", "B", "E"];
    let notes = new Notes();
    let isPlaying = false;
    let currentNoteIndex = 0;
    let startTime = 0;
    let startOffset = 0;
    let audioCtx = notes.getAudioCtx();


    function Staff() {
        this.timeouts = [];
    }

    Staff.prototype.setTempo = function(tempo) {
        _tempo = tempo;
    };

    Staff.prototype.getTempo = function() {
        return _tempo;
    };

    Staff.prototype.setTimeSignature = function(timeSignature) {
        let tsComponents = timeSignature.split("/");
        if (tsComponents.length != 2) {
            console.error("Time signature is not in correct format. Eg '4/4'");
            return;
        }
        _timeSignature = tsComponents.map(Number);
    };

    Staff.prototype.getTimeSignature = function() {
        return _timeSignature.join('/');
    };

    Staff.prototype.setTuning = function(tuning) {
        _tuning = tuning;
    }

    Staff.prototype.getTuning = function() {
        return _tuning;
    }

    Staff.prototype.setTablature = function(tablature) {
        if(tablature.tempo) {
            this.setTempo(tablature.tempo);
        }
        if(tablature.timeSignature) {
            this.setTimeSignature(tablature.timeSignature);
        }
        if(tablature.tuning) {
            this.setTuning(tablature.tuning);
        }

        _tablature = tablature;
    };

    Staff.prototype.getTablature = function() {
        return _tablature;
    };

    Staff.prototype.play = function() {
        if (!isPlaying) {
            isPlaying = true;
            startTime = audioCtx.currentTime; // Ensure this is reset on each play
            let currentTime = audioCtx.currentTime;
            const beatDuration = 60 / _tempo;
    
            this.timeouts.forEach(clearTimeout); // Clear existing timeouts before setting new ones
            this.timeouts = [];
    
            for (let i = currentNoteIndex; i < _tablature.notes.length; i++) {
                const noteEntry = _tablature.notes[i];
                const { note, duration } = noteEntry;
                let noteStartTime = startTime + (i - currentNoteIndex) * beatDuration + startOffset;
    
                let timeoutId = setTimeout(() => {
                    notes.play(note, duration * beatDuration, noteStartTime);
                }, (noteStartTime - currentTime) * 1000);
                this.timeouts.push(timeoutId);
    
                if (i === _tablature.notes.length - 1) {
                    let endTimeoutId = setTimeout(() => {
                        isPlaying = false;
                        currentNoteIndex = 0;
                        startOffset = 0;
                    }, (noteStartTime + duration * beatDuration - currentTime) * 1000);
                    this.timeouts.push(endTimeoutId);
                }
            }
        }
    };

    Staff.prototype.pause = function() {
        if (isPlaying) {
            this.timeouts.forEach(clearTimeout);
            this.timeouts = [];
            isPlaying = false;
            let elapsedTime = audioCtx.currentTime - startTime;
            startOffset += elapsedTime;
            currentNoteIndex += Math.floor(startOffset / (60 / _tempo));
            startOffset %= (60 / _tempo);
        }
    };

    Staff.prototype.resume = function() {
        if (!isPlaying) {
            startTime = audioCtx.currentTime - startOffset;
            this.play();
        }
    }

    Staff.prototype.stop = function() {
        this.goto(0);
    };

    Staff.prototype.loop = function() {
        // Implementation needed
    };

    Staff.prototype.goto = function(noteIndex) {
        if (noteIndex < 0 || noteIndex >= _tablature.notes.length) {
            console.error("Invalid note index.");
            return;
        }
        this.pause();
        currentNoteIndex = noteIndex;
        startOffset = 0;
        if (isPlaying) {
            this.play();
        }
    };

    return Staff;
})();


/*
const melodyTablature = {
    title: "Complex Melody",
    tuning: ["E", "A", "D", "G", "B", "E"],
    tempo: 120,
    timeSignature: '4/4',
    measures: [
        {
            notes: [
                { string: 6, fret: 3, technique: "bend" },
                { string: 5, fret: 2 },
                { string: 4, fret: 0, duration: "quarter" },
                // More notes
            ]
        },
        // More measures
    ]
};
const melodyTablature = {
    title: "Melody",
    tuning: ["E", "A", "D", "G", "B", "E"],
    tempo: 120,
    timeSignature: '4/4',
    notes: [
        { 'note': 'C4', 'duration': 1}
        { 'note': 'G4', 'duration': 2}
        { 'note': 'A4', 'duration': 1}
        { 'note': 'C4', 'duration': 1}
        { 'note': 'G4', 'duration': 1}
        { 'note': 'A4', 'duration': 1}
        { 'note': 'D4', 'duration': 1}
    ]
};
*/