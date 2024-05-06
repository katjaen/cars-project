import { cleanId, processedCarsData, pickupPlaces } from "./carsData.js"

const availableCarsSection = document.getElementById("available-cars-sc")
const carOrderSection = document.getElementById("car-order-sc")
const purchaseSummarySection = document.getElementById("purchase-summary-sc")

const CardsContainer = document.getElementById("cars-container-grid")
const carCardTemplate = document.getElementById("car-card-template")

const backHomeButton = document.getElementById("back-home-btn")

const fullName = document.getElementById("full-name")
const pickupDate = document.getElementById("pickup-date")
const pickupPlace = document.getElementById("pickup-place")

const accessoriesListContainer = document.getElementById("accessories-list")
const accessoryTemplate = document.getElementById("accessory-li-template")
const accessoriesList = document.getElementById("accessories-list")
const accessoriesButton = document.getElementById("accessories-btn")

const orderSummaryList = document.getElementById("chosen-accessories-list")

const formConfirmButton = document.getElementById("form-confirm-btn")

function initApp() {
	const container = CardsContainer
	if (!container)
		throw new ReferenceError("Could not find #cars-container-grid")
	renderCarCardsAll(container)
}

///////////////////////////////////////////////
/////////////  cars details render ////////////
///////////////////////////////////////////////
function renderCarDetails(
	car,
	brandModelElement,
	brandElement,
	modelElement,
	imageElement,
	yearElement,
	enginePowerElement,
	mileageElement,
	priceElement
) {
	if (
		!car ||
		!brandModelElement ||
		!brandElement ||
		!modelElement ||
		!imageElement ||
		!yearElement ||
		!enginePowerElement ||
		!mileageElement ||
		!priceElement
	) {
		throw new ReferenceError("Missing car data or elements")
	}

	brandModelElement.textContent = `${car.brand} ${car.model}`
	brandElement.textContent = car.brand
	modelElement.textContent = car.model
	imageElement.src = car.images[0]
	imageElement.alt = `${car.brand} ${car.model} ${car.year}`
	yearElement.textContent = car.year
	enginePowerElement.textContent = car.enginePower
	mileageElement.textContent = car.mileage
	priceElement.textContent = car.price
}

function renderAccessoryDetails(accessory, nameElement, priceElement) {
	if (!accessory || !nameElement || !priceElement) {
		throw new ReferenceError("Missing accessory data or elements")
	}
	nameElement.textContent = accessory.name
	priceElement.textContent = accessory.price
}

///////////////////////////////////////////////
/////////////// render car card //////////////
///////////////////////////////////////////////
function renderCarCard(card, car) {
	const cleanedId = cleanId(`${car.model}-${car.id}`)

	const carCard = card.querySelector(".car-card")
	carCard.id = cleanedId
	carCard.setAttribute("data-car-id", car.id)
	carCard.setAttribute("data-brand", car.brand)
	carCard.setAttribute("data-model", car.model)
	carCard.setAttribute("data-year", car.year)
	carCard.setAttribute("data-price", car.price)
	carCard.style.setProperty("--car-bg", car.brandColor)

	const brandModelElement = card.querySelector(".brand-model")
	const brandElement = card.querySelector(".brand")
	const modelElement = card.querySelector(".model")
	const imageElement = card.querySelector(".car-card__image")
	const yearElement = card.querySelector(".year")
	const enginePowerElement = card.querySelector(".engine-power")
	const mileageElement = card.querySelector(".mileage")
	const priceElement = card.querySelector(".price")

	try {
		renderCarDetails(
			car,
			brandModelElement,
			brandElement,
			modelElement,
			imageElement,
			yearElement,
			enginePowerElement,
			mileageElement,
			priceElement
		)
	} catch (error) {
		if (error instanceof ReferenceError) {
			console.error("Null reference when rendering car details")
		} else {
			console.error(error)
		}
	}

	renderCarCardButtons(card, car)
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
	if (!car) {
		throw new ReferenceError("Null reference for car")
	}

	const chosenCardId = cleanId(`${car.model}-${car.id}`)
	const chosenCard = document.getElementById(chosenCardId)
	if (!chosenCard) {
		throw new Error(`Could not find card with id: ${chosenCardId}`)
	}

	try {
		chosenCard.setAttribute("chosen", "")
		car.chosen = true

		const allCards = document.querySelectorAll(".car-card")
		if (!allCards) {
			throw new ReferenceError("Could not find any car cards")
		}

		allCards.forEach(card => {
			if (card !== chosenCard) {
				card.setAttribute("hidden", "")
			}
		})

		renderOrderSection(car.id)
		renderAccessoryList(car.availableAccessories)
		updateOrCreateOrder(car)
		updateUserData(car.id)
	} catch (err) {
		if (err instanceof TypeError) {
			throw err
		}

		if (!(err instanceof Error)) {
			throw new Error(`Unknown error: ${err}`)
		}

		throw err
	}
}

