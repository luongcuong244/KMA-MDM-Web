function isAlphanumeric(text) {
    return /^[a-zA-Z0-9]*$/.test(text);
}

function isIntegerNumber(text) {
    return /^-?\d*?\d*$/.test(text);
}

const InputChecker = {
    isAlphanumeric,
    isIntegerNumber,
};

export default InputChecker;
