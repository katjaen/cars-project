import { cleanId, processedCarsData, pickupPlaces } from "./carsData.js";

const carOrderSection = document.getElementById("car-order-sc");
const purchaseSummarySection = document.getElementById("purchase-summary-sc");
const chosenAccessoriesList = document.getElementById(
	"chosen-accessories-list"
);
const sortingAside = document.querySelector("aside.sorting");

const currentYearElement = document.getElementById("current-year");
currentYearElement.textContent = new Date().getFullYear();

const fullNameInput = document.getElementById("full-name");
const pickupDateInput = document.getElementById("pickup-date");
const pickupPlaceInput = document.getElementById("pickup-place");
const paymentMethodInputs = document.querySelectorAll(
	'input[name="paymentMethod"]'
);
const confirmOrderButton = document.getElementById("form-confirm-btn");

const fullNameErrorMessage = document.getElementById("fullname-invalid");
const pickupPlaceErrorMessage = document.getElementById("pickup-invalid");
const paymentErrorMessage = document.getElementById("payment-invalid");

const fullNameRegex = /^[\p{L}]+(?:['-][\p{L}]+)* [\p{L}]+(?:['-][\p{L}]+)*$/u;
const minimumDateForPickup = new Date();
minimumDateForPickup.setDate(minimumDateForPickup.getDate() + 14);

const answer = document.getElementById("heaven-hell-answer");
const finalCounterElement = document.getElementById("final-countdown");
const SummaryPickupPlace = document.getElementById("pickup-place-text");
let countdownInterval;

/**
 * Initializes the application by rendering all car cards.
 *
 * @return {void} No return value
 */
function initApp() {
	initializeWelcomePopup();
	handleGoHomeClick();
	attachGlobalEventListeners();
	restoreUserDataFromStorage();
	restoreOrdersFromStorage();
	clearLocalStorageEvery24Hours();

	console.log(
		"User data in local storage after app initialization:",
		JSON.parse(localStorage.getItem("userData")) || []
	);
	console.log(
		"Orders in local storage after app initialization:",
		JSON.parse(localStorage.getItem("orders")) || []
	);
}
initApp();

