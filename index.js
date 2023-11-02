// Variables
var username = "";

var num1 = "";
var num2 = "";
var operation = "";
var result = "";

var history1 = "";
var history2 = "";
var history3 = "";
var history4 = "";

// On Events
onEvent("enterCalculator", "click", enterCalculator);
onEvent("back", "click", closeCalculator);

onEvent("zeroButton", "click", function() {
  onNumberPress("0");
});
onEvent("oneButton", "click", function() {
  onNumberPress("1");
});
onEvent("twoButton", "click", function() {
  onNumberPress("2");
});
onEvent("threeButton", "click", function() {
  onNumberPress("3");
});
onEvent("fourButton", "click", function() {
  onNumberPress("4");
});
onEvent("fiveButton", "click", function() {
  onNumberPress("5");
});
onEvent("sixButton", "click", function() {
  onNumberPress("6");
});
onEvent("sevenButton", "click", function() {
  onNumberPress("7");
});
onEvent("eightButton", "click", function() {
  onNumberPress("8");
});
onEvent("nineButton", "click", function() {
  onNumberPress("9");
});

onEvent("divideButton", "click", function() {
  onOperationPress("/");
});
onEvent("multiplyButton","click", function() {
  onOperationPress("*");
});
onEvent("subtractionButton", "click", function() {
  onOperationPress("-");
});
onEvent("additionButton", "click", function() {
  onOperationPress("+");
});

onEvent("equalButton", "click", function() {
  onEqualsPress();
  playSound("sound://category_collect/clicky_crunch.mp3");
});
onEvent("clearButton", "click", function() {
  onClearPress();
  updateResult();
  playSound("sound://category_app/perfect_clean_app_button_click.mp3");
});

// Functions
function onNumberPress(number) {
  if (result != "") { // Overwrite num1
    onClearPress();
    num1 = num1 + number;
  } else if (result == "" && operation != "") { // Add to num2
    num2 = num2 + number;
  } else if (result == "" && operation == "" ) { // Add to num1
    num1 = num1 + number;
  }
  playSound("sound://category_app/app_interface_button_2.mp3");
  updateResult();
}

function onOperationPress(selection) {
  if (num1 == "") { // If they did not enter a number, do not let them enter an operation
    return;
  }
  if (result != "") { // If there is a result, apply the operation to it
    num1 = result;
    num2 = "";
    result = "";
  } else if (num2 != "") { // If the relevant data are entered, run calculation, apply operation to result
    onEqualsPress();
    num1 = result;
    num2 = "";
    result = "";
  }
  playSound("sound://category_tap/vibrant_tone_button_8.mp3");
  operation = selection; // Set operation variable
  updateResult();
}

function onEqualsPress() {
  if (operation == "/") {
    var answer = (num1 / num2).toString();
    if (answer.search(".") != -1) { // If the answer has a decimal, handle accordingly
      result = answer.substring(0, answer.split(".")[0].length + 4); // Only display 3 places after the decimal
    } else {
      result = answer; // If there is no decimal, display full answer
    }
    updateHistory();
  } else if (operation == "*") {
    result = (num1 * num2).toString();
    updateHistory();
  } else if (operation == "-") {
    result = (num1 - num2).toString();
    updateHistory();
  } else if (operation == "+") {
    result = (parseInt(num1) + parseInt(num2)).toString(); // We need to parseInt when adding becuase otherwise it will concatenate
    updateHistory();
  }
  updateResult();
}

function onClearPress() {
  if (getText("clearButton") == "CE") {
    if (result != "") { // If there is a result, clear everything we entered
      num1 = "";
      num2 = "";
      operation = "";
      result = "";
    } else if (result == "" && num2 != "") { // No result but we have a second number entered
      num2 = "";
    } else if (result == "" && num2 == "" && operation != ""){ // No result, no num2, but an operation is entered
      operation = "";
      makeBorderPretty("divideButton", false);
      makeBorderPretty("multiplyButton", false);
      makeBorderPretty("subtractionButton", false);
      makeBorderPretty("additionButton", false);
    } else {
      num1 = "";
    }
  } else {
    num1 = "";
    num2 = "";
    operation = "";
    result = "";
    clearHistory();
  }
  updateResult();
}

function updateHistory() {
  history4 = history3;
  history3 = history2;
  history2 = history1;
  history1 = num1 + " " + operation + " " + num2 + " = " + result;
}

function clearHistory() {
  history1 = "";
  history2 = "";
  history3 = "";
  history4 = "";
}

// Update the result text box when any changes are made
function updateResult() {
  if (result != "") { // If a result exists, output it
    setText("output", result);
  } else if (result == "" && num2 != ""){ // If there is no result, but there is a num2, we are focused on num2 and need to output it
    setText("output", num2);
    makeBorderPretty("divideButton", false);
    makeBorderPretty("multiplyButton", false);
    makeBorderPretty("subtractionButton", false);
    makeBorderPretty("additionButton", false);
  } else if (result == "" && num2 == "" && operation != ""){ // If an operation was just entered, still focus on num1, but highlight the operation that was entered
    setText("output", num1);
    // Conditionals that check which operation was entered
    // Highlight accordingly
    if (operation == "/") {
      makeBorderPretty("divideButton", true);
      makeBorderPretty("multiplyButton", false);
      makeBorderPretty("subtractionButton", false);
      makeBorderPretty("additionButton", false);
    } else if (operation == "*") {
      makeBorderPretty("divideButton", false);
      makeBorderPretty("multiplyButton", true);
      makeBorderPretty("subtractionButton", false);
      makeBorderPretty("additionButton", false);
    } else if (operation == "-") {
      makeBorderPretty("divideButton", false);
      makeBorderPretty("multiplyButton", false);
      makeBorderPretty("subtractionButton", true);
      makeBorderPretty("additionButton", false);
    } else {
      makeBorderPretty("divideButton", false);
      makeBorderPretty("multiplyButton", false);
      makeBorderPretty("subtractionButton", false);
      makeBorderPretty("additionButton", true);
    }
  } else { // Focus on num1 if all else fails
    setText("output", num1);
    if (num1 == "") { // If there is nothing stored in the num1 variable, set the text to "0" // this way the output is never blank
      setText("output", "0");
    }
  }
  if (getText("output") == "0") {
    setText("clearButton", "C");
  } else {
    setText("clearButton", "CE");
  }
  // Set history
  setText("history1", history1);
  setText("history2", history2);
  setText("history3", history3);
  setText("history4", history4);
}

function makeBorderPretty(elementName, highlighted) {
  if (highlighted) {
    setProperty(elementName, "border-width", 2);
    setProperty(elementName, "border-color", rgb(255, 255, 255));
  } else {
    setProperty(elementName, "border-width", 1);
    setProperty(elementName, "border-color", rgb(65, 65, 65));
  }
}

function enterCalculator() {
  var usernameInput = getText("usernameInput");
  if (usernameInput == "") {
    return;
  }
  username = usernameInput;
  setText("usernameDisplay", "Hello, " + username);
  setScreen("calculator");
}

function closeCalculator() {
  setText("usernameInput", "");
  onClearPress();
  clearHistory();
  setScreen("homeScreen");
}
