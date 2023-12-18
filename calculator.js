var result = document.getElementById("result");
var clear_button = document.getElementById("btn_clear")
var button_submit = document.getElementById("btn_submit");

var button_0 = document.getElementById("btn_0");
var button_1 = document.getElementById("btn_1");
var button_2 = document.getElementById("btn_2");
var button_3 = document.getElementById("btn_3");
var button_4 = document.getElementById("btn_4");
var button_5 = document.getElementById("btn_5");
var button_6 = document.getElementById("btn_6");
var button_7 = document.getElementById("btn_7");
var button_8 = document.getElementById("btn_8");
var button_9 = document.getElementById("btn_9");

// operators
var button_sub = document.getElementById("btn_sub");
var button_dot = document.getElementById("btn_dot");
var button_add = document.getElementById("btn_add");
var button_div = document.getElementById("btn_div");
var button_mul = document.getElementById("btn_mul");

// special operators
var button_leftParenthesis = document.getElementById("btn_leftParenthesis");
var button_rightParenthesis = document.getElementById("btn_rightParenthesis");
var button_pie = document.getElementById("btn_pie");

// buttons
button_0.addEventListener("click", function(event) {
    // check if there is a pie symbol
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_0.value;
    }
});
button_1.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_1.value;
    }
});
button_2.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_2.value;
    }
});
button_3.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_3.value;
    }
});
button_4.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_4.value;
    }
});
button_5.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_5.value;
    }
});
button_6.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_6.value;
    }
});
button_7.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_7.value;
    }
});
button_8.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_8.value;
    }
});
button_9.addEventListener("click", function(event) {
    if (result.value.slice(-1) != button_pie.value) {
        result.value += button_9.value;
    }
});

// operators
button_sub.addEventListener("click", function(event) {
     // determine whether the operator should be a negative symbol or a subtraction operator
     if (isSubtractionNegative()) {
        result.value += button_sub.value;
    } else if (!isOperatorExists(result.value.slice(-1), true)) {
        result.value += ' ' + button_sub.value + ' ';
    }
});
button_dot.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (!/[.]/.test(arr[arr.length - 1]) && arr.slice(-1) != ')') {
        result.value += button_dot.value;
    }
});
button_add.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (!isOperatorExists(arr[arr.length - 1])) {
        result.value += ' ' + button_add.value + ' ';
    }
});
button_div.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (!isOperatorExists(arr[arr.length - 1])) {
        result.value += ' ' + button_div.value + ' ';
    }
});
button_mul.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (!isOperatorExists(arr[arr.length - 1])) {
        result.value += ' ' + button_mul.value + ' ';
    }
});
button_leftParenthesis.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (isOperatorExists(arr[arr.length - 1], false, true)) {
        result.value += button_leftParenthesis.value + ' ';
    }
});
button_rightParenthesis.addEventListener("click", function(event) {
    if (checkAmountOfSymbol(result.value, '(') > checkAmountOfSymbol(result.value, ')')) {
        result.value += " " + button_rightParenthesis.value;
    }
});
button_pie.addEventListener("click", function(event) {
    let arr = result.value.split(' ');

    if (!isOperatorExists(arr.slice(-1), false)) {
        result.value += " " + button_pie.value;
    }
});

// special operators
clear_button.addEventListener("click", function(event) {
    result.value = "";
});
button_submit.addEventListener("click", function(event) {
    calculate();
});