function attachGlobalEventListeners() {
	const backHomeButtons = document.querySelectorAll(
		".back-home-btn, .logo-clickable"
	);
	backHomeButtons.forEach(button =>
		button.addEventListener("click", handleGoHomeClick)
	);
}
function handleGoHomeClick() {
	appendCarCardsToContainer();
	toggleElementAttribute(sortingAside, "hidden", false);
	toggleElementAttribute(carOrderSection, "hidden", true);
	toggleElementAttribute(purchaseSummarySection, "hidden", true);
	toggleElementAttribute(finalCounterElement, "hidden", true);
	toggleElementAttribute(answer, "hidden", true);
	SummaryPickupPlace.style.textDecoration = "none";
	stopFinalCountAndCloseWindow();
}
// functions for section with car cards or car card
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
	const cardsContainer = document.getElementById("cars-container-grid");
	const carCardTemplate = document.getElementById("car-card-template");

	cardsContainer.innerHTML = "";

	if (chosenCar) {
		const renderedCard = carCardTemplate.content.cloneNode(true);
		renderCarCard(renderedCard, chosenCar);
		renderedCard.querySelector(".car-card").setAttribute("chosen", "");
		cardsContainer.appendChild(renderedCard);
	} else {
		cars.forEach(car => {
			const renderedCard = carCardTemplate.content.cloneNode(true);
			renderCarCard(renderedCard, car);
			cardsContainer.appendChild(renderedCard);
		});
	}
}
let chosenCar;
function handleCarCardButtonClick(car) {
	chosenCar = car;
	appendCarCardsToContainer(chosenCar);
	carouselCarImages(chosenCar);
	addOrUpdateUserDataToStorage(chosenCar);
	addOrderToStorage(chosenCar);
	updateCarOrderSection(chosenCar);
	chosenAccessoriesList.innerHTML = "";
	appendAccessoryListItems(chosenCar);
	restoreOrderStateFromStorage(chosenCar);
	addPickupPlacesToPickupPlaceInput();
	attachFormEventListeners();
	attachValidationListeners();
	toggleElementAttribute(sortingAside, "hidden", true);
	toggleElementAttribute(carOrderSection, "hidden", false);
	console.log(
		"Local storage orders updated after car card click:",
		JSON.parse(localStorage.getItem("orders"))
	);
}
// functions for car order section
function updateCarOrderSection(car) {
	updateElement(".brand", car.brand);
	updateElement(".model", car.model);
	updateElement(".car-price", car.price.toFixed(2));
	updateElement(".total-price-value", car.price.toFixed(2));
}
function renderAccessoryListItem(accessory, carId) {
	const templateId = getTemplateId(accessory.id);
	const template = document.getElementById(templateId);
	const item = document.importNode(template.content, true);

	setAccessoryItemDataset(
		item.querySelector(".accessory-item"),
		accessory.id,
		carId
	);
	setAccessoryName(item.querySelector(".accessory-name"), accessory.name);
	setAccessoryPrice(
		item.querySelector(".accessory-price"),
		accessory.price,
		accessory.id
	);
	setColorPicker(
		item.querySelector(".color-picker-input"),
		accessory.color,
		carId
	);
	setAccessoryButton(
		item.querySelector(".add-remove-btn"),
		accessory.id,
		carId
	);

	return item;
}
function setAccessoryItemDataset(accessoryItem, accessoryId, carId) {
	accessoryItem.dataset.accessoryId = accessoryId;
	accessoryItem.dataset.carId = carId;
}
function setAccessoryName(nameElement, name) {
	nameElement.textContent = name;
}
function setAccessoryPrice(priceElement, price, accessoryId) {
	if (priceElement) {
		priceElement.dataset.accessoryId = accessoryId;
		priceElement.textContent = price ? price.toFixed(2) : "N/A";
	}
}
function setColorPicker(colorPicker, color, carId) {
	if (colorPicker) {
		const selectedColor = getComputedStyle(document.documentElement)
			.getPropertyValue(color)
			.trim();
		colorPicker.value = selectedColor;
		colorPicker.dataset.carId = carId;
		setColorPickerEventHandler(colorPicker, selectedColor);
	}
}
function setAccessoryButton(accessoryButton, accessoryId, carId, color) {
	accessoryButton.dataset.accessoryId = accessoryId;
	accessoryButton.dataset.carId = carId;
	if (color) {
		accessoryButton.dataset.color = color;
	}
	accessoryButton.addEventListener("click", () =>
		handleAccessoryButtonClick(carId, accessoryId)
	);
}
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
	const { accessories } = chosenCar;

	if (!accessories) {
		throw new Error("Accessories array is missing");
	}

	accessories.forEach(accessory => {
		const listItem = renderAccessoryListItem(accessory, chosenCar.id);
		fragment.appendChild(listItem);
	});

	accessoriesList.appendChild(fragment);
	attachGlobalEventListeners();
}
let chosenColor;
function setColorPickerEventHandler(colorPickerInput) {
	colorPickerInput.addEventListener("input", ({ target }) => {
		const color = target.value;
		console.log("chosenColor:", color);
		document.documentElement.style.setProperty("--individual-color", color);
		colorPickerInput.dataset.color = color;
		chosenColor = color;
	});
}
function addChosenAccessoryListElement(accessoryId, carId) {
	const listItem = document.createElement("li");
	listItem.dataset.accessoryId = accessoryId;
	listItem.dataset.carId = carId;

	const spanName = document.createElement("span");
	const colon = document.createTextNode(": ");
	const spanPrice = document.createElement("span");

	const accessory = chosenCar.accessories.find(acc => acc.id === accessoryId);
	spanName.textContent = accessory.name;
	spanPrice.textContent = accessory.price;
	spanPrice.classList.add("accessory-price", "price-currency", "medium");

	if (accessoryId === "addColor") {
		listItem.classList.add("accessory-color-if-chosen");
	}

	listItem.appendChild(spanName);
	listItem.appendChild(colon);
	listItem.appendChild(spanPrice);

	chosenAccessoriesList.appendChild(listItem);
}
function removeChosenAccessoryListElement(accessoryId, carId) {
	const chosenAccessoriesListItem = chosenAccessoriesList.querySelector(
		`li[data-accessory-id="${accessoryId}"][data-car-id="${carId}"]`
	);
	if (chosenAccessoriesListItem) {
		chosenAccessoriesList.removeChild(chosenAccessoriesListItem);
	}
}
function handleAccessoryButtonClick(carId, accessoryId) {
	const orders = JSON.parse(localStorage.getItem("orders")) || {};
	const orderId = `order-${carId}`;
	const order = orders[orderId];
	if (!order) {
		return;
	}
	const accessory = order.accessories.find(acc => acc.id === accessoryId);
	const button = document.querySelector(
		`.add-remove-btn[data-car-id="${carId}"][data-accessory-id="${accessoryId}"]`
	);

	if (accessory) {
		removeAccessoryFromOrder(order, accessoryId);
		toggleElementAttribute(button, "selected", false);
		removeChosenAccessoryListElement(accessoryId, carId);
	} else {
		const chosenAccessory = chosenCar.accessories.find(
			acc => acc.id === accessoryId
		);
		const colorInput = document.querySelector(
			`.accessory-item[data-accessory-id="${accessoryId}"][data-car-id="${carId}"] input[type="color"]`
		);
		if (colorInput) {
			chosenColor = colorInput.value;
		}
		addAccessoryToOrder(order, chosenAccessory);
		toggleElementAttribute(button, "selected", true);
		addChosenAccessoryListElement(accessoryId, carId);
	}
	localStorage.setItem("orders", JSON.stringify(orders));
	updateTotalPrice(carId);

	console.log(
		"Local storage orders updated after accessory button click:",
		JSON.parse(localStorage.getItem("orders"))
	);
}

