"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const loggedIn = Boolean(currentUser);

  if(deleteButton) {
    console.log("DELETE BUTTON ENABLED!");
  }

  return $(`
      <li id="${story.storyId}">
        ${deleteButton ? getDeleteButtonHTML() : ""} ${loggedIn ? getFavoriteHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/* Get the html to display a star for favorites for logged in users. */

function getFavoriteHTML(story, user) {
  const favorite = user.isFavorite(story);
  const star = favorite ? "fas" : "far";
  return `<span class="star"><i class="${star} fa-star"></i></span>`;
}

function getDeleteButtonHTML() {
  return '<span class="trash"><i class="fas fa-trash-alt"></i></span>';
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/* Runs on submission of new story form. */

async function submitStory(evt) {
  console.debug("submitStory");
  evt.preventDefault();
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();
  const username = currentUser.username;
  const data = {title, url, author, username};

  const storyObj = await storyList.addStory(currentUser, data);

  const $story = generateStoryMarkup(storyObj);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("fast");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitStory);

/* Handling toggling favorite on a story. */

async function toggleFavorite(evt) {
  console.debug("toggleFavorite");

  const $target = $(evt.target);
  const id = $target.closest("li").attr("id");
  const story = storyList.stories.find(s => s.storyId === id);

  if($target.hasClass("far")) {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$allStoryLists.on("click", ".star", toggleFavorite);

/* Handing deleting a story. */

async function deleteStory(evt) {
  console.log("deleteStory");

  const id = $(evt.target).closest("li").attr("id");

  await storyList.removeStory(currentUser, id);

  displayUserStoriesList();
}

$allStoryLists.on("click", ".trash", deleteStory);

/* Generate and display the favorites list. */

function displayFavoritesList() {
  console.debug("displayFavoritesList");

  $favoriteStoriesList.empty();

  if(currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h3>No favorites added yet!</h3>");
  } else {
    for( let s of currentUser.favorites ) {
      const $story = generateStoryMarkup(s);
      $favoriteStoriesList.append($story);
    }
  }

  $favoriteStoriesList.show();
}

/* Generate and display the user stories list. */

function displayUserStoriesList() {
  console.debug("displayUserStoriesList");

  $userStoriesList.empty();

  if(currentUser.ownStories.length === 0) {
    $userStoriesList.append("<h3>No stories submitted yet!</h3>");
  } else {
    for( let s of currentUser.ownStories ) {
      const $story = generateStoryMarkup(s, true);
      $userStoriesList.append($story);
    }
  }

  $userStoriesList.show();
}