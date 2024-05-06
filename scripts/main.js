import { cleanId, processedCarsData, pickupPlaces } from "./carsData.js"

const availableCarsSection = document.getElementById("available-cars-sc")
const carOrderSection = document.getElementById("car-order-sc")
const purchaseSummarySection = document.getElementById("purchase-summary-sc")

const CardsContainer = document.getElementById("cars-container-grid")
const carCardTemplate = document.getElementById("car-card-template")

const fullName = document.getElementById("full-name")
const pickupDate = document.getElementById("pickup-date")
const pickupPlace = document.getElementById("pickup-place")

const orderSummaryList = document.getElementById("chosen-accessories-list")

function initApp() {
	renderCarCardsAll()
}

////////////////////////////////////////////////
//////////// back home button click ////////////
////////////////////////////////////////////////
const backHomeButton = document.getElementById("back-home-btn")
backHomeButton.addEventListener("click", resetOrderAndSummary)

function resetOrderAndSummary() {
	document.querySelectorAll(".car-card").forEach(card => {
		card.removeAttribute("hidden")
		card.removeAttribute("chosen")
	})

	carOrderSection.hidden = true
	purchaseSummarySection.hidden = true
}

function renderCarDetails(
	{ brand, model, images, year, enginePower, mileage, price },
	brandModel,
	brandName,
	modelName,
	image,
	yearElement,
	enginePowerElement,
	mileageElement,
	priceElement
) {
	image.src = images[0]
	image.alt = `${brand} ${model} ${year}`
	brandModel.textContent = `${brand} ${model}`
	brandName.textContent = brand
	modelName.textContent = model
	yearElement.textContent = year
	enginePowerElement.textContent = enginePower
	mileageElement.textContent = mileage
	priceElement.textContent = price
}

function renderAccessory(accessory, nameEl, priceEl) {
	nameEl.textContent = accessory.name
	priceEl.textContent = accessory.price
}

function renderCarCard(card, carData) {
	const cleanedId = cleanId(`${carData.model}-${carData.id}`)
	const car = card.querySelector(".car-card")
	car.id = cleanedId
	car.dataset.carId = carData.id
	car.dataset.brand = carData.brand
	car.dataset.model = carData.model
	car.dataset.year = carData.year
	car.dataset.price = carData.price
	car.style.setProperty("--car-bg", carData.brandColor)

	const brandModel = card.querySelector(".brand-model")
	const brand = card.querySelector(".brand")
	const model = card.querySelector(".model")
	const image = card.querySelector(".car-card__image")
	const year = card.querySelector(".year")
	const enginePower = card.querySelector(".engine-power")
	const mileage = card.querySelector(".mileage")
	const price = card.querySelector(".price")

	renderCarDetails(
		carData,
		brandModel,
		brand,
		model,
		image,
		year,
		enginePower,
		mileage,
		price
	)

	renderCarCardButtons(card, carData)
}
function renderCarCardsAll() {
	const container = CardsContainer
	const cardTemplate = carCardTemplate.content

	container.innerHTML = ""

	for (const car of processedCarsData) {
		const renderedCard = cardTemplate.cloneNode(true)
		renderCarCard(renderedCard, car)
		container.appendChild(renderedCard)
	}
}

function renderCarCardButtons(card, car) {
	const container = card.querySelector(".car-card__btns-container")
	const template = document.getElementById("car-card__btns-template")
	const buttons = template.content.cloneNode(true)
	const button = buttons.querySelector(".car-card__btn")
	const callButton = buttons.querySelector(".phone-btn")

	button.dataset.carId = car.id
	callButton.dataset.carId = car.id

	button.addEventListener("click", () => handleCarCardButtonClick(car))
	container.appendChild(buttons)
}
function handleCarCardButtonClick(car) {
	const chosenCard = document.getElementById(cleanId(`${car.model}-${car.id}`))
	if (!chosenCard) return

	chosenCard.setAttribute("chosen", "")
	car.chosen = true

	document.querySelectorAll(".car-card").forEach(card => {
		if (card !== chosenCard) {
			card.setAttribute("hidden", "")
		}
	})

	renderOrderSection(car)
	renderAccessoryList(car.availableAccessories)
	updateOrCreateOrder(car)
	updateUserData(car.id)
}

