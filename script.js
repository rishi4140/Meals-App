// Selecting DOM elements
const searchBar = document.getElementById('search-bar'); // Search input field
const randomButton = document.getElementById('random-image'); // Button for random meal
const myFavoriteMeals = document.getElementById('my-favourite-meals'); // Button to display favorite meals
const mealsDiv = document.getElementById('meals-div'); // Div to display meals
const modal = document.getElementById('mealModal'); // Modal for meal details
const modalBody = document.getElementById('modal-body'); // Body of the modal
const span = document.getElementsByClassName('close')[0]; // Close button for the modal

// Retrieving favorite meals from local storage or initializing an empty array
let favouriteArray = JSON.parse(localStorage.getItem('favourites')) || [];

// Function to toggle favorite meals
function toggleFavorites(event) {
  event.preventDefault();
  let element = event.currentTarget;
  let mealId = element.id;

  // Add or remove the meal ID from the favorite array
  if (favouriteArray.includes(mealId)) {
    element.classList.remove('clicked');
    favouriteArray = favouriteArray.filter(id => id !== mealId);
  } else {
    element.classList.add('clicked');
    favouriteArray.push(mealId);
  }

  // Save updated favorites array to local storage
  localStorage.setItem('favourites', JSON.stringify(favouriteArray));
}

// Function to display more details of a meal in a modal
async function moreDetails(event) {
  let mealId = event.currentTarget.id;

  // Fetching meal details from the API
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  const meal = data.meals[0];

  // Setting the modal content
  modalBody.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
  `;

  // Display the modal
  modal.style.display = 'block';
}

// Function to create meal elements and display them in the mealsDiv
async function createMeals(URL) {
  mealsDiv.innerHTML = '<div class="loading">Loading...</div>'; // Display loading message

  try {
    // Fetching meals from the API
    const response = await fetch(URL);
    const data = await response.json();

    mealsDiv.innerHTML = ''; // Clear loading message

    let meals = data.meals;

    // Check if any meals are found
    if (meals) {
      for (let meal of meals) {
        // Creating a new div for each meal
        const div = document.createElement('div');
        div.classList.add('images');
        div.innerHTML = `
          <img src="${meal.strMealThumb}" alt="">
          <h4>${meal.strMeal}</h4>
          <button type="button" class='border-circle more-details' id='${meal.idMeal}'>More Details</button>
          <a href="" class='favourite' id='${meal.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

        // Adding the meal div to the mealsDiv
        mealsDiv.append(div);
      }

      // Adding event listeners to favorite buttons and more details buttons
      var favoriteButton = document.querySelectorAll('a');
      for (let button of favoriteButton) {
        button.addEventListener('click', toggleFavorites);
      }

      var moreDetailsbutton = document.querySelectorAll('.more-details');
      for (let button of moreDetailsbutton) {
        button.addEventListener('click', moreDetails);
      }
    } else {
      // Display error message if no meals are found
      mealsDiv.innerHTML = '<div class="error">No meals found. Please try a different search.</div>';
    }
  } catch (error) {
    // Display error message in case of a fetch error
    mealsDiv.innerHTML = '<div class="error">Error fetching meals. Please try again later.</div>';
    console.log(error);
  }
}

// Function to display search results based on the input value
function displaySearchResults() {
  let keyword = searchBar.value;
  let URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  createMeals(URL);
}

// Function to display a random meal
function displayRandomImage() {
  let URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
  createMeals(URL);
}

// Function to display favorite meals
async function displayFavoriteMeals() {
  mealsDiv.innerHTML = '<div class="loading">Loading...</div>'; // Display loading message

  try {
    mealsDiv.innerHTML = ''; // Clear loading message

    for (let meal of favouriteArray) {
      // Fetching meal details for each favorite meal
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
      const data = await response.json();
      let meals = data.meals[0];

      // Creating a new div for each favorite meal
      const div = document.createElement('div');
      div.classList.add('images');
      div.innerHTML = `
        <img src="${meals.strMealThumb}" alt="">
        <h4>${meals.strMeal}</h4>
        <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
        <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

      // Adding the meal div to the mealsDiv
      mealsDiv.append(div);

      // Adding event listeners to favorite buttons and more details buttons
      var favoriteButton = document.querySelectorAll('a');
      for (let button of favoriteButton) {
        button.addEventListener('click', toggleFavorites);
      }

      var moreDetailsbutton = document.querySelectorAll('.more-details');
      for (let button of moreDetailsbutton) {
        button.addEventListener('click', moreDetails);
      }
    }
  } catch (error) {
    // Display error message in case of a fetch error
    mealsDiv.innerHTML = '<div class="error">Error loading favorite meals. Please try again later.</div>';
    console.log(error);
  }
}

// Event listeners for search input, random meal button, and favorite meals button
searchBar.addEventListener('input', displaySearchResults);
randomButton.addEventListener('click', displayRandomImage);
myFavoriteMeals.addEventListener('click', displayFavoriteMeals);

// Event listeners for the modal close button and window click to close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
