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

let chosenCar = null

function initApp() {
	renderCarCardsAll()
	const chosenCard = document.querySelector(".car-card[chosen]")
	if (chosenCard) {
		const carId = chosenCard.getAttribute("data-car-id")
		updateTotalPrice(carId)
	}
}

// back home button click
const backHomeButton = document.getElementById("back-home-btn")
backHomeButton.addEventListener("click", resetOrderAndSummarySections)
function resetOrderAndSummarySections() {
	carOrderSection.hidden = true
	purchaseSummarySection.hidden = true
	showAllCarCards()
}
function showAllCarCards() {
	document.querySelectorAll(".car-card").forEach(card => {
		card.removeAttribute("hidden")
		card.removeAttribute("chosen")
	})
}

function renderCarDetails(
	carData,
	brandModel,
	brandName,
	modelName,
	image,
	yearElement,
	enginePowerElement,
	mileageElement,
	carPriceElement
) {
	if (brandModel) {
		brandModel.textContent = `${carData.brand} ${carData.model}`
	}
	if (brandName) {
		brandName.textContent = carData.brand
	}
	if (modelName) {
		modelName.textContent = carData.model
	}
	if (image) {
		image.src = carData.images[0]
		image.alt = `${carData.brand} ${carData.model} ${carData.year}`
	}
	if (yearElement) {
		yearElement.textContent = carData.year
	}
	if (enginePowerElement) {
		enginePowerElement.textContent = carData.enginePower
	}
	if (mileageElement) {
		mileageElement.textContent = carData.mileage
	}
	if (carPriceElement) {
		carPriceElement.textContent = carData.price
	}
}

function renderAccessory(accessory, nameAccElement, priceAccElement) {
	if (nameAccElement) {
		nameAccElement.textContent = accessory.name
	}
	if (priceAccElement) {
		priceAccElement.textContent = accessory.price
	}
}

function renderCarCard(card, carData) {
	if (!card) {
		throw new Error("Null reference for card")
	}
	if (!carData) {
		throw new Error("Null reference for carData")
	}
	const cleanedId = cleanId(`${carData.model}-${carData.id}`)
	const car = card.querySelector(".car-card")
	if (!car) {
		throw new Error("Null reference for car")
	}
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
	if (!CardsContainer) {
		throw new Error("Null reference for CardsContainer")
	}
	if (!carCardTemplate) {
		throw new Error("Null reference for carCardTemplate")
	}

	CardsContainer.innerHTML = ""

	for (const car of processedCarsData) {
		if (!car) {
			throw new Error("Null reference for car")
		}
		const renderedCard = carCardTemplate.content.cloneNode(true)
		renderCarCard(renderedCard, car)
		CardsContainer.appendChild(renderedCard)
	}
}

function renderCarCardButtons(card, carData) {
	if (!card) {
		throw new Error("Null reference for card")
	}
	if (!carData) {
		throw new Error("Null reference for carData")
	}
	const container = card.querySelector(".car-card__btns-container")
	const template = document.getElementById("car-card__btns-template")
	if (!template) {
		throw new Error("Null reference for template")
	}
	const buttons = template.content.cloneNode(true)
	const button = buttons.querySelector(".car-card__btn")
	const callButton = buttons.querySelector(".phone-btn")

	button.dataset.carId = carData.id
	callButton.dataset.carId = carData.id

	button.addEventListener("click", () => handleCarCardButtonClick(carData))
	container.appendChild(buttons)
}

function handleCarCardButtonClick(car) {
	const chosenCard = document.getElementById(cleanId(`${car.model}-${car.id}`))
	console.log("chosenCard", chosenCard)
	if (!chosenCard) {
		console.error(
			`Could not find car card with id ${cleanId(`${car.model}-${car.id}`)}`
		)
		throw new Error(
			`Could not find car card with id ${cleanId(`${car.model}-${car.id}`)}`
		)
	}

	chosenCard.setAttribute("chosen", "")
	car.chosen = true

	document.querySelectorAll(".car-card").forEach(card => {
		if (card !== chosenCard) {
			card.setAttribute("hidden", "")
		}
	})

	console.log("updating or creating order")
	updateOrCreateOrder(car)
	changeCarImage(car)
	renderOrderSection(car)
	renderAccessoryList(car.availableAccessories, car.id)
	console.log("updating user data")
	updateUserData(car.id)
}

