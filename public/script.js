// =========================
// 🔥 KEYBOARD LAYOUT
// =========================
const layout = [
  ["1","2","3","⌫"],
  ["4","5","6","CLEAR"],
  ["7","8","9","-"],
  [".","0","ENTER"]
];

// =========================
// 🔥 VARIABLES
// =========================
const keyboardDiv = document.getElementById("keyboard");

let currentValue = "";
let cursorPos = 0;

let currentField = "";
let currentTag = "";
let currentMin = null;
let currentMax = null;

// =========================
// 🔥 RECEIVE FROM CWC
// =========================
window.addEventListener("message", function(event) {

  if (!event.data) return;

  console.log("EVENT RECEIVED:", event.data);

  // ✅ BEST METHOD (ALL DATA IN ONE)
  if (event.data.type === "initKeyboard") {

    currentField = event.data.field || currentField;
    currentValue = (event.data.value ?? "").toString();
    cursorPos = currentValue.length;

    currentMin = event.data.min ?? currentMin;
    currentMax = event.data.max ?? currentMax;
    currentTag = event.data.tag || currentTag;

    buildKeyboard();
  }

  // ✅ FIELD + VALUE
  if (event.data.type === "setFieldName") {

    currentValue = (event.data.value ?? "").toString();
    cursorPos = currentValue.length;

    currentField = event.data.field || currentField;

    // ❌ DO NOT RESET MIN/MAX

    buildKeyboard();
  }

  // ✅ RANGE
  if (event.data.type === "setRange") {

    currentMin = event.data.min ?? currentMin;
    currentMax = event.data.max ?? currentMax;
    currentTag = event.data.tag || currentTag;

    buildKeyboard();
  }

});

// =========================
// 🔥 SEND VALUE
// =========================
function sendValue() {
  window.parent.postMessage({
    type: "keyboardInput",
    value: currentValue
  }, "*");
}

// =========================
// 🔥 VALIDATION
// =========================
function isValidValue(val) {

  if (
    val === "" ||
    val === "." ||
    val === "-" ||
    val === "-." ||
    val === "0."
  ) return true;

  if ((val.match(/\./g) || []).length > 1) return false;

  return true;
}

// =========================
// 🔥 KEY HANDLER
// =========================
function handleKey(key) {

  let newValue = currentValue.toString();

  switch (key) {

    case "⌫":
      if (cursorPos > 0) {
        newValue =
          newValue.slice(0, cursorPos - 1) +
          newValue.slice(cursorPos);
        cursorPos--;
      }
      break;

    case "CLEAR":
      currentValue = "";
      cursorPos = 0;
      updateDisplay();
      sendValue();
      return;

    case "ENTER":
      sendValue();
      window.parent.postMessage({ type: "keyboardEnter" }, "*");
      return;

    default:

      let char = key;

      if (char === "." && currentValue === "") {
        newValue = "0.";
        cursorPos = 2;
      } else {

        if (char === "." && currentValue.includes(".")) return;

        newValue =
          newValue.slice(0, cursorPos) +
          char +
          newValue.slice(cursorPos);

        cursorPos++;
      }
  }

  if (isValidValue(newValue)) {
    currentValue = newValue;
    updateDisplay();
    sendValue();
  }
}

// =========================
// 🔥 UPDATE DISPLAY ONLY
// =========================
function updateDisplay() {
  const display = document.querySelector(".display");
  if (display) display.innerText = currentValue;
}

// =========================
// 🔥 BUILD UI
// =========================
function buildKeyboard() {

  keyboardDiv.innerHTML = "";

  // 🔹 TOP BAR
  const topDiv = document.createElement("div");
  topDiv.classList.add("top-bar");

  topDiv.innerHTML = `
    <span>Field: ${currentField || "-"}</span>
    <span>Tag: ${currentTag || "-"}</span>
  `;
  keyboardDiv.appendChild(topDiv);

  // 🔹 DISPLAY
  const displayDiv = document.createElement("div");
  displayDiv.classList.add("display");
  displayDiv.innerText = currentValue || "";
  keyboardDiv.appendChild(displayDiv);

  // 🔹 RANGE
  const rangeDiv = document.createElement("div");
  rangeDiv.classList.add("range-bar");

  rangeDiv.innerHTML = `
    <span>Min: ${currentMin ?? "-"}</span>
    <span>Max: ${currentMax ?? "-"}</span>
  `;
  keyboardDiv.appendChild(rangeDiv);

  // 🔹 KEYS
  layout.forEach(row => {

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach(key => {

      const keyDiv = document.createElement("div");
      keyDiv.classList.add("key");

      if (key === "ENTER") keyDiv.classList.add("enter");
      if (key === "⌫") keyDiv.classList.add("backspace");
      if (key === "CLEAR") keyDiv.classList.add("clear");

      keyDiv.textContent = key;
      keyDiv.onclick = () => handleKey(key);

      rowDiv.appendChild(keyDiv);
    });

    keyboardDiv.appendChild(rowDiv);
  });
}

// =========================
// 🔥 INIT
// =========================
buildKeyboard();