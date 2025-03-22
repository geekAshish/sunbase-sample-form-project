// sample json data
let formElements = [
  {
    id: "1",
    type: "input",
    label: "Sample Input",
    placeholder: "Sample placeholder",
  },
  {
    id: "2",
    type: "select",
    label: "Sample Select",
    options: ["Sample Option", "Sample Option", "Sample Option"],
  },
  {
    id: "3",
    type: "textarea",
    label: "Sample Textarea",
    placeholder: "Sample placeholder",
  },
  { id: "4", type: "checkbox", label: "Sample Checkbox" },
];

function addElement(type) {
  let id = Date.now(); // using date as id
  let element = {
    id,
    type,
    label: `Sample ${type}`,
    placeholder: "Sample Placeholder",
  };

  if (type === "select") {
    element.options = ["Sample Option", "Sample Option", "Sample Option"];
  }

  formElements.push(element);
  renderForm();
}

function renderForm() {
  const formArea = document.getElementById("form-builder");
  formArea.innerHTML = "";

  formElements.forEach((element, index) => {
    let html = `
          <div class="form-element" draggable="true"
              ondragstart="drag(event, ${index})"
              ondrop="drop(event, ${index})"
              ondragover="allowDrop(event)">
              
              <label contenteditable="true" oninput="updateLabel(${index}, this.innerText)">${
      element.label
    }</label>
             ${getInputElement(element, index)}
             <img class="delete-btn" onclick="deleteElement(${index})" src="./src/assets/trash-icon.svg" />
          </div>
      `;
    formArea.innerHTML += html;
  });

  generatePreview();
}

function getInputElement(element, index) {
  switch (element.type) {
    case "input":
      return `<input type="text" placeholder="${element.placeholder}" oninput="updatePlaceholder(${index}, this.value)">`;
    case "textarea":
      return `<textarea placeholder="${element.placeholder}" rows="5" oninput="updatePlaceholder(${index}, this.value)"></textarea>`;
    case "checkbox":
      return `<input type="checkbox">`;
    case "select":
      return `
              <select>
                ${element.options
                  .map(
                    (opt, i) =>
                      `<option>${opt}</option> <button onclick="removeOption(${index}, ${i})">X</button>`
                  )
                  .join("<br>")}
              </select>
              <button class="save-btn" style="margin-top: 5px;" onclick="addOption(${index})">Add Option</button>
              `;
    default:
      return "";
  }
}

function removeOption(elementIndex, optionIndex) {
  formElements[elementIndex].options.splice(optionIndex, 1);
  renderForm();
}

function updateLabel(index, value) {
  formElements[index].label = value;
  generatePreview();
}

function updatePlaceholder(index, value) {
  formElements[index].placeholder = value;
  generatePreview();
}

function addOption(index) {
  formElements[index].options.push(`Sample Option`);
  renderForm();
}

function deleteElement(index) {
  formElements.splice(index, 1);
  renderForm();
}

function saveForm() {
  console.log(JSON.stringify(formElements, null, 2));
}

function allowDrop(event) {
  // Allow elements to be dropped
  event.preventDefault();
}

// Store the index of the dragged element
let draggedIndex = null;

function drag(event, index) {
  draggedIndex = index;
  // Store index in drag event
  event.dataTransfer.setData("text/plain", index);
}

function drop(event, index) {
  event.preventDefault();
  // Get dragged element's index
  let targetIndex = parseInt(event.dataTransfer.getData("text/plain"));

  if (draggedIndex !== null && targetIndex !== index) {
    // Remove dragged item
    let draggedItem = formElements.splice(targetIndex, 1)[0];
    // Insert at the new position
    formElements.splice(index, 0, draggedItem);

    // Reset
    draggedIndex = null;
    // Re-render the form with updated order
    renderForm();
  }
}

function generatePreview() {
  const previewArea = document.getElementById("previewArea");
  let html = `<form>`;
  formElements.forEach((element) => {
    if (element.type === "input") {
      html += `<label>${element.label}</label><input type="text" placeholder="${element.placeholder}"><br>`;
    } else if (element.type === "textarea") {
      html += `<label>${element.label}</label><textarea placeholder="${element.placeholder}"></textarea><br>`;
    } else if (element.type === "select") {
      html += `<label>${element.label}</label><select>${element.options
        .map((opt) => `<option>${opt}</option>`)
        .join("")}</select><br>`;
    } else if (element.type === "checkbox") {
      html += `<label><input type="checkbox"> ${element.label}</label><br>`;
    }
  });
  html += `</form>`;
  previewArea.innerHTML = html;
}

function copyHTML() {
  const previewArea = document.getElementById("previewArea").innerHTML;
  const textarea = document.createElement("textarea");
  textarea.value = previewArea;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Form HTML copied to clipboard!");
}

renderForm();