function changeCarImage(chosenCar) {
	const imageElement = document.querySelector(
		`#${cleanId(`${chosenCar.model}-${chosenCar.id}`)} .car-card__image`
	)
	let currentImageIndex = 0

	setInterval(() => {
		currentImageIndex = (currentImageIndex + 1) % chosenCar.images.length
		imageElement.src = chosenCar.images[currentImageIndex]
	}, 4000)
}

function renderOrderSection(chosenCar) {
	const orderSection = document.getElementById("car-order-sc")
	const brandElements = document.querySelectorAll("#car-order-sc .brand")
	const modelElements = document.querySelectorAll("#car-order-sc .model")
	const carPriceElement = document.querySelector("#car-order-sc .price")
	const totalPriceElement = document.querySelector(
		"#car-order-sc .total-price-value"
	)

	orderSection.hidden = false

	brandElements.forEach(brandElement => {
		brandElement.textContent = chosenCar.brand
	})

	modelElements.forEach(modelElement => {
		modelElement.textContent = chosenCar.model
	})

	carPriceElement.textContent = chosenCar.price
	// updateTotalPrice(chosenCar, accessories)
}
// accessory list render
function renderAccessoryList(availableAccessories, carId) {
	const listContainer = document.getElementById("accessories-list")
	listContainer.innerHTML = ""
	availableAccessories.forEach(accessory => {
		const accessoryLiTemplate = document.getElementById("accessory-li-template")
		const listItem = accessoryLiTemplate.content.cloneNode(true)
		const nameAccElement = listItem.querySelector(".accessory-name")
		const priceAccElement = listItem.querySelector(".accessory-price")
		const colorInputElement = listItem.querySelector("input[type=color]")
		const accessoryItem = listItem.querySelector(".accessory-item")
		const addRemoveBtn = listItem.querySelector(".add-remove-btn")

		accessoryItem.dataset.accessoryId = accessory.id
		accessoryItem.dataset.carId = carId
		nameAccElement.textContent = accessory.name
		priceAccElement.textContent = accessory.price
		addRemoveBtn.dataset.accessoryId = accessory.id
		addRemoveBtn.dataset.carId = carId

		listContainer.appendChild(listItem)

		colorInputElement.addEventListener("input", handleColorInput)
	})
	removeAddColorIfNotPrimary()
}