// functions
result.addEventListener("input", function(event) {
    const inputValue = result.value;
    const cursorPosition = result.selectionStart;
    const isOperator = /[+\-/*^π%()]/.test(inputValue[cursorPosition - 1]);
    const isNumber = /[1234567890.]/.test(inputValue[cursorPosition - 1]);

    // two spaces
    const insertSpacesAroundOperator = (input, index) => {
        return input.slice(0, index) + ' ' + input[index] + ' ' + input.slice(index + 1);
    };

    // left space
    const insertOneSpaceToLeftOperator = (input, index) => {
        return input.slice(0, index - 1) + ' ' + input[index - 1] + input.slice(index);
    };

    // right space
    const insertOneSpaceToRightOperator = (input, index) => {
        return input.slice(0, index - 1) + input[index - 1] + ' ' + input.slice(index);
    };

    // check if the user input is unwanted
    if (event.inputType === 'insertText' && !isOperator && !isNumber) {
        result.value = inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition);
        result.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        return;
    }

    // check if there is a pie symbol
    // if so then dont allow number inputs
    if (event.inputType === 'insertText' && isNumber && result.value.slice(-2).charAt(0) === button_pie.value) {
        result.value = inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition);
        result.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        return;
    }

    // handle multiple dots (only allow one dot per number)
    let arr = result.value.split(' ');

    // count the number of dots with each number, and if it's greater than 2 or if there is a parenthesis 
    // then disallow input 
    if (event.inputType === 'insertText' && isNumber && (arr[arr.length - 1].split('.').length > 2 || arr.slice(-1) == ').')) {
        result.value = inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition);
        result.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        return;
    }

    // adds space around operators to make it easier to calculate
    if (event.inputType === 'insertText' && isOperator) {
        // handling parenthese
        if ((inputValue === '(' || inputValue.slice(-1) === '(' && isOperatorExistsForTypedInput(result.value[result.value.length - 2], true))) {
            result.value = insertOneSpaceToRightOperator(inputValue, cursorPosition);
            return;
        } else if (inputValue.slice(-1) === ')' && (checkAmountOfSymbol(inputValue, '(') >= checkAmountOfSymbol(inputValue, ')'))) {
            result.value = insertOneSpaceToLeftOperator(inputValue, cursorPosition);
            return;
        } else if ((inputValue.slice(-1) === '(' && (!isOperatorExistsForTypedInput(result.value[result.value.length - 1], true) || !isOperatorExistsForTypedInput(result.value, true))) || inputValue.slice(-1) === ')') {
            result.value = inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition);
            result.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
            return;
        }

        // handling negative symbols
        if (inputValue.slice(-1) === '-' && isSubtractionNegative(inputValue, 1, -2, " -")) {
            result.value = inputValue;
        } else if (inputValue.slice(-1) === '%') {
            // handling percent symbols by adding only one space
            result.value = insertOneSpaceToLeftOperator(inputValue, cursorPosition)
            result.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
        } else {
            // default (add two spaces around the operator)
            result.value = insertSpacesAroundOperator(inputValue, cursorPosition - 1);
            result.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
        }

        // dont input anything (or in another words, delete the input)
        if (isOperatorExistsForTypedInput(inputValue[inputValue.length - 2]) && !isSubtractionNegative(inputValue, 1, -2, " -")) {
            result.value = inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition);
            result.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
    }
});

// when the user presses enter or delete on their keyboard
document.addEventListener("keydown", function(event) {
    const key = event.key;

    // deleting (delete two spaces)
    if (key === "Backspace") {
        let arr = result.value.split(' ');

        // if deleting an operator, delete only 1 element
        if (/[+\-/*^π%1234567890]/.test(arr[arr.length - 2])) {
            result.value = arr.splice(0, arr.length - 2).join(' ');
        } else {
            result.value = '';
        }

        // prevent anything from being typed
        event.preventDefault();
    }

    // calculating
    if (key === "Enter") {
        result.value.replace('=', ' ')
        calculate();
    }
});

function calculate(value = result.value) {
    let arr = value.split(' ');

    // calculate the expressions that are inside parenthesis first
    let left = arr.indexOf('(');
    let right = arr.lastIndexOf(')');

    // if there are parenthesis
    if (left != -1 && right != 1) {
        let parenthesisSum = calculate(arr.slice(left + 1, arr.length - 1).join(' '));
        arr.splice(left, right - left + 1, parenthesisSum);
    }

    // simplify equation first with operators like sqrt and percentage
    for (let i = 0; i < arr.length; i += 2) {

        // the number we want to simplify
        let simplifiedNum = parseFloat(arr[i]);

        // get the operator
        let operator = arr[i + 1];

        switch (operator) {
            case "%":
                // trim the array down
                arr.splice(i, 2, simplifiedNum /= 100);
                i -= 2;
                break;
            case "π":
                arr.splice(i, 2, simplifiedNum * Math.PI);
                i -= 2;
                break;
        }
    }

    // iterate through the array to handle exponentiation first
    for (let i = 1; i < arr.length; i += 2) {
        let operator = arr[i];

        // check for multiplication, division, or exponentiation
        if (operator === "^") {
            let num1 = parseFloat(arr[i - 1]);
            let num2 = parseFloat(arr[i + 1]);

            arr.splice(i - 1, 3, (num1 ** num2).toString());
            i -= 2;
        }
    }

    // iterate through the array again to handle multiplication or division
    for (let i = 1; i < arr.length; i += 2) {
        let operator = arr[i];

        // check for multiplication or division
        if (operator === "*" || operator === "/") {
            let num1 = parseFloat(arr[i - 1]);
            let num2 = parseFloat(arr[i + 1]);

            switch(operator) {
                case "*":
                    arr.splice(i - 1, 3, (num1 * num2).toString());
                    i -= 2; // subtract the index by 2 because we trimmed the array
                    break;
                case "/":
                    arr.splice(i - 1, 3, (num1 / num2).toString());
                    i -= 2;
                    break;
            }
        }
    }

    // iterate through the array again to handle subtraction or division
    let sum = parseFloat(arr[0]);

    for (let i = 1; i < arr.length; i += 2) {
        let num2 = parseFloat(arr[i + 1]);
        let operator = arr[i];

        // perform addition or subtraction
        switch(operator) {
            case "+":
                sum += num2;
                break;
            case "-":
                sum -= num2;
                break;
        }
    }

    // show the result with five decimal points
    result.value = Number(sum.toFixed(10));

    return sum;
}

// toggle between dark and light mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// check if the subtraction operator should be used as a negative symbol or not
function isSubtractionNegative(value = result.value, startingLength = 0, checkIndex = -1, checkValue = " ") {
    return value.length === startingLength || value.slice(checkIndex) === checkValue || value.slice(-2).charAt(0) === '(';
}

// check if the usage is correct (no double operators, no other letters other than the operators and letters)
function isOperatorExists(value, isSubtraction = false, isParenthesis = false) {
    const validOperators = /[+\/*^π%1234567890.)]/;

    // for negative numbers, check if the subtraction symbol is negative or not
    if (value === '-' && !isSubtraction) {
        return false;
    }

    if (isParenthesis) {
        return !/[1234567890π%)]/.test(value);
    }

    return !validOperators.test(value);
}

// just for typed inputs
function isOperatorExistsForTypedInput(value, isParenthesis = false) {
    const validOperators = isParenthesis ? /[1234567890π%)]/ : /[()+\/*^π%1234567890.]/;
    return !validOperators.test(value);
}

// check the amount of parenthesis there are in the input
function checkAmountOfSymbol(value, symbol) {
    let amount = 0;

    for (let i = 0; i < value.length; i++) {
        if (value[i] === symbol) {
            amount += 1;
        }
    }

    return amount;
}

// allows the user to immediately use their keyboards after hitting a button
// in another words, we focus the input bar to allow for typed inputs without having the user clicking on the input box
// which is much more efficient
document.addEventListener('DOMContentLoaded', function () {
    const calculatorBody = document.querySelector('.calculator_body');

    calculatorBody.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('calculator-button')) {
            focusInput();
        }
    });

    function focusInput() {
        const inputField = document.getElementById('result');
        inputField.focus();
    }
});
