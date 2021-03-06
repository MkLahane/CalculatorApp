import { boolean } from "mathjs";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const punctuations = [".", "x", "/", "-", "+", ")", "(", "^"];
const replaceStar = (str) => {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] == 'x') {
            newStr += '*';
        } else {
            newStr += str[i];
        }
    }
    return newStr;
};


const isPuncutation = (lastChar) => {
    const result = punctuations.filter(p => p === lastChar);
    if (result.length > 0) {
        return true;
    }
    return false;
};

const isNumber = (c) => {
    return c in numbers;
};

const isEmpty = (str) => {
    let empty = true;
    for (let i = 0; i < str.length; i++) {
        if (str[i] != ' ') {
            empty = false;
        }
    }
    return empty;
};

const checkForValidQuestion = (str) => {
    let isThereNumber = false;
    let isThereOperator = false;
    for (let i = 0; i < str.length; i++) {
        if (isNumber(str[i])) {
            isThereNumber = true;
        } else if (isPuncutation(str[i])) {
            isThereOperator = true;
        }
    }
    return isThereNumber && isThereOperator;
};

export {
    isNumber,
    isPuncutation,
    replaceStar,
    isEmpty,
    checkForValidQuestion
};