function renderOrderSection(chosenCar) {
	const orderSection = document.getElementById("car-order-sc")
	const carModelElement = document.querySelector("#car-order-sc .model")
	const carBrandElement = document.querySelector("#car-order-sc .brand")
	const carPriceElement = document.querySelector("#car-order-sc .price")
	const totalPriceElement = document.querySelector(
		"#car-order-sc .total-price-value"
	)

	orderSection.hidden = false

	carModelElement.textContent = chosenCar.model
	carBrandElement.textContent = chosenCar.brand
	carPriceElement.textContent = chosenCar.price

	totalPriceElement.textContent = calculateTotalPrice(
		chosenCar.price,
		getOrder(chosenCar.id).accessories
	)
}
function renderAccessoryList(accessories) {
	const listContainer = document.getElementById("accessories-list")
	listContainer.innerHTML = ""
	accessories.forEach(accessory => {
		const accessoryLiTemplate = document.getElementById("accessory-li-template")
		const listItem = accessoryLiTemplate.content.cloneNode(true)
		const nameElement = listItem.querySelector(".accessory-name")
		const priceElement = listItem.querySelector(".accessory-price")
		const colorInputElement = listItem.querySelector("input[type=color]")
		const accessoryItem = listItem.querySelector(".accessory-item")
		const addRemoveBtn = listItem.querySelector(".add-remove-btn")

		accessoryItem.dataset.accessoryId = accessory.id
		nameElement.textContent = accessory.name
		priceElement.textContent = accessory.price
		addRemoveBtn.dataset.accessoryId = accessory.id

		listContainer.appendChild(listItem)
	})
	removeAddColorIfNotPrimary()
}

function removeAddColorIfNotPrimary() {
	const listItems = document.querySelectorAll(".accessory-item")
	listItems.forEach(listItem => {
		const accessoryId = listItem.getAttribute("data-accessory-id")
		if (accessoryId !== "addColor") {
			const addColorSpan = listItem.querySelector(".add-color-input")
			if (addColorSpan) {
				listItem.removeChild(addColorSpan)
			}
		}
	})
}
// Dodaj nasłuchiwanie na zdarzenie kliknięcia przycisku dodawania/usuwania dodatków
const addRemoveAccessoryBtns = document.querySelectorAll(".add-remove-btn")
addRemoveAccessoryBtns.forEach(btn => {
	btn.addEventListener("click", event => {
		const accessory = event.target.dataset.accessory
		const addRemoveBtn = event.target
		handleAddRemoveAccessoryButtonClick(accessory, addRemoveBtn)
	})
})
function handleAddRemoveAccessoryButtonClick(accessoryId, addRemoveBtn) {
	const chosenAccessoriesList = document.getElementById(
		"chosen-accessories-list"
	)
	const orderData = getOrder(chosenCar.id)

	if (addRemoveBtn.getAttribute("add") !== null) {
		// Add accessory to chosenAccessoriesList
		const chosenAccessoryItem = createChosenAccessoryListItem(accessoryId)

		chosenAccessoriesList.appendChild(chosenAccessoryItem)

		// Add accessory to chosen accessories array in orderData
		orderData.chosenAccessories.push(accessoryId)

		// Update total price
		updateTotalPrice()

		addRemoveBtn.removeAttribute("add")
		addRemoveBtn.setAttribute("remove", "")
	} else {
		// Remove accessory from chosenAccessoriesList
		const accessoryItem = document.querySelector(
			`[data-accessory-id="${accessoryId}"]`
		)
		chosenAccessoriesList.removeChild(accessoryItem)

		// Remove accessory from chosen accessories array in orderData
		orderData.chosenAccessories = orderData.chosenAccessories.filter(
			a => a !== accessoryId
		)

		// Update total price
		updateTotalPrice()

		addRemoveBtn.removeAttribute("remove")
		addRemoveBtn.setAttribute("add", "")
	}
}

