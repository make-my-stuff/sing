const Logger = (() => {
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
})();