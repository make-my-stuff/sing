const Notes = (function() {
    const oscillatorTypes = ['sine', 'square', 'triangle', 'sawtooth'];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteAliases = {'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'};
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function Notes() {
        this.noteTimber = 'sine';
        this.notesTable = buildNotesTable();

        const _playNote = (noteFrequency, duration) => {
            let oscillator = audioCtx.createOscillator();
            let gainNode = audioCtx.createGain();
            oscillator.type = this.noteTimber;
            oscillator.frequency.setValueAtTime(noteFrequency, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.001); // Smooth fade in
            oscillator.start();

            gainNode.gain.setValueAtTime(1, audioCtx.currentTime + duration);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration + 0.001); // Smooth fade out
            oscillator.stop(audioCtx.currentTime + duration + 0.002);

            this.oscillator = oscillator; // Maintain reference if needed for stopping
        };

        this.play = function(noteToPlay, duration = 1) {
            const currNote = this.notesTable.find(note => note.note === noteToPlay.toUpperCase());
            if (!currNote) {
                console.error(`Note ${noteToPlay} not found.`);
                return;
            }
            _playNote(currNote.frequency, duration);
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

    return Notes;
})();

const TimerQueue = (function() {
    function TimerQueue() {
        this.queue = [];
        this.isRunning = false;
        this.done = false;
        this.currentTaskTimeoutId = null;
        this.timeRemaining = null;
        this.currentTask = null;
    }

    TimerQueue.prototype.add = function(task, duration) {
        this.queue.push({ task, duration, done: false });
    };

    TimerQueue.prototype.start = function(n = 0) {
        if (!this.isRunning && this.queue.length > n) {
            this.isRunning = true;
            this.queue = this.queue.slice(n);
            this.next();
        }
    };

    TimerQueue.prototype.next = function() {
        if (this.queue.length > 0 && !this.timeRemaining) {
            this.currentTask = this.queue.shift();
            this.executeTask(this.currentTask);
        } else if (this.timeRemaining) {
            this.executeTask(this.currentTask, this.timeRemaining);
            this.timeRemaining = null;
        }
    };

    TimerQueue.prototype.executeTask = function(task, durationOverride) {
        var duration = durationOverride || task.duration;
        this.currentTaskTimeoutId = setTimeout(function() {
            task.task();
            console.log(task);
            task.done = true;
            this.isRunning = false;
            if (this.queue.length === 0) {
                this.done = true;
            }
            this.next();
        }.bind(this), duration);
    };

    TimerQueue.prototype.pause = function() {
        if (this.isRunning && this.currentTaskTimeoutId) {
            clearTimeout(this.currentTaskTimeoutId); // Clear the current timeout
            this.timeRemaining = this.currentTask.duration - (Date.now() - this.currentTask.startTime);
            this.isRunning = false;
            this.currentTaskTimeoutId = null;
        }
    };

    TimerQueue.prototype.resume = function() {
        if (!this.isRunning && this.currentTask && this.timeRemaining != null) {
            this.isRunning = true;
            this.next();
        }
    };

    TimerQueue.prototype.clear = function() {
        this.queue = [];
        this.isRunning = false;
        this.done = false;
        if (this.currentTaskTimeoutId) {
            clearTimeout(this.currentTaskTimeoutId);
        }
        this.currentTaskTimeoutId = null;
        this.timeRemaining = null;
        this.currentTask = null;
    };

    TimerQueue.prototype.show = function() {
        return this.queue;
    }

    return TimerQueue;
})();


const Staff = (function() {
    function Staff() {
        this._tuning = ["E", "A", "D", "G", "B", "E"];
        this._tempo = 90;
        this._timeSignature = [4, 4];
        this._tablature = '';
    }

    Staff.prototype.setTempo = function(tempo) {
        this._tempo = tempo;
    };

    Staff.prototype.getTempo = function() {
        return this._tempo;
    };

    Staff.prototype.setTimeSignature = function(timeSignature) {
        let tsComponents = timeSignature.split("/");
        if (tsComponents.length != 2) {
            console.error("Time signature is not in correct format. Eg '4/4'");
            return;
        }
        this._timeSignature = tsComponents.map(Number);
    };

    Staff.prototype.getTimeSignature = function() {
        return this._timeSignature.join('/');
    };

    Staff.prototype.setTuning = function(tuning) {
        this._tuning = tuning;
    }

    Staff.prototype.getTuning = function() {
        return this._tuning;
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

        this._tablature = tablature;
    };

    Staff.prototype.getTablature = function() {
        return this._tablature;
    };

    Staff.prototype.play = function() {
        let notes = new Notes();
        let queue = new TimerQueue();
        let tablature = this.getTablature();

        let time = 0;
        tablature.notes.forEach((noteInfo, index) => {
            queue.add(() => { notes.play(noteInfo.note, noteInfo.duration) }, noteInfo.duration * 1000);
            console.log(noteInfo.note, noteInfo.duration, noteInfo.duration * 1000);
            //time += noteInfo.duration * 1000;
        });
        console.log(queue.show());
        queue.start();
    };

    Staff.prototype.pause = function() {
        // Implementation needed
    };

    Staff.prototype.stop = function() {
        this.goto(0);
    };

    Staff.prototype.loop = function() {
        // Implementation needed
    };

    Staff.prototype.goto = function(note) {
        // Implementation needed
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