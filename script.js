// Get DOM elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const outputDisplay = document.getElementById('output');
let hasError = false;

// Function to remove unwanted characters from input strings
function cleanInput(input) {
    const regex = /[+-\s]/g; // Regex to match unwanted characters
    return input.replace(regex, ''); // Replace unwanted characters with an empty string
}

// Function to check if input is invalid
function isInputInvalid(input) {
    const regex = /\d+e\d+/i; // Regex to match scientific notation
    return input.match(regex); // Returns true if input is invalid
}

// Function to add a new entry based on the selected meal type
function addEntry() {
    const targetContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryCount = targetContainer.querySelectorAll('input[type="text"]').length + 1;

    // Create HTML for new entry input fields
    const entryHTML = `
        <label for="${entryDropdown.value}-${entryCount}-name">Entry ${entryCount} Name</label>
        <input type="text" id="${entryDropdown.value}-${entryCount}-name" placeholder="Name" />
        <label for="${entryDropdown.value}-${entryCount}-calories">Entry ${entryCount} Calories</label>
        <input
            type="number"
            min="0"
            id="${entryDropdown.value}-${entryCount}-calories"
            placeholder="Calories"
        />`;

    targetContainer.insertAdjacentHTML('beforeend', entryHTML); // Append new entry fields to the container
}

// Function to calculate total calories
function calculateCalories(e) {
    e.preventDefault(); // Prevent the default form submission
    hasError = false; // Reset error flag

    // Gather all calorie input fields from each meal type
    const breakfastInputs = document.querySelectorAll("#breakfast input[type='number']");
    const lunchInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerInputs = document.querySelectorAll("#dinner input[type='number']");
    const snackInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseInputs = document.querySelectorAll("#exercise input[type='number']");

    // Calculate total calories for each meal and the budget
    const breakfastCalories = calculateTotalCalories(breakfastInputs);
    const lunchCalories = calculateTotalCalories(lunchInputs);
    const dinnerCalories = calculateTotalCalories(dinnerInputs);
    const snackCalories = calculateTotalCalories(snackInputs);
    const exerciseCalories = calculateTotalCalories(exerciseInputs);
    const budgetCalories = calculateTotalCalories([budgetInput]);

    // If there's an error in inputs, stop calculation
    if (hasError) {
        return;
    }

    // Calculate consumed and remaining calories
    const totalConsumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
    const remainingCalories = budgetCalories - totalConsumedCalories + exerciseCalories;
    const calorieStatus = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    // Display output results
    outputDisplay.innerHTML = `
        <span class="${calorieStatus.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${calorieStatus}</span>
        <hr>
        <p>${budgetCalories} Calories Budgeted</p>
        <p>${totalConsumedCalories} Calories Consumed</p>
        <p>${exerciseCalories} Calories Burned</p>`;

    outputDisplay.classList.remove('hide'); // Show output
}

// Function to calculate total calories from a list of inputs
function calculateTotalCalories(inputList) {
    let totalCalories = 0;

    for (const input of inputList) {
        const cleanedValue = cleanInput(input.value); // Clean the input value
        const invalidMatch = isInputInvalid(cleanedValue); // Check for invalid input

        // If invalid input is found, alert the user and set error flag
        if (invalidMatch) {
            alert(`Invalid Input: ${invalidMatch[0]}`);
            hasError = true;
            return null; // Return null to indicate error
        }
        totalCalories += Number(cleanedValue); // Add valid calorie input to the total
    }
    return totalCalories; // Return the total calories
}

// Function to clear all inputs and output
function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    // Clear each input container
    for (const container of inputContainers) {
        container.innerHTML = '';
    }

    budgetInput.value = ''; // Clear budget input
    outputDisplay.innerText = ''; // Clear output display
    outputDisplay.classList.add('hide'); // Hide output display
}

// Event listeners for adding entries, calculating calories, and clearing form
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);