function updatePurchaseSummary(purchaseSummary) {
	const name = purchaseSummary.customerName.split(" ");
	const fullNameText = document.querySelector(".full-name-text");
	fullNameText.textContent = name
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");

	updateElement(".days-to-pickup", purchaseSummary.daysToPickup);
	updateElement(".brand", purchaseSummary.car.brand);
	updateElement(".model", purchaseSummary.car.model);
	updateElement(".pickup-place", purchaseSummary.pickupPlace);

	const orders = JSON.parse(localStorage.getItem("orders")) || {};
	const orderId = `order-${purchaseSummary.car.id}`;
	const order = orders[orderId];

	const summaryList = document.getElementById("summary-list");
	summaryList.innerHTML = "";

	console.log("Order:", order);
	console.log(
		"Accessories length:",
		order && order.accessories ? order.accessories.length : "N/A"
	);

	if (order && order.accessories && order.accessories.length > 0) {
		order.accessories.forEach(accessory => {
			const listItem = document.createElement("li");
			listItem.textContent = `${accessory.name}`;
			if (accessory.name === "Individual Color") {
				listItem.classList.add("accessory-color-if-chosen");
			}
			summaryList.appendChild(listItem);
		});
	}
	showPurchaseExtraMessage(purchaseSummary);
}

function finalCountAndCloseWindow(seconds) {
	let countdown = seconds;
	if (finalCounterElement) {
		finalCounterElement.textContent = countdown;
		countdownInterval = setInterval(() => {
			countdown--;
			finalCounterElement.textContent = countdown;
			if (countdown === 0) {
				clearInterval(countdownInterval);
				finalCounterElement.textContent = "bang!";
				setTimeout(() => {
					window.close();
				}, 1000);
			}
		}, 1000);
		return countdownInterval;
	}
}

