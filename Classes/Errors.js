class InsufficientArgsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientArgsError";
    }
};

class InputProccessError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputProcessingError";
    }
};

module.exports = {InsufficientArgsError, InputProccessError};