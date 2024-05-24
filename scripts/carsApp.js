import { cleanId, processedCarsData, pickupPlaces } from "./carsData.js";

const carCardsSection = document.getElementById("available-cars-sc");
const carOrderSection = document.getElementById("car-order-sc");
const purchaseSummarySection = document.getElementById("purchase-summary-sc");

const orderSummaryList = document.getElementById("chosen-accessories-list");
const sortingAside = document.querySelector("aside.sorting");

const carOrderForm = document.getElementById("car-order-form");

const fullNameInput = document.getElementById("full-name");
const pickupDateInput = document.getElementById("pickup-date");
const pickupPlaceInput = document.getElementById("pickup-place");
const paymentMethodInputs = document.querySelectorAll(
	'input[name="paymentMethod"]'
);

const fullNameErrorMessage = document.getElementById("fullname-invalid");
const pickupPlaceErrorMessage = document.getElementById("pickup-invalid");
const paymentErrorMessage = document.getElementById("payment-invalid");

const fullNameRegex =
	/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+ [a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;

const minimumDateForPickup = new Date();
minimumDateForPickup.setDate(minimumDateForPickup.getDate() + 14);

const currentYearElement = document.getElementById("current-year");
currentYearElement.textContent = new Date().getFullYear();

const clearLocalStorage = () => localStorage.clear();

/**
 * Initializes the application by rendering all car cards.
 *
 * @return {void} No return value
 */
function initApp() {
	console.log("Local storage before initApp:", localStorage);
	console.log(
		"Previous orders in local storage:",
		JSON.parse(localStorage.getItem("orders")) || []
	);
	appendCarCardsToContainer();
	attachGlobalEventListeners();
}

function attachGlobalEventListeners() {
	const backHomeButtons = document.querySelectorAll(
		".back-home-btn, .logo-clickable"
	);
	backHomeButtons.forEach(button =>
		button.addEventListener("click", goToHomeView)
	);

	const sortButton = document.getElementById("sort-by-brand-btn");
	const optionsWrapper = document.getElementById("brand-options-wrapper");
	const optionsList = document.getElementById("brand-options-list");

	if (sortButton && optionsWrapper && optionsList) {
		setupBrandSorting(sortButton, optionsWrapper, optionsList);
	}

	const confirmOrderButton = document.getElementById("form-confirm-btn");
	if (confirmOrderButton) {
		confirmOrderButton.addEventListener("click", handleFormSubmission);
	}

	const accessoriesList = document.getElementById("accessories-list");
	if (accessoriesList) {
		accessoriesList.addEventListener("click", handleAccessoryButtonClick);
	}

	attachColorInputListener();
}

function attachColorInputListener() {
	const colorPickerInput = document.getElementById("color-picker");

	if (colorPickerInput) {
		colorPickerInput.addEventListener("input", handleAccessoryColorInput);
	}
}

function setupBrandSorting(sortButton, optionsContainer, optionsList) {
	const getUniqueBrands = cars => [...new Set(cars.map(car => car.brand))];
	const createBrandOption = brand => {
		const option = document.createElement("li");
		option.textContent = brand;
		option.classList.add("brand-option");
		option.dataset.brand = brand;
		return option;
	};
	const filterCarsByBrand = (cars, brand) =>
		cars.filter(car => car.brand === brand);

	let isSorted = false;

	sortButton.addEventListener("click", () => {
		isSorted = !isSorted;
		if (isSorted) {
			const uniqueBrands = getUniqueBrands(processedCarsData);
			optionsList.innerHTML = "";
			optionsList.appendChild(createBrandOption("All brands"));
			uniqueBrands.forEach(brand =>
				optionsList.appendChild(createBrandOption(brand))
			);
			optionsContainer.hidden = false;
		} else {
			optionsContainer.hidden = true;
		}
	});

	optionsContainer.addEventListener("click", event => {
		const selectedOption = event.target.closest(".brand-option");
		if (selectedOption) {
			const selectedBrand = selectedOption.dataset.brand;
			if (selectedBrand === "All brands") {
				appendCarCardsToContainer();
			} else {
				const filteredCars = filterCarsByBrand(
					processedCarsData,
					selectedBrand
				);
				appendCarCardsToContainer(null, filteredCars);
				document
					.querySelectorAll(`.car-card[data-brand="${selectedBrand}"]`)
					.forEach(card => card.setAttribute("sorted", ""));
			}
			isSorted = false;
			optionsContainer.hidden = true;
		}
	});
}

function renderCarCard(card, car) {
	const { brand, model, year, enginePower, mileage, price, images } = car;
	const carCard = card.querySelector(".car-card");
	carCard.id = cleanId(`${model}-${car.id}`);
	carCard.dataset.carId = car.id;
	carCard.dataset.brand = brand;
	carCard.dataset.model = model;
	carCard.dataset.year = year;
	carCard.dataset.price = price;

	if (car.brandColor) {
		carCard.style.setProperty("--car-bg", car.brandColor);
	}

	const brandModel = card.querySelector(".brand-model");
	const brandElement = card.querySelector(".brand");
	const modelElement = card.querySelector(".model");
	const imageElement = card.querySelector(".car-card__image");
	const yearElement = card.querySelector(".year");
	const enginePowerElement = card.querySelector(".engine-power");
	const mileageElement = card.querySelector(".mileage");
	const priceElement = card.querySelector(".car-price");

	brandModel.textContent = `${brand} ${model}`;
	brandElement.textContent = brand;
	modelElement.textContent = model;
	imageElement.src = images[0];
	imageElement.alt = `${brand} ${model} ${year}`;
	imageElement.dataset.carId = car.id;
	yearElement.textContent = year;
	enginePowerElement.textContent = enginePower;
	mileageElement.textContent = mileage;
	priceElement.textContent = price.toFixed(2);

	renderAndAppendButtonsToCarCard(card, car);
}

function renderAndAppendButtonsToCarCard(card, car) {
	const buttonsContainer = card.querySelector(".car-card__btns-container");
	const buttonTemplate = document.getElementById("car-card__btns-template");
	const buttons = buttonTemplate.content.cloneNode(true);
	const buyButton = buttons.querySelector(".car-card__btn");
	const callButton = buttons.querySelector(".phone-btn");

	buyButton.dataset.carId = car.id;
	callButton.dataset.carId = car.id;

	buyButton.addEventListener("click", () => handleCarCardButtonClick(car));

	buttonsContainer.appendChild(buttons);
}

function appendCarCardsToContainer(chosenCar, cars = processedCarsData) {
	const CardsContainer = document.getElementById("cars-container-grid");
	const carCardTemplate = document.getElementById("car-card-template");

	CardsContainer.innerHTML = "";

	if (chosenCar) {
		const renderedCard = carCardTemplate.content.cloneNode(true);
		renderCarCard(renderedCard, chosenCar);
		renderedCard.querySelector(".car-card").setAttribute("chosen", "");
		CardsContainer.appendChild(renderedCard);
	} else {
		cars.forEach(car => {
			const renderedCard = carCardTemplate.content.cloneNode(true);
			renderCarCard(renderedCard, car);
			CardsContainer.appendChild(renderedCard);
		});
	}
}

let chosenCar;

function handleCarCardButtonClick(car) {
	console.log(
		"Local storage orders:",
		JSON.parse(localStorage.getItem("orders"))
	);
	clearSortedAttribute();
	chosenCar = car;
	appendCarCardsToContainer(chosenCar);
	updateOrCreateOrderInStorage(chosenCar);
	updateOrCreateUserDataInStorage(chosenCar);
	carouselCarImages(chosenCar);
	showCarOrder();
	hideSortingAside();
	updateCarOrderSection(chosenCar);
	appendAccessoryListItems(chosenCar);
	updateAccessoryButtonsFromLocalStorage(chosenCar);
	updateSummaryListFromLocalStorage(chosenCar);
	updateTotalPrice(chosenCar.id);

	console.log(
		"Local storage orders after updating:",
		JSON.parse(localStorage.getItem("orders"))
	);
}

function updateCarOrderSection(chosenCar) {
	updateElement(".brand", chosenCar.brand);
	updateElement(".model", chosenCar.model);
	updateElement(".car-price", chosenCar.price.toFixed(2));
	updateElement(".total-price-value", chosenCar.price.toFixed(2));
}
function updateOrCreateUserDataInStorage() {
	console.log("Updating or creating user data in storage");

	const userDataKey = `user_data`;

	const userData = {
		fullName: fullNameInput.value,
		pickupPlace: pickupPlaceInput.value,
		pickupDate: pickupDateInput.value,
		paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')
			?.value,
	};

	console.log("User data:", userData);

	localStorage.setItem(userDataKey, JSON.stringify(userData));

	console.log(
		"User data stored in local storage:",
		localStorage.getItem(userDataKey)
	);
}

function updateOrCreateOrderInStorage() {
	console.log("Updating or creating order in storage");
	if (!chosenCar) {
		throw new Error("No car selected");
	}

	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const existingOrderIndex = orders.findIndex(
		order => order.id === chosenCar.id
	);

	console.log("Existing order index:", existingOrderIndex);

	if (existingOrderIndex === -1) {
		// Tworzymy nowe zamówienie, jeśli nie istnieje
		orders.push({
			id: chosenCar.id,
			brand: chosenCar.brand,
			model: chosenCar.model,
			price: chosenCar.price,
			accessories: [],
		});
		console.log("Added new order:", orders[orders.length - 1]);
	}

	console.log("Setting orders in storage");
	localStorage.setItem("orders", JSON.stringify(orders));
}

function clearSortedAttribute() {
	document.querySelectorAll(".car-card[sorted]").forEach(card => {
		card.removeAttribute("sorted");
	});
}
// render accessory list from accessories array and based on html template
function renderAccessoryListItem(accessory, carId) {
	const templateId = getTemplateId(accessory.id);
	const template = document.getElementById(templateId);
	const item = document.importNode(template.content, true);

	const accessoryItem = item.querySelector(".accessory-item");
	accessoryItem.dataset.accessoryId = accessory.id;
	accessoryItem.dataset.carId = carId;

	const nameElement = item.querySelector(".accessory-name");
	nameElement.textContent = accessory.name;

	const priceElement = item.querySelector(".accessory-price");
	if (priceElement) {
		priceElement.textContent = accessory.price
			? accessory.price.toFixed(2)
			: "N/A";
	}

	const addRemoveBtn = item.querySelector(".add-remove-btn");
	addRemoveBtn.dataset.accessoryId = accessory.id;
	addRemoveBtn.dataset.carId = carId;

	return item;
}
// get template id based on accessory id
function getTemplateId(accessoryId) {
	return accessoryId === "addColor"
		? "accessory-li-template-add-color"
		: "accessory-li-template";
}

function appendAccessoryListItems() {
	const accessoriesList = document.getElementById("accessories-list");
	if (!accessoriesList) {
		throw new Error("Accessories list element not found");
	}

	accessoriesList.innerHTML = "";

	const fragment = document.createDocumentFragment();

	if (!chosenCar.accessories) {
		throw new Error("Accessories array is missing");
	}

	chosenCar.accessories.forEach(accessory => {
		const listItem = renderAccessoryListItem(accessory, chosenCar.id);
		fragment.appendChild(listItem);
	});

	accessoriesList.appendChild(fragment);
	attachColorInputListener();
}

function handleAccessoryButtonClick(event) {
	const button = event.target;
	const accessoryId = button.dataset.accessoryId;
	const carId = button.dataset.carId;

	const accessoryItem = findAccessoryItem(accessoryId, carId);
	const name = accessoryItem
		.querySelector(".accessory-name")
		.textContent.trim();
	const price = parseFloat(
		accessoryItem.querySelector(".accessory-price").textContent.trim()
	);
	const isSelected = button.hasAttribute("selected");
	const color = getSelectedColor(accessoryItem);

	const accessory = {
		id: accessoryId,
		name,
		price,
		selected: !isSelected,
		color,
	};

	updateSelectedAccessoriesInOrder(accessory, accessory.selected);
	updateSummaryListFromLocalStorage(accessory, accessory.selected);
	toggleAccessoryButtonState(button);
}

function findAccessoryItem(accessoryId, carId) {
	return document.querySelector(
		`.accessory-item[data-accessory-id="${accessoryId}"][data-car-id="${carId}"]`
	);
}

function getSelectedColor(accessoryItem) {
	const colorInput = accessoryItem.querySelector('input[type="color"]');
	return colorInput ? colorInput.value : undefined;
}

function toggleAccessoryButtonState(button) {
	if (button.hasAttribute("selected")) {
		button.removeAttribute("selected");
	} else {
		button.setAttribute("selected", "");
	}
}
function updateAccessoryButtonsFromLocalStorage() {
	const orders = JSON.parse(localStorage.getItem("orders")) || [];

	const order = orders.find(order => order.id === chosenCar.id);
	if (!order) {
		return;
	}

	order.accessories.forEach(accessory => {
		const button = document.querySelector(
			`.add-remove-btn[data-accessory-id="${accessory.id}"][data-car-id="${chosenCar.id}"]`
		);
		if (button) {
			button.setAttribute("selected", "");
		}
	});

	chosenCar.accessories.forEach(accessory => {
		if (!order.accessories.some(acc => acc.id === accessory.id)) {
			const button = document.querySelector(
				`.add-remove-btn[data-accessory-id="${accessory.id}"][data-car-id="${chosenCar.id}"]`
			);
			if (button) {
				button.removeAttribute("selected");
			}
		}
	});
}

function updateSummaryListFromLocalStorage() {
	const orders = JSON.parse(localStorage.getItem("orders")) || [];

	const order = orders.find(order => order.id === chosenCar.id);
	if (!order) {
		return;
	}

	const summaryListElement = document.getElementById("chosen-accessories-list");
	if (!summaryListElement) {
		throw new Error("Summary list element not found");
	}

	summaryListElement.innerHTML = "";

	order.accessories.forEach(accessory => {
		const listItem = createListItem(accessory);
		summaryListElement.appendChild(listItem);
	});
}

function createListItem(accessory) {
	const listItem = document.createElement("li");
	listItem.dataset.accessoryId = accessory.id;

	if (accessory.id === "addColor") {
		listItem.classList.add("accessory-color-if-chosen");
	}

	const accessoryName = document.createElement("span");
	accessoryName.textContent = `${accessory.name}: `;
	listItem.appendChild(accessoryName);

	const accessoryPrice = createPriceElement(accessory);
	listItem.appendChild(accessoryPrice);

	return listItem;
}

function createPriceElement(accessory) {
	const priceElement = document.createElement("span");
	priceElement.textContent = accessory.price.toFixed(2);
	priceElement.classList.add("price-currency", "medium");

	return priceElement;
}

function updateSelectedAccessoriesInOrder(accessory, isSelected) {
	if (!chosenCar) {
		throw new Error("No car selected");
	}

	const carId = chosenCar.id;

	const orders = JSON.parse(localStorage.getItem("orders")) || [];

	const existingOrderIndex = orders.findIndex(order => order.id === carId);

	if (existingOrderIndex === -1) {
		orders.push({
			id: chosenCar.id,
			brand: chosenCar.brand,
			model: chosenCar.model,
			price: chosenCar.price,
			accessories: [],
		});
	}

	const orderIndex = orders.findIndex(order => order.id === carId);
	const order = orders[orderIndex];

	if (isSelected) {
		const accessoryIndex = order.accessories.findIndex(
			acc => acc.id === accessory.id
		);
		if (accessoryIndex === -1) {
			order.accessories.push(accessory);
		}
	} else {
		order.accessories = order.accessories.filter(
			acc => acc.id !== accessory.id
		);
	}

	localStorage.setItem("orders", JSON.stringify(orders));

	updateTotalPrice(carId);
	console.log(localStorage.getItem("orders")); // Logowanie, aby sprawdzić, czy zamówienie zostało zaktualizowane
}

function handleAccessoryColorInput(event) {
	const accessoryItem = event.target.closest(".accessory-item");
	if (!accessoryItem) {
		throw new Error("Accessory item not found");
	}
	const carId = accessoryItem.dataset.carId;
	const chosenCar = processedCarsData.find(car => car.id === carId);
	const accessoryId = accessoryItem.dataset.accessoryId;
	const color = event.target.value;
	const action = accessoryItem
		.querySelector(".add-remove-btn")
		.hasAttribute("selected");

	const accessoryToUpdate = chosenCar.accessories.find(
		accessory => accessory.id === accessoryId
	);
	if (accessoryToUpdate) {
		accessoryToUpdate.color = color;
	}

	document.documentElement.style.setProperty("--chosen-input-color", color);

	console.log("Setting orders in storage");
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const order = orders.find(order => order.id === carId);
	if (order) {
		const accessoryIndex = order.accessories.findIndex(
			accessory => accessory.id === accessoryId
		);
		if (accessoryIndex !== -1) {
			order.accessories[accessoryIndex].color = color;
		}
	}

	localStorage.setItem("orders", JSON.stringify(orders));

	updateSelectedAccessoriesInOrder(carId, { id: accessoryId, color }, action);
	updateAccessoryButtonState(accessoryItem, accessoryId);
}

function updateTotalPrice(carId) {
	const order = JSON.parse(localStorage.getItem("orders")) || [];
	const selectedCar = order.find(car => car.id === carId);
	const totalAccessoriesPrice = selectedCar.accessories.reduce(
		(total, accessory) => total + parseFloat(accessory.price),
		0
	);

	const totalPrice = selectedCar.price + totalAccessoriesPrice;
	document.querySelector(`#total-price .total-price-value`).textContent =
		totalPrice.toFixed(2);
}

function goToHomeView() {
	appendCarCardsToContainer();
	showSortingAside();
	hideCarOrder();
	hidePurchaseSummary();
}
//////////////////////////////////////
///////// form validation ////////////
//////////////////////////////////////
function attachFormEventListeners() {
	fullNameInput.addEventListener("input", updateOrCreateUserDataInStorage);
	pickupDateInput.addEventListener("input", updateOrCreateUserDataInStorage);
	pickupPlaceInput.addEventListener("change", updateOrCreateUserDataInStorage);
	paymentMethodInputs.forEach(input => {
		input.addEventListener("change", updateOrCreateUserDataInStorage);
	});
}
function attachValidationListeners() {
	fullNameInput.addEventListener("input", function () {
		const isFullNameValid = fullNameRegex.test(fullNameInput.value.trim());
		fullNameInput.toggleAttribute("valid", isFullNameValid);
		fullNameInput.toggleAttribute("invalid", !isFullNameValid);
		fullNameErrorMessage.hidden = isFullNameValid;
	});
	pickupDateInput.min = minimumDateForPickup.toISOString().split("T")[0];
	pickupDateInput.value = minimumDateForPickup.toISOString().split("T")[0];
	pickupDateInput.addEventListener("input", function () {
		if (pickupDateInput.value === "") {
			return;
		}
	});
	pickupPlaces.forEach(place => {
		const option = document.createElement("option");
		option.value = place.name;
		option.textContent = place.name;
		pickupPlaceInput.appendChild(option);
	});
	pickupPlaceInput.addEventListener("change", function () {
		const hasPickupPlace = pickupPlaceInput.value !== "";
		pickupPlaceErrorMessage.hidden = hasPickupPlace;
	});

	paymentMethodInputs.forEach(input => {
		input.addEventListener("change", function () {
			const hasSelectedPaymentMethod = document.querySelector(
				'input[name="paymentMethod"]:checked'
			);
			paymentErrorMessage.hidden = hasSelectedPaymentMethod;
		});
	});
}

function validateForm() {
	let isFormValid = true;

	const isFullNameValid = fullNameRegex.test(fullNameInput.value.trim());
	fullNameInput.toggleAttribute("valid", isFullNameValid);
	fullNameInput.toggleAttribute("invalid", !isFullNameValid);
	fullNameErrorMessage.hidden = isFullNameValid;

	if (pickupDateInput.value === "") {
		isFormValid = false;
	}

	const hasPickupPlace = pickupPlaceInput.value !== "";
	pickupPlaceErrorMessage.hidden = hasPickupPlace;
	if (!hasPickupPlace) {
		isFormValid = false;
	}

	const hasSelectedPaymentMethod = document.querySelector(
		'input[name="paymentMethod"]:checked'
	);
	paymentErrorMessage.hidden = hasSelectedPaymentMethod;
	if (!hasSelectedPaymentMethod) {
		isFormValid = false;
	}

	return isFormValid;
}

function handleFormSubmission() {
	event.preventDefault();

	const customerName = fullNameInput.value.trim();
	const pickupDate = pickupDateInput.value;
	const selectedPickupPlace = pickupPlaceInput.value;
	const selectedPaymentMethod = document.querySelector(
		'input[name="paymentMethod"]:checked'
	);

	const isFormValid = validateForm();

	if (isFormValid && chosenCar) {
		const daysToPickup = calculateDaysToPickup(pickupDate);
		const purchaseSummary = {
			car: chosenCar,
			customerName,
			pickupDate,
			pickupPlace: selectedPickupPlace,
			daysToPickup,
		};

		updatePurchaseSummary(purchaseSummary);
		hideCarOrder();
		showPurchaseSummary();
		clearLocalStorage();
	}
}
function updatePurchaseSummary(purchaseSummary) {
	updateElement(".full-name-text", purchaseSummary.customerName);
	updateElement(".days-to-pickup", purchaseSummary.daysToPickup);
	updateElement(".brand", purchaseSummary.car.brand);
	updateElement(".model", purchaseSummary.car.model);
	updateElement(".year", purchaseSummary.car.year);
	updateElement(".pickup-place", purchaseSummary.pickupPlace);
}
function calculateDaysToPickup(pickupDate) {
	const currentDate = new Date();
	const timeDifference = new Date(pickupDate) - currentDate;
	const millisecondsInDay = 1000 * 60 * 60 * 24;
	const daysToPickup = Math.ceil(timeDifference / millisecondsInDay);
	return daysToPickup;
}
// function to update car images and show them in carousel
function carouselCarImages(car) {
	const carImages = document.querySelectorAll(`[data-car-id="${car.id}"]`);
	if (carImages.length === 0) return;

	let currentIndex = 0;
	const intervalId = setInterval(() => {
		currentIndex = (currentIndex + 1) % car.images.length;
		carImages.forEach(image => (image.src = car.images[currentIndex]));
	}, 4000);

	return () => clearInterval(intervalId);
}

function restoreUserDataFromStorage() {
	const userData = JSON.parse(localStorage.getItem("user_data"));
	if (userData) {
		fullNameInput.value = userData.fullName || "";
		pickupPlaceInput.value = userData.pickupPlace || "";
		pickupDateInput.value =
			userData.pickupDate || minimumDateForPickup.toISOString().split("T")[0];
		if (userData.paymentMethod) {
			document.querySelector(
				`input[name="paymentMethod"][value="${userData.paymentMethod}"]`
			).checked = true;
		}
	}
}
// function to update elements in the DOM
function updateElement(selector, value) {
	const elements = document.querySelectorAll(selector);
	elements.forEach(element => (element.textContent = value));
}

const showCarOrder = () => (carOrderSection.hidden = false);
const hideCarOrder = () => (carOrderSection.hidden = true);

const showSortingAside = () => (sortingAside.hidden = false);
const hideSortingAside = () => (sortingAside.hidden = true);

const showPurchaseSummary = () => (purchaseSummarySection.hidden = false);
const hidePurchaseSummary = () => (purchaseSummarySection.hidden = true);

document.addEventListener("DOMContentLoaded", () => {
	attachFormEventListeners();
	attachValidationListeners();
	restoreUserDataFromStorage();
	try {
		initApp();
	} catch (error) {
		console.error(error);
	}
});

// Welcome popup with closing countdown
document.addEventListener("DOMContentLoaded", () => {
	const welcomePopup = document.getElementById("welcome-popup");
	const closeButton = document.getElementById("close-popup-btn");
	const timer = document.getElementById("countdown");

	const popupDuration = 1.5 * 60;
	let timeLeft = popupDuration;
	let interval;

	const updateTimer = () => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	};

	const startTimer = () => {
		interval = setInterval(() => {
			timeLeft--;
			updateTimer();
			if (timeLeft <= 0) {
				clearInterval(interval);
				welcomePopup.style.display = "none";
			}
		}, 1000);
	};

	welcomePopup.style.display = "block";
	startTimer();

	closeButton.addEventListener("click", () => {
		welcomePopup.style.display = "none";
		clearInterval(interval);
	});
});