function stopFinalCountAndCloseWindow() {
	clearInterval(countdownInterval);
	countdownInterval = null;
}

[
	...document.querySelectorAll("#heaven-hell-btn-2, #heaven-hell-btn-4"),
].forEach(btn => {
	btn.addEventListener("click", () => {
		answer.textContent =
			"You have a few seconds to change your mind and stop the final countdown!";

		finalCountAndCloseWindow(13);
		toggleElementAttribute(finalCounterElement, "hidden", false);
		toggleElementAttribute(answer, "hidden", false);
		SummaryPickupPlace.style.textDecoration = "none";
	});
});

document.getElementById("heaven-hell-btn-1").addEventListener("click", () => {
	answer.textContent = "See you in Hell, then!";
	stopFinalCountAndCloseWindow();
	toggleElementAttribute(finalCounterElement, "hidden", true);
	toggleElementAttribute(answer, "hidden", false);

	SummaryPickupPlace.style.textDecoration = "line-through";
});

document.getElementById("heaven-hell-btn-3").addEventListener("click", () => {
	answer.textContent = "All of Heaven is waiting for you!";
	stopFinalCountAndCloseWindow();
	toggleElementAttribute(finalCounterElement, "hidden", true);
	toggleElementAttribute(answer, "hidden", false);

	SummaryPickupPlace.style.textDecoration = "line-through";
});

function showPurchaseExtraMessage(purchaseSummary) {
	const miserMessage = document.getElementById("miser-message");
	const generousMessage = document.getElementById("generous-message");

	miserMessage.hidden = true;
	generousMessage.hidden = true;

	const isMiserInHeaven =
		purchaseSummary.paymentMethod === "Sour Jelly bears" &&
		purchaseSummary.pickupPlace === "Heaven";
	const isGenerousInHell =
		purchaseSummary.paymentMethod === "Sweet jelly bears and tip" &&
		purchaseSummary.pickupPlace === "Hell";

	if (isMiserInHeaven) {
		miserMessage.hidden = false;
	} else if (isGenerousInHell) {
		generousMessage.hidden = false;
	}
}

// functions for sorting car cards by brand
function setupBrandSorting(
	sortButtonElement,
	optionsContainerElement,
	optionsListElement
) {
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

	sortButtonElement.addEventListener("click", () => {
		isSorted = !isSorted;
		if (isSorted) {
			const uniqueBrands = getUniqueBrands(processedCarsData);
			optionsListElement.innerHTML = "";
			optionsListElement.appendChild(createBrandOption("All brands"));
			uniqueBrands.forEach(brand =>
				optionsListElement.appendChild(createBrandOption(brand))
			);
			optionsContainerElement.hidden = false;
		} else {
			optionsContainerElement.hidden = true;
		}
	});

	optionsContainerElement.addEventListener("click", event => {
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
			optionsContainerElement.hidden = true;
		}
	});
}

const sortButton = document.getElementById("sort-by-brand-btn");
const optionsWrapper = document.getElementById("brand-options-wrapper");
const optionsList = document.getElementById("brand-options-list");

if (sortButton && optionsWrapper && optionsList) {
	setupBrandSorting(sortButton, optionsWrapper, optionsList);
}