function createChosenAccessoryListItem(accessoryId) {
	const listItem = document.importNode(
		document.getElementById("accessory-li-template").content,
		true
	)

	const nameElement = listItem.querySelector(".accessory-name")
	const priceElement = listItem.querySelector(".accessory-price")

	const accessory = getAccessory(accessoryId)

	nameElement.textContent = accessory.name
	priceElement.textContent = accessory.price

	listItem.dataset.accessoryId = accessoryId

	return listItem
}

function updateTotalPrice() {
	document.getElementById("total-price-value").textContent =
		calculateTotalPrice(
			chosenCar.price,
			getOrder(chosenCar.id).chosenAccessories
		)
}

function calculateTotalPrice(carPrice, accessories) {
	let totalPrice = carPrice

	accessories.forEach(accessory => {
		totalPrice += accessory.price
	})

	return totalPrice
}
////////////////////////////////////////////////
//////// rendering list of pickupPlaces ////////
////////////////////////////////////////////////

pickupPlaces.forEach(place => {
	const option = document.createElement("option")
	option.value = place.id
	option.textContent = place.name
	pickupPlace.appendChild(option)
})

////////////////////////////////////////////////
////////// minimal date for pickupDate /////////
////////////////////////////////////////////////
const currentDate = new Date()
const minDate = new Date(currentDate)
minDate.setDate(currentDate.getDate() + 14)

pickupDate.min = minDate.toISOString().split("T")[0]
pickupDate.value = minDate.toISOString().split("T")[0]

//////////////////////////////////////
////// user & order object ///////////
//////////////////////////////////////

function updateOrCreateOrder(car) {
	try {
		console.log("updateOrCreateOrder called with", car)
		if (!car) {
			throw new Error("Null reference for car")
		}
		if (!car.id) {
			throw new Error("Car has no id")
		}

		console.log("Checking if order for car with id", car.id, "already exists")
		let orderData = getOrder(car.id)
		if (!orderData) {
			console.log("No order found, creating a new one")
			orderData = {
				car,
				accessories: [],
			}
		} else {
			console.log("Order found, updating existing one")
			orderData.car = car // Aktualizujemy istniejące zamówienie z nowymi danymi samochodu
		}
		saveOrder(orderData, car.id)
		console.log("Update/create order success")
	} catch (err) {
		console.error("Error in updateOrCreateOrder:", err)
		throw err
	}
}

function getOrder(carId) {
	try {
		let orderData = localStorage.getItem(`order-${carId}`)
		if (orderData === null) {
			return null
		}
		return JSON.parse(orderData)
	} catch (e) {
		if (e instanceof SyntaxError) {
			return null
		}
		throw e
	}
}

////////////////////////////////////////////////
///////////// ///////////
//////////////////////////////////////////////

function getChosenCar() {
	console.log("getChosenCar called")
	const chosenCard = document.querySelector(".car-card[chosen]")

	if (!chosenCard) {
		console.error("Null reference for chosenCard")
		return null
	}

	const carId = chosenCard.getAttribute("data-car-id")
	if (!carId) {
		console.error("Null reference for carId")
		return null
	}

	const chosenCarId = parseInt(carId)
	if (Number.isNaN(chosenCarId)) {
		console.error(`carId ${carId} is not a number`)
		return null
	}

	const chosenCar = processedCarsData.find(car => car.id === chosenCarId)
	if (!chosenCar) {
		console.error(
			`Could not find car with id ${chosenCarId} in processedCarsData`
		)
		return null
	}

	console.log("chosenCar:", chosenCar)
	return chosenCar
}

function updateUserData(user, carId) {
	let userData = localStorage.getItem("user")

	if (!userData) {
		userData = {
			fullName: user.fullName,
			pickupPlace: user.pickupPlace,
			pickupDate: user.pickupDate,
			paymentMethod: user.paymentMethod,
			carIds: [carId],
		}
	} else {
		userData = JSON.parse(userData)
		if (!userData.carIds.includes(carId)) {
			userData.carIds.push(carId)
		}
	}
	localStorage.setItem("user", JSON.stringify(userData))
}