function handleColorInput(event) {
	const accessoryItem = event.target.closest(".accessory-item")
	if (!accessoryItem) return
	const carId = accessoryItem.dataset.carId
	const car = processedCarsData.find(car => car.id === carId)
	if (!car) return

	const chosenAccessoryId = accessoryItem.dataset.accessoryId
	const chosenAccessory = car.availableAccessories.find(
		accessory => accessory.id === chosenAccessoryId
	)
	if (!chosenAccessory) return

	// TODO: update the input value in the UI for the chosen accessory
	// -------------------------------------------------------------
	const inputColorElement = event.target
	const accessoryListItem = inputColorElement.closest(".accessory-item")
	const colorDisplayElement =
		accessoryListItem.querySelector(".add-color-input")
	colorDisplayElement.textContent = `${inputColorElement.value}`

	chosenAccessory.color = inputColorElement.value

	updateOrder(carId, chosenAccessoryId, chosenAccessory)
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

function updateSummaryList(order) {
	const list = document.getElementById("chosen-accessories-list")
	list.innerHTML = ""

	order.accessories.forEach(accessory => {
		const item = document.createElement("li")
		item.textContent = `${accessory.name}: ${accessory.price.toFixed(2)}`
		item.dataset.accessoryId = accessory.id
		list.appendChild(item)
	})
}

function convertPricesToNumbers() {
	const priceElements = document.querySelectorAll(".price")
	priceElements.forEach(element => {
		const parsedPrice = parseFloat(element.textContent.trim())
		if (!isNaN(parsedPrice)) {
			element.textContent = parsedPrice
		}
	})
}

function updateTotalPrice(carId) {
	const carPriceElement = document.querySelector("#chosen-car .price")
	const totalPriceElement = document.querySelector(
		"#total-price .total-price-value"
	)

	const carPrice = parseFloat(carPriceElement.textContent.trim())
	const orderData = getOrder(carId)
	const totalAccessoriesPrice = orderData.accessories.reduce(
		(total, accessory) => {
			const accessoryPrice = parseFloat(accessory.price)
			return total + accessoryPrice
		},
		0
	)

	const totalPrice = carPrice + totalAccessoriesPrice
	totalPriceElement.textContent = totalPrice.toFixed(2)
}
function handleAccessoryButtonClick(event) {
	const listItem = event.target.closest(".accessory-item")
	if (!listItem) return

	const carId = listItem.dataset.carId
	const order = getOrder(carId)
	const accessoryId = listItem.dataset.accessoryId

	if (event.target.hasAttribute("add")) {
		const accessoryName = listItem.querySelector(".accessory-name").textContent
		const accessoryPrice = parseFloat(
			listItem
				.querySelector(".accessory-price")
				.textContent.replace(/[^\d.]/g, "")
		)

		order.accessories.push({
			id: accessoryId,
			name: accessoryName,
			price: accessoryPrice,
		})
		localStorage.setItem(`order-${carId}`, JSON.stringify(order))

		event.target.removeAttribute("add")
		event.target.setAttribute("remove", "")
		listItem.classList.add("selected-acc")
		updateSummaryList(order)
		updateTotalPrice(carId)
	} else if (event.target.hasAttribute("remove")) {
		order.accessories = order.accessories.filter(
			accessory => accessory.id !== accessoryId
		)
		localStorage.setItem(`order-${carId}`, JSON.stringify(order))

		const summaryItem = orderSummaryList.querySelector(
			`li[data-accessory-id="${accessoryId}"]`
		)
		if (summaryItem) {
			orderSummaryList.removeChild(summaryItem)
		}

		updateTotalPrice(carId)
		event.target.removeAttribute("remove")
		event.target.setAttribute("add", "")
		listItem.classList.remove("selected-acc")
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const accessoriesList = document.getElementById("accessories-list")
	accessoriesList.addEventListener("click", handleAccessoryButtonClick)
})

function handleAccessoryListClick(event) {
	const clickedElement = event.target
	if (clickedElement.nodeName === "BUTTON") {
		if (clickedElement.hasAttribute("add")) {
			handleAddAccessoryClick(event)
		} else if (clickedElement.hasAttribute("remove")) {
			handleRemoveAccessoryClick(event)
		}
	}
}

function calculateTotalPrice(carPrice, accessories) {
	let totalPrice = carPrice

	accessories.forEach(accessory => {
		totalPrice += accessory.price
	})

	return totalPrice
}

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
			orderData.car = car
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

// Set a listen on the input event to check validation on the fly
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
// confirmation button click handler
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

const form = document.getElementById("car-order-form")
form.addEventListener("submit", event => {
	event.preventDefault()

	handleFormSubmit()
	localStorage.clear()
})

function handleFormSubmit() {
	if (!validateForm()) {
		alert("Fill in all required fields, please!")
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

// welcome popup & countdown
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
//////// rendering list of pickupPlaces in the form
pickupPlaces.forEach(place => {
	const option = document.createElement("option")
	option.value = place.id
	option.textContent = place.name
	pickupPlace.appendChild(option)
})

////////// minimal date for pickupDate
const currentDate = new Date()
const minDate = new Date(currentDate)
minDate.setDate(currentDate.getDate() + 14)

pickupDate.min = minDate.toISOString().split("T")[0]
pickupDate.value = minDate.toISOString().split("T")[0]

//// get current year for copy text and other using
const currentYear = new Date().getFullYear()
document.getElementById("current-year").textContent = currentYear

////// event listener for the page load event
window.addEventListener("load", () => {
	try {
		initApp()
	} catch (error) {
		console.error(error)
	}
})