////////////////////////////////////////////////
//////////// back home button click ////////////
////////////////////////////////////////////////
backHomeButton.addEventListener("click", handleBackHomeButtonClick)
function handleBackHomeButtonClick() {
	if (!accessoriesList) {
		console.error("Null reference for accessoriesList")
		return
	}

	const allCards = document.querySelectorAll(".car-card")
	if (!allCards) {
		console.error("Could not find any car cards")
		return
	}

	allCards.forEach(card => {
		if (!card) {
			console.error("Null reference for card in handleBackHomeButtonClick")
			return
		}
		card.removeAttribute("hidden")
		card.removeAttribute("chosen")
	})

	try {
		accessoriesList.innerHTML = ""
	} catch (err) {
		if (err instanceof TypeError) {
			console.error("Could not set innerHTML of accessoriesList")
		} else {
			throw err
		}
	}

	if (!carOrderSection) {
		console.error("Could not find #car-order-section")
		return
	}

	try {
		carOrderSection.hidden = true
		purchaseSummarySection.hidden = true
	} catch (err) {
		if (err instanceof TypeError) {
			console.error(
				"Could not set hidden flag for carOrderSection or purchaseSummarySection"
			)
		} else {
			throw err
		}
	}
}

function renderOrderSection(carId) {
	const orderSection = document.getElementById("car-order-sc")
	const car = processedCarsData.find(({ id }) => id === carId)
	const order = getOrder(carId)
	const carModelElements = document.querySelectorAll("#car-order-sc .model")
	const carBrandElements = document.querySelectorAll("#car-order-sc .brand")
	const carPriceElement = document.querySelector("#car-order-sc .price")
	const accessoriesListContainer = document.getElementById("accessories-list")
	const totalPriceElement = document.querySelector(
		"#car-order-sc .total-price-value"
	)

	orderSection.hidden = false

	carModelElements.forEach(element => (element.textContent = car.model))
	carBrandElements.forEach(element => (element.textContent = car.brand))
	carPriceElement.textContent = car.price

	// accessoriesListContainer.innerHTML = ""

	totalPriceElement.textContent = calculateTotalPrice(
		car.price,
		order.accessories
	)
}
function renderAccessoryList(accessories) {
	const listContainer = document.getElementById("accessories-list")
	listContainer.innerHTML = ""
	accessories.forEach(accessory => {
		const template = document.getElementById("accessory-li-template")
		const listItem = template.content.cloneNode(true)
		const nameElement = listItem.querySelector(".name.accessory-name")
		const priceElement = listItem.querySelector(".accessory-price.price")
		const colorInputElement = listItem.querySelector("add-color-input")
		const accessoryItem = listItem.querySelector(".accessory-item")
		const accessoryNameSpan = listItem.querySelector(".name.accessory-name")
		const addColorInputSpan = listItem.querySelector(".add-color-input")
		const addRemoveBtn = listItem.querySelector(".add-remove-btn")

		accessoryItem.setAttribute("data-accessory-id", accessory.id)
		accessoryNameSpan.setAttribute("data-accessory-id", accessory.id)
		addColorInputSpan.setAttribute("data-accessory-id", accessory.id)
		addRemoveBtn.setAttribute("data-accessory-id", accessory.id)

		renderAccessoryDetails(
			accessory,
			nameElement,
			priceElement,
			colorInputElement
		)
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
function handleAddRemoveAccessoryButtonClick(accessory, addRemoveBtn) {
	const orderData = getOrder(chosenCar.id)
	const chosenAccessoriesList = document.getElementById(
		"chosen-accessories-list"
	)

	if (addRemoveBtn.getAttribute("add") !== null) {
		// Add accessory to chosenAccessoriesList
		const nameElement = listItem.querySelector(".accessory-name")
		const priceElement = listItem.querySelector(".accessory-price")

		nameElement.textContent = accessory.name
		priceElement.textContent = accessory.price

		chosenAccessoriesList.appendChild(listItem)

		// Add accessory to chosen accessories array in orderData
		orderData.chosenAccessories.push(accessory)

		// Update total price
		document.getElementById("total-price-value").textContent =
			calculateTotalPrice(chosenCar.price, orderData.chosenAccessories)

		addRemoveBtn.removeAttribute("add")
		addRemoveBtn.setAttribute("remove", "")
	} else if (addRemoveBtn.getAttribute("remove") !== null) {
		// Remove accessory from chosenAccessoriesList
		const chosenAccessoryItem = document.querySelector(
			`[data-accessory-id="${accessory.id}"]`
		)
		chosenAccessoriesList.removeChild(chosenAccessoryItem)

		// Remove accessory from chosen accessories array in orderData
		orderData.chosenAccessories = orderData.chosenAccessories.filter(
			a => a.id !== accessory.id
		)

		// Update total price
		document.getElementById("total-price-value").textContent =
			calculateTotalPrice(chosenCar.price, orderData.chosenAccessories)

		addRemoveBtn.removeAttribute("remove")
		addRemoveBtn.setAttribute("add", "")
	}
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
////// Obiekt user i order //////////
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
const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/
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
formConfirmButton.addEventListener("click", handleFormConfirmButtonClick)

function handleFormConfirmButtonClick() {
	if (!validateForm()) {
		alert("Fill in all required fields, please!")
		return
	}

	availableCarsSection.hidden = true
	carOrderSection.hidden = true
	purchaseSummarySection.hidden = false

	clearLocalStorage()
	alert("Thakns for your order!")
}

function validateForm() {
	if (
		!fullName.value ||
		!pickupDate.value ||
		!pickupPlace.value ||
		!paymentMethod.value
	) {
		return false
	}

	return true
}

function clearLocalStorage() {
	localStorage.clear()
}

////////////////////////////////
////  welcome popup code  //////
////////////////////////////////

const welcomePopup = document.getElementById("welcome-popup")
const closePopupBtn = document.getElementById("close-popup-btn")

closePopupBtn.addEventListener("click", hidePopupWithOverlay)
function showPopupWithOverlay() {
	welcomePopup.style.display = "block"
}

function hidePopupWithOverlay() {
	welcomePopup.style.display = "none"
}

//////////////////////////////////////////////
///////// welcome popup & countdown //////////
//////////////////////////////////////////////
// welcome popup countdown
function updateCountdown(time) {
	const countdownElement = document.getElementById("countdown")
	countdownElement.textContent = time
}
function startCountdown(minutes) {
	let remainingSeconds = minutes * 60
	updateCountdown(formatTime(remainingSeconds))

	const countdownInterval = setInterval(() => {
		remainingSeconds--

		if (remainingSeconds <= 0) {
			clearInterval(countdownInterval)
			hidePopupWithOverlay()
		} else {
			updateCountdown(formatTime(remainingSeconds))
		}
	}, 1000)
}
function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60) // count the number of minutes
	const remainingSeconds = seconds % 60 // count the number of seconds

	// format the time to "mm:ss"
	const formattedMinutes = String(minutes).padStart(2, "0") // leading zero
	const formattedSeconds = String(remainingSeconds).padStart(2, "0") // leading zero

	return `${formattedMinutes}:${formattedSeconds}`
}

// show welcome popup and start countdown
document.addEventListener("DOMContentLoaded", () => {
	showPopupWithOverlay()
	startCountdown(9) // start countdown for 9 minutes
})

/////////////////////////////////////////////////////////
/////// get current year for copy and other using ///////
/////////////////////////////////////////////////////////
const currentYear = new Date().getFullYear()
document.getElementById("current-year").textContent = currentYear

////////////////////////////////////////////////
//// event listener for the page load event ////
////////////////////////////////////////////////
window.addEventListener("load", () => {
	try {
		initApp() // Uruchomienie funkcji initApp() po załadowaniu strony
	} catch (error) {
		console.error(error)
	}
})
