"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Display story submission form when 'submit' link is clicked */

function navShowStorySubmitFormClick(evt) {
  console.debug("navShowStorySubmitForm", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmit.on("click", navShowStorySubmitFormClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/* Switch to favorites list when logged in user clicks on favorites link. */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  displayFavoritesList();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/* Switch to user stories list when logged in user clicks on my stories link. */

function navUserStoriesClick(evt) {
  console.debug("navUserStoriesClick", evt);
  hidePageComponents();
  displayUserStoriesList();
}

$body.on("click", "#nav-user-stories", navUserStoriesClick);

/* Switch to user profile when logged in user clicks on their username. */

function navUserProfileClick(evt) {
  console.debug("navUserProfileClick");
  hidePageComponents();
  $userProfile.show();
}

$navUser.on("click", navUserProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
