const Piano = (function() {
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeyOffsets = [0, 1, 3, 4, 5];
    const blackNoteNames = ['C#', 'D#', 'F#', 'G#', 'A#'];
    const svgNS = "http://www.w3.org/2000/svg";

    function Piano() {
        this.octaves = [4];
        this.numberOfWhiteKeys = 7 * this.octaves.length;

        // Function that plays a note. Sound of a note can vary (same frequency, but different sounding, made from different instruments), it should be passed externally
        this.player = null;
    }

    Piano.prototype.setOctaves = function(octaves = [4]) {
        this.octaves = octaves;
        this.numberOfWhiteKeys = 7 * octaves.length;
    };

    Piano.prototype.getOctaves = function() {
        return this.octaves;
    };

    Piano.prototype.setPlayer = function(player) {
        this.player = player;
    };

    Piano.prototype.generate = function() {
        const whiteKeyWidth = 70;
        const whiteKeyHeight = 200;
        const blackKeyWidth = 40;
        const blackKeyHeight = 120;
        const svgWidth = whiteKeyWidth * this.numberOfWhiteKeys;
        const svgHeight = whiteKeyHeight;

        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("height", svgHeight);
        svg.style.border = "1px solid black";

        // Generate white keys
        for (let i = 0; i < this.numberOfWhiteKeys; i++) {
            const octave = this.octaves[Math.floor(i / 7)];
            const noteName = noteNames[i % 7] + octave; //E.g A4, C5

            let rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("class", "white-key key");
            rect.setAttribute("width", whiteKeyWidth);
            rect.setAttribute("height", whiteKeyHeight);
            rect.setAttribute("x", whiteKeyWidth * i);
            rect.setAttribute("y", 0);
            rect.setAttribute("id", noteName);
            rect.addEventListener('click', () => {
                if(this.player) {
                    this.player(noteName);
                }
            });
            svg.appendChild(rect);
        }

        // Generate black keys
        for (let i = 0, noteIndex = 0; i < this.numberOfWhiteKeys; i++) {
            if (blackKeyOffsets.includes(i % 7)) {
                const octave = this.octaves[Math.floor(i / 7)];
                const noteName = blackNoteNames[noteIndex % 5] + octave;
                let xOffset = whiteKeyWidth * (i + 1) - blackKeyWidth / 2;

                let rect = document.createElementNS(svgNS, "rect");
                rect.setAttribute("class", "black-key key");
                rect.setAttribute("width", blackKeyWidth);
                rect.setAttribute("height", blackKeyHeight);
                rect.setAttribute("x", xOffset);
                rect.setAttribute("y", 0);
                rect.setAttribute("id", noteName);
                rect.addEventListener('click', () => {
                    if(this.player) {
                        this.player(noteName);
                    }
                });
                svg.appendChild(rect);
            }

            noteIndex++;
            if (i % 7 === 6) noteIndex = 0;
        }

        return svg;
    };

    return Piano;
})();
