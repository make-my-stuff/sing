const Svg = (() => {
    let svg = document.createElement('svg');
    let parentElem = null;

    let add = (elem) => {
        svg.appendChild(elem);
    }

    const draw = (parentElem) => {
        if(parentElem !== null && typeof parentElem === 'string') {
            parentElem = document.querySelector(parentElem);
        }

        if(parentElem === null) {
            return
        }

        parentElem.appendChild(svg);
    }

    return {
        draw
    }
})()