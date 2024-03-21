const logger = (() => {
    const log = (message) => {
        console.log(message);
    }
    const error = (message) => {
        console.error(message);
    }
    return {
        log,
        error
    }
})()

const notes = (() => {
    _oscillatorTypes = ['sine', 'square', 'triangle', 'sawtooth'];
    _noteTimber = 'sine';
    _notesTable = [];
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const _playNote = (noteFrequency, duration) => {
        /*
        //Faulty approach, makes clicking sound while starting and ending
        oscillator = audioCtx.createOscillator();
        oscillator.connect(audioCtx.destination);
        oscillator.type = _noteTimber;
        oscillator.frequency.value = noteFrequency;
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration);
        */
        
        //Fix : Create a gain node, fade in and fade out the sound, offset the fade in and fade out time in oscillator
        let fadeInDuration = 0.01;
        let fadeOutDuration = 0.01;
        
        
        oscillator = audioCtx.createOscillator();
        oscillator.type = _noteTimber;
        oscillator.frequency.setValueAtTime(noteFrequency, audioCtx.currentTime);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start with gain at 0 to avoid clicks

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + fadeInDuration); // Smooth fade in

        oscillator.start();

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime + duration); // Ensure the gain is 1 before fading out
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration + fadeOutDuration); // Smooth fade out
        oscillator.stop(audioCtx.currentTime + duration + fadeInDuration + fadeOutDuration);
    }
    
    (() => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteAliases = {'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'};

        for (let octave = 0; octave < 9; octave++) {
            for (let note of noteNames) {
                const alias = _notesTable[note] ? `${_notesTable[note]}${octave}` : '';
                _notesTable.push({note: `${note}${octave}`, alias});
            }
        }

        const a4Index = noteNames.indexOf('A') + 4 * 12; // A4 is the 49th note when starting from C0, considering A4 as the reference point at 440 Hz.
        _notesTable.forEach((item, i) => {
            const distanceFromA4 = i - a4Index;
            const frequency = 440 * Math.pow(2, distanceFromA4 / 12);
            item.frequency = parseFloat(frequency.toFixed(2));
        });
    })()

    const getTable = () => {
        return _notesTable;
    }
    const setTimber = (timber) => {
        if(!(timber in _oscillatorTypes)) {
            let possibleTimber = _oscillatorTypes.join(", ");
            logger.error(`Invalid timber. Possible values are '${possibleTimber}'`)
            return;
        }
        
        _noteTimber = timber;
    }
    const getTimber = () => {
        return _noteTimber;
    }
    const play = (noteToPlay, duration) => {
        let currNote =_notesTable.find((note) => { return note.note == noteToPlay.toUpperCase() });
        if(!currNote) {
            logger.error(`Note ${noteToPlay} not found.`);
            return;
        }
        
        _playNote(currNote.frequency, duration);
    }
    return {
        getTable,
        setTimber,
        getTimber,
        play
    }
})()


const staff = (() => {
    let _tuning = ["E", "A", "D", "G", "B", "E"];
    let _tempo = 90;
    let _timeSignature = [4, 4];
    let _tablature = '';

    const setTempo = (tempo) => {
        _tempo = tempo;
    }
    const getTempo = () => {
        return _tempo;
    }
    const setTimeSignature = (timeSignature) => {
        let tsComponents = timeSignature.split("/");
        if(tsComponents.length != 2) {
            logger.error("Time signature is not in correct format. Eg '4/4'");
            return;
        }
        _timeSignature = tsComponents;
    }
    const getTimeSignature = () => {
        return _timeSignature;
    }
    const setTablature = (tablature) => {
        _tablature;
    }
    const getTablature = () => {
        return _tablature;
    }
    const play = () => {
        
    }
    const pause = () => {
        
    }
    const stop = () => {
        goto(0);
    }
    const loop = () => {
        
    }
    const goto = (note) => {
        
    }
    return {
        setTempo,
        getTempo,
        setTimeSignature,
        getTimeSignature,
        play,
        pause,
        stop,
        loop,
        goto
    }
})()

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
*/