// functions for form order
function handleFormSubmission() {
	const customerName = fullNameInput.value.trim();
	const pickupDate = pickupDateInput.value;
	const selectedPickupPlace = pickupPlaceInput.value;
	const selectedPaymentMethod = document.querySelector(
		'input[name="paymentMethod"]:checked'
	);

	const isFormValid = validateForm();

	if (isFormValid && chosenCar) {
		const daysToPickup = calculateDaysToPickup(pickupDate);
		const selectedPaymentMethodLabel = selectedPaymentMethod
			? selectedPaymentMethod.labels[0].textContent.trim()
			: "";
		const purchaseSummary = {
			car: chosenCar,
			customerName,
			pickupDate,
			pickupPlace: selectedPickupPlace,
			daysToPickup,
			paymentMethod: selectedPaymentMethodLabel,
		};

		updatePurchaseSummary(purchaseSummary);
		toggleElementAttribute(carOrderSection, "hidden", true);
		toggleElementAttribute(purchaseSummarySection, "hidden", false);

		console.log("Before clearing local storage:", localStorage);
		clearLocalStorage();
		console.log("After clearing local storage:", localStorage);

		const selectedCarCard = document.querySelector(".car-card[chosen]");
		if (selectedCarCard) {
			selectedCarCard.querySelector(".car-card__btns-container").hidden = true;
			selectedCarCard.querySelector(".car-price").hidden = true;
		}

		fullNameInput.value = "";
		pickupDateInput.value = "";
		pickupPlaceInput.value = "";
		paymentMethodInputs.forEach(input => {
			input.checked = false;
		});
	}
}

