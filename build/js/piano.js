const pianoUI = (() => {
    const generate = (numberOfWhiteKeys = 7) => {
        const svgNS = "http://www.w3.org/2000/svg";
        const whiteKeyWidth = 70;
        const whiteKeyHeight = 200;
        const blackKeyWidth = 40;
        const blackKeyHeight = 120;
        const svgWidth = whiteKeyWidth * numberOfWhiteKeys;
        const svgHeight = whiteKeyHeight;
    
        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("height", svgHeight);
        svg.style.border = "1px solid black";
    
        // Generate white keys
        for (let i = 0; i < numberOfWhiteKeys; i++) {
            let rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("class", "white-key key");
            rect.setAttribute("width", whiteKeyWidth);
            rect.setAttribute("height", whiteKeyHeight);
            rect.setAttribute("x", whiteKeyWidth * i);
            rect.setAttribute("y", 0);
            rect.setAttribute("id", `W${i}`);
            svg.appendChild(rect);
        }
    
        // Generate black keys
        for (let i = 0; i < numberOfWhiteKeys; i++) {
            const octavePosition = i % 7;
            if ([0, 1, 3, 4, 5].includes(octavePosition)) {
                let xOffset = whiteKeyWidth * (i + 1) - blackKeyWidth / 2;
                // Adjust xOffset for keys after E
                if (octavePosition > 2) xOffset -= blackKeyWidth / 2;
    
                let rect = document.createElementNS(svgNS, "rect");
                rect.setAttribute("class", "black-key key");
                rect.setAttribute("width", blackKeyWidth);
                rect.setAttribute("height", blackKeyHeight);
                rect.setAttribute("x", xOffset);
                rect.setAttribute("y", 0);
                rect.setAttribute("id", `B${i}`);
                svg.appendChild(rect);
            }
        }
    
        return svg;
    }

    return {
        generate
    }
})();

