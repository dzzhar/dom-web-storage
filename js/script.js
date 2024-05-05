const lists = [];
const RENDER_EVENT = "render-list";
const SAVED_EVENT = "saved-list";
const STORAGE_KEY = "LIST_APPS";

function generateId() {
  return +new Date();
}

function generateListObject(id, title, author, year, timestamp, isCompleted) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    timestamp,
    isCompleted,
  };
}

function findList(listId) {
  for (const listItem of lists) {
    if (listItem.id === listId) {
      return listItem;
    }
  }
  return null;
}

function findListIndex(listId) {
  for (const index in lists) {
    if (lists[index].id === listId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(lists);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const list of data) {
      lists.push(list);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeList(listObject) {
  const { id, title, author, year, isCompleted } = listObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("h2");
  textAuthor.innerText = author;

  const numberYear = document.createElement("h3");
  numberYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, numberYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `list-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromList(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addList() {
  const textTitle = document.getElementById("title").value;
  const textAuthor = document.getElementById("author").value;
  const numberYear = document.getElementById("year").value;
  const date = new Date();
  const timestamp = date.toLocaleDateString();

  const generatedID = generateId();
  const listObject = generateListObject(
    generatedID,
    textTitle,
    textAuthor,
    numberYear,
    timestamp,
    false
  );

  lists.push(listObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromList(listId) {
  const listTarget = findListIndex(listId);

  if (listTarget === -1) return;

  lists.splice(listTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(listId) {
  const listTarget = findList(listId);

  if (listTarget == null) return;

  listTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(listId) {
  const listTarget = findListIndex(listId);

  if (listTarget === -1) return;

  lists.splice(listTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(listId) {
  const listTarget = findList(listId);
  if (listTarget == null) return;

  listTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addList();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedLISTList = document.getElementById("lists");
  const listCompleted = document.getElementById("completed-lists");

  uncompletedLISTList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const listItem of lists) {
    const listElement = makeList(listItem);
    if (listItem.isCompleted) {
      listCompleted.append(listElement);
    } else {
      uncompletedLISTList.append(listElement);
    }
  }
});
