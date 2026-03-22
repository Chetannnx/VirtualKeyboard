const keyboardLayout = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M","ENTER"],
  ["SPACE", "BACKSPACE"]
];

const keyboardDiv = document.getElementById("keyboard");

// 🔥 Internal value
let currentValue = "";

// =========================
// 🔥 RECEIVE VALUE FROM CWC
// =========================
window.addEventListener("message", function(event) {

  if (!event.data) return;

  if (event.data.type === "setFieldName") {

    // 🔥 IMPORTANT: reset and update value
    currentValue = event.data.value ?? "";

    console.log("📥 Sync from CWC:", currentValue);
  }
});

// =========================
// 🔥 SEND VALUE TO CWC
// =========================
function sendValue() {
  window.parent.postMessage(
    {
      type: "keyboardInput",
      value: currentValue
    },
    "*"
  );

  console.log("📤 Send:", currentValue);
}

// =========================
// 🔥 BUILD KEYBOARD
// =========================
keyboardLayout.forEach(row => {

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  row.forEach(key => {

    const keyDiv = document.createElement("div");
    keyDiv.classList.add("key");

    // =========================
    // SPACE
    // =========================
    if (key === "SPACE") {
      keyDiv.textContent = "Space";

      keyDiv.onclick = () => {
        currentValue += " ";
        sendValue();
      };

    // =========================
    // BACKSPACE
    // =========================
    } else if (key === "BACKSPACE") {
      keyDiv.textContent = "⌫";

      keyDiv.onclick = () => {
        currentValue = currentValue.slice(0, -1);
        sendValue();
      };

    // =========================
    // ENTER
    // =========================
    } else if (key === "ENTER") {
      keyDiv.textContent = "Enter";

      keyDiv.onclick = () => {
        sendValue();

        // 🔥 close keyboard
        window.parent.postMessage(
          { type: "keyboardEnter" },
          "*"
        );
      };

    // =========================
    // NORMAL KEYS
    // =========================
    } else {
      keyDiv.textContent = key;

      keyDiv.onclick = () => {
        currentValue += key;
        sendValue();
      };
    }

    rowDiv.appendChild(keyDiv);
  });

  keyboardDiv.appendChild(rowDiv);
});