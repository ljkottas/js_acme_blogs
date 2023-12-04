// Function 1 -- createElemWithText
function createElemWithText(elementName = "p", textContent = "", className) {
  const newElement = document.createElement(elementName);
  newElement.textContent = textContent;
  if (className) {
    newElement.className = className;
  }
  return newElement;
}

// Function 2 -- createSelectOptions
function createSelectOptions(users) {
  if (!users) {
    return undefined;
  }

  return users.map((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    return option;
  });
}

// Function 3 -- toggleCommentSection
function toggleCommentSection(postId) {
  if (!postId) {
    return undefined;
  }

  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (section) {
    section.classList.toggle("hide");
  } else {
    const newSection = createElemWithText("section");
    newSection.dataset.postId = postId;
    newSection.classList.add("hide");
    document.body.appendChild(newSection);
  }
  return section;
}

// Function 4 -- toggleCommentButton
function toggleCommentButton(postId) {
  if (!postId) {
    return undefined;
  }

  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (button) {
    button.textContent =
      button.textContent === "Show Comments"
        ? "Hide Comments"
        : "Show Comments";
  }
  return button;
}

// Function 5 -- deleteChildElements
function deleteChildElements(parentElement) {
  if (!parentElement || !(parentElement instanceof Element)) {
    return undefined;
  }

  let child = parentElement.lastElementChild;

  while (child) {
    parentElement.removeChild(child);

    child = parentElement.lastElementChild;
  }

  return parentElement;
}

// Function 6 -- addButtonListeners
function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons.length > 0) {
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener("click", function (event) {
          toggleComments(event, postId);
        });
      }
    });
  }
  return buttons;
}

// Function 7 -- removeButtonListeners
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach((button) => {
    const postId = button.dataset.postId;
    if (postId) {
      button.removeEventListener("click", function (event) {
        toggleComments(event, postId);
      });
    }
  });
  return buttons;
}

// Function 8 -- createComments
function createComments(commentsData) {
  if (!commentsData) {
    return undefined;
  }
  const fragment = document.createDocumentFragment();

  for (const comment of commentsData) {
    const articleElement = document.createElement("article");
    const h3Element = createElemWithText("h3", comment.name);
    const bodyParagraph = createElemWithText("p", comment.body);
    const emailParagraph = createElemWithText("p", `From: ${comment.email}`);

    articleElement.appendChild(h3Element);
    articleElement.appendChild(bodyParagraph);
    articleElement.appendChild(emailParagraph);

    fragment.appendChild(articleElement);
  }

  return fragment;
}

// Function 9 -- populateSelectMenu
function populateSelectMenu(usersData) {
  const selectMenu = document.getElementById("selectMenu");

  if (!usersData || !Array.isArray(usersData)) {
    console.error("Invalid or missing users data");
    return undefined;
  }

  const options = createSelectOptions(usersData);

  options.forEach((option) => {
    selectMenu.appendChild(option);
  });

  return selectMenu;
}

// Function 10 -- getUsers
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const usersData = await response.json();
    return usersData;
  } catch (error) {
    throw error;
  }
}

// Function 11 -- getUserPosts
async function getUserPosts(userId) {
  if (!userId) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const postsData = await response.json();
    return postsData;
  } catch (error) {
    throw error;
  }
}

// Function 12 -- getUser
async function getUser(userId) {
  if (typeof userId === "undefined") {
    console.error("No user ID provided");
    return undefined;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    if (!response.ok) {
      return undefined;
    }

    const userData = await response.json();

    return userData;
  } catch (error) {
    return undefined;
  }
}

// Function 13 -- getPostComments
async function getPostComments(postId) {
  if (typeof postId === "undefined") {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );

    if (!response.ok) {
      console.error(`Error fetching comments for post ID ${postId}`);
      return undefined;
    }

    const commentsData = await response.json();

    return commentsData;
  } catch (error) {
    return undefined;
  }
}

// Function 14 -- displayComments
async function displayComments(postId) {
  if (typeof postId === "undefined") {
    return undefined;
  }

  try {
    const section = document.createElement("section");

    section.dataset.postId = postId;

    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);

    if (typeof comments === "undefined") {
      console.error("Error fetching comments data");
      return undefined;
    }

    const fragment = createComments(comments);

    section.appendChild(fragment);

    return section;
  } catch (error) {
    console.error("Error displaying comments:", error);
    return undefined;
  }
}

// Function 15 -- createPosts
async function createPosts(posts) {
  if (typeof posts === "undefined") {
    return undefined;
  }

  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const body = createElemWithText("p", post.body);
    const postId = createElemWithText("p", `Post ID: ${post.id}`);

    const author = await getUser(post.userId);
    const authorInfo = createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const companyCatchPhrase = createElemWithText(
      "p",
      author.company.catchPhrase
    );

    const button = document.createElement("button");
    button.textContent = "Show Comments";
    button.dataset.postId = post.id;

    const section = await displayComments(post.id);

    article.appendChild(h2);
    article.appendChild(body);
    article.appendChild(postId);
    article.appendChild(authorInfo);
    article.appendChild(companyCatchPhrase);
    article.appendChild(button);
    article.appendChild(section);

    fragment.appendChild(article);
  }

  return fragment;
}
// Function 16 -- displayPosts
async function displayPosts(posts) {
  try {
    const mainElement = document.querySelector("main");

    let element;

    element = posts
      ? await createPosts(posts)
      : createElemWithText(
          "p",
          "Select an Employee to display their posts.",
          "default-text"
        );

    mainElement.appendChild(element);

    return element;
  } catch (error) {
    return undefined;
  }
}

// Function 17 -- toggleComments
function toggleComments(event, postId) {
  if (!event || !postId) {
    return undefined;
  }

  try {
    event.target.listener = true;

    const section = toggleCommentSection(postId);

    const button = toggleCommentButton(postId);

    return [section, button];
  } catch (error) {
    return undefined;
  }
}

// Function 18 -- refreshPosts
async function refreshPosts(posts) {
  if (!posts) {
    return undefined;
  }

  try {
    const removeButtons = removeButtonListeners();

    const main = deleteChildElements(document.querySelector("main"));

    const fragment = await displayPosts(posts);

    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
  } catch (error) {
    return undefined;
  }
}

// Function 19 -- selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
  try {
    if (!event) {
      return undefined;
    }

    const selectMenu = document.getElementById("selectMenu");
    selectMenu.disabled = true;

    const userId = event?.target?.value || 1;

    const posts = await getUserPosts(userId);

    const refreshPostsArray = await refreshPosts(posts);

    selectMenu.disabled = false;

    return [userId, posts, refreshPostsArray];
  } catch (error) {
    return [undefined, undefined, undefined];
  }
}

// Function 20 -- initPage
async function initPage() {
  const users = await getUsers();
  const select = await populateSelectMenu(users);

  return [users, select];
}

// Function 21 -- initApp
function initApp() {
  const [users, select] = initPage();

  const selectMenu = document.getElementById("selectMenu");

  selectMenu.addEventListener("change", async (event) => {
    const [userId, posts, refreshPostsArray] =
      await selectMenuChangeEventHandler(event);
  });
}

document.addEventListener("DOMContentLoaded", function () {
    
    initApp();
  });