function getUserDetails() {
	const user = {
		fullName: fullName.value,
		pickupPlace: pickupPlace.value,
		pickupDate: pickupDate.value,
		paymentMethod: paymentMethod.value,
	}
	return user
}

function clearUserDetails() {
	localStorage.removeItem("user")
}

function saveOrder(order, carId) {
	localStorage.setItem(`order-${carId}`, JSON.stringify(order))
}

function clearOrder(carId) {
	localStorage.removeItem(`order-${carId}`)
}
////////////////////////////////////////////////
///////////// accessory list render ////////////
////////////////////////////////////////////////

// TODO: add the ability to add and remove an accessory from the order

/////////////////////////////////////////////////////////////////
// Set a listen on the input event to check validation on the fly
/////////////////////////////////////////////////////////////////
const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+ [a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/

if (fullName) {
	fullName.addEventListener("input", () => {
		try {
			const nameValue = fullName.value
			if (nameValue === null || nameValue === undefined) {
				throw new Error("Null or undefined name value")
			}

			if (nameRegex.test(nameValue)) {
				fullName.removeAttribute("invalid")
				fullName.setAttribute("valid", "")
			} else {
				fullName.removeAttribute("valid")
				fullName.setAttribute("invalid", "")
			}
		} catch (error) {
			console.error(error)
		}
	})
} else {
	console.error("Could not find #full-name-input")
}
////////////////////////////////
// confirmation button click ///
///////////////////////////////
const confirmButton = document.getElementById("form-confirm-btn")
confirmButton.addEventListener("click", confirmOrder)

function confirmOrder() {
	if (!validateForm()) {
		alert("Fill in all required fields, please!")
		return
	}

	hideAvailableCars()
	hideCarOrder()
	showPurchaseSummary()
}

function hideAvailableCars() {
	availableCarsSection.hidden = true
}

function hideCarOrder() {
	carOrderSection.hidden = true
}

function showPurchaseSummary() {
	purchaseSummarySection.hidden = false
}

function handleFormSubmit() {
	if (!validateForm()) {
		return
	}

	hideAvailableCars()
	hideCarOrder()
	showPurchaseSummary()

	clearLocalStorage()
}

function validateForm() {
	const { value: fullNameValue } = fullName
	const { value: pickupDateValue } = pickupDate
	const { value: pickupPlaceValue } = pickupPlace
	const { value: paymentMethodValue } = paymentMethod

	return Boolean(
		fullNameValue && pickupDateValue && pickupPlaceValue && paymentMethodValue
	)
}

function clearLocalStorage() {
	localStorage.clear()
}

//////////////////////////////////////////////
///////// welcome popup & countdown //////////
//////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
	const welcomePopup = document.getElementById("welcome-popup")
	const closePopupBtn = document.getElementById("close-popup-btn")
	const timer = document.getElementById("countdown")

	let timeRemaining = 1.5 * 60 // tim
	let interval // variable to store setInterval()

	function updateTimer() {
		const minutes = Math.floor(timeRemaining / 60)
		const secondsLeft = timeRemaining % 60
		timer.textContent = `${minutes.toString().padStart(2, "0")}:${secondsLeft
			.toString()
			.padStart(2, "0")}`
	}

	function startTimer() {
		interval = setInterval(() => {
			timeRemaining--
			updateTimer()
			if (timeRemaining <= 0) {
				clearInterval(interval)
				welcomePopup.style.display = "none"
			}
		}, 1000)
	}

	welcomePopup.style.display = "block"
	startTimer()

	closePopupBtn.addEventListener("click", () => {
		welcomePopup.style.display = "none"
		clearInterval(interval)
	})
})

////////////////////////////////////////////////////////
//// get current year for copy text and other using ////
////////////////////////////////////////////////////////
const currentYear = new Date().getFullYear()
document.getElementById("current-year").textContent = currentYear

////////////////////////////////////////////////////
////// event listener for the page load event //////
////////////////////////////////////////////////////
window.addEventListener("load", () => {
	try {
		initApp() // Uruchomienie funkcji initApp() po załadowaniu strony
	} catch (error) {
		console.error(error)
	}
})