function attachFormEventListeners() {
	confirmOrderButton.addEventListener("click", handleFormSubmission);
	fullNameInput.addEventListener("input", addOrUpdateUserDataToStorage);
	pickupDateInput.addEventListener("input", addOrUpdateUserDataToStorage);
	pickupPlaceInput.addEventListener("change", addOrUpdateUserDataToStorage);
	paymentMethodInputs.forEach(input => {
		input.addEventListener("change", addOrUpdateUserDataToStorage);
	});
}
function attachValidationListeners() {
	attachFullNameValidation();
	setMinimumAndCurrentDateForPickupDateInput();
	preventEmptyInputForPickupDateInput();
	hideOrShowPaymentErrorMessage();
	hideOrShowPickupPlaceErrorMessage();
}
function attachFullNameValidation() {
	fullNameInput.addEventListener("input", function () {
		const isFullNameValid = fullNameRegex.test(fullNameInput.value.trim());
		fullNameInput.toggleAttribute("valid", isFullNameValid);
		fullNameInput.toggleAttribute("invalid", !isFullNameValid);
		fullNameErrorMessage.hidden = isFullNameValid;
	});
}
function addPickupPlacesToPickupPlaceInput() {
	const existingOptions = pickupPlaceInput.querySelectorAll("option");
	const optionValues = Array.from(existingOptions).map(option => option.value);
	pickupPlaces.forEach(place => {
		if (!optionValues.includes(place.name)) {
			const option = document.createElement("option");
			option.value = place.name;
			option.textContent = place.name;
			pickupPlaceInput.appendChild(option);
		}
	});
}
function preventEmptyInputForPickupDateInput() {
	pickupDateInput.addEventListener("input", function () {
		if (pickupDateInput.value === "") {
			return;
		}
	});
}
function setMinimumAndCurrentDateForPickupDateInput() {
	const dateString = minimumDateForPickup.toISOString().split("T")[0];
	const isIOS = navigator.userAgent.match(/ipad|iphone/i);
	if (isIOS) {
		// workaround for iOS Safari
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		pickupDateInput.min = `${year}-${month}-${day}`;
		pickupDateInput.value = `${year}-${month}-${day}`;
	} else {
		// standard behavior
		pickupDateInput.min = dateString;
		pickupDateInput.value = dateString;
	}
}
function hideOrShowPickupPlaceErrorMessage() {
	pickupPlaceInput.addEventListener("change", function () {
		const hasPickupPlace = pickupPlaceInput.value !== "";
		pickupPlaceErrorMessage.hidden = hasPickupPlace;
	});
}
function hideOrShowPaymentErrorMessage() {
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

// functions for local storage
const clearLocalStorage = () => localStorage.clear();

function clearLocalStorageEvery24Hours() {
	setInterval(() => {
		localStorage.clear();
	}, 24 * 60 * 60 * 1000);
}

clearLocalStorageEvery24Hours();

// User
function addOrUpdateUserDataToStorage() {
	const userDataKey = `user_data`;

	const userData = {
		fullName: fullNameInput.value,
		pickupPlace: pickupPlaceInput.value,
		pickupDate: pickupDateInput.value,
		paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')
			?.value,
	};

	console.log("Local storage user data created or updated:", userData);

	localStorage.setItem(userDataKey, JSON.stringify(userData));
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
// Orders in local storage
function addOrderToStorage(chosenCar) {
	if (!chosenCar) return;

	const orders = JSON.parse(localStorage.getItem("orders")) || {};
	const orderId = `order-${chosenCar.id}`;
	const order = orders[orderId] || {
		id: chosenCar.id,
		brand: chosenCar.brand,
		model: chosenCar.model,
		price: chosenCar.price,
		totalPrice: chosenCar.price,
		accessories: [],
	};

	order.accessories.forEach(accessory => {
		order.totalPrice += accessory.price;
	});

	orders[orderId] = order;
	localStorage.setItem("orders", JSON.stringify(orders));
}
function restoreOrdersFromStorage() {
	return JSON.parse(localStorage.getItem("orders")) || [];
}
function restoreOrderStateFromStorage() {
	const orders = JSON.parse(localStorage.getItem("orders"));
	if (
		!orders ||
		typeof orders !== "object" ||
		!Array.isArray(Object.values(orders))
	)
		return;

	const currentOrder = orders[`order-${chosenCar.id}`];
	if (!currentOrder) return;

	currentOrder.accessories.forEach(accessory => {
		const button = document.querySelector(
			`.add-remove-btn[data-accessory-id="${accessory.id}"][data-car-id="${chosenCar.id}"]`
		);
		if (button) {
			button.setAttribute("selected", "");
			addChosenAccessoryListElement(accessory.id, chosenCar.id);
			updateTotalPrice(chosenCar.id);
		}
	});
}
function addAccessoryToOrder(order, accessory) {
	const newAccessory = {
		id: accessory.id,
		name: accessory.name,
		price: accessory.price,
	};
	if (accessory.id === "addColor" && chosenColor) {
		newAccessory.color = chosenColor;
	}
	order.accessories.push(newAccessory);
}
function removeAccessoryFromOrder(order, accessoryId) {
	order.accessories = order.accessories.filter(
		accessory => accessory.id !== accessoryId
	);
}
function updateTotalPrice(carId) {
	const orders = JSON.parse(localStorage.getItem("orders")) || {};
	const orderId = `order-${carId}`;
	const car = orders[orderId];

	if (!car) {
		return;
	}

	const totalPrice =
		car.price +
		car.accessories.reduce(
			(total, accessory) => total + parseFloat(accessory.price),
			0
		);

	updateElement("#total-price .total-price-value", totalPrice.toFixed(2));
	updateElement(
		"#total-price-purchase-summary .total-price-value",
		totalPrice.toFixed(2)
	);
}

// welcome popup
function initializeWelcomePopup() {
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
			if (document.hasFocus()) {
				timeLeft--;
				updateTimer();
				if (timeLeft <= 0) {
					clearInterval(interval);
					welcomePopup.style.display = "none";
				}
			} else {
				clearInterval(interval);
			}
		}, 1000);
	};

	welcomePopup.style.display = "block";
	startTimer();

	closeButton.addEventListener("click", () => {
		welcomePopup.style.display = "none";
		clearInterval(interval);
	});
}

// helper functions
function calculateDaysToPickup(pickupDate) {
	const currentDate = new Date();
	const timeDifference = new Date(pickupDate) - currentDate;
	const millisecondsInDay = 1000 * 60 * 60 * 24;
	const daysToPickup = Math.ceil(timeDifference / millisecondsInDay);
	return daysToPickup;
}
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
function updateElement(selector, value) {
	const elements = document.querySelectorAll(selector);
	elements.forEach(element => (element.textContent = value));
}

function toggleElementAttribute(element, attribute, value) {
	if (value) {
		element.setAttribute(attribute, "");
	} else {
		element.removeAttribute(attribute);
	}
}
