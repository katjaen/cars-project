import { cleanId, processedCarsData, pickupPlaces } from "./carsData.js"

// const carCardsSection = document.getElementById("available-cars-sc")
const carOrderSection = document.getElementById("car-order-sc")
const purchaseSummarySection = document.getElementById("purchase-summary-sc")

const CardsContainer = document.getElementById("cars-container-grid")
const carCardTemplate = document.getElementById("car-card-template")

const fullNameInput = document.getElementById("full-name")
const pickupDateInput = document.getElementById("pickup-date")
const pickupPlaceInput = document.getElementById("pickup-place")

const orderSummaryList = document.getElementById("chosen-accessories-list")

function initApp() {
	renderCarCardsAll()
	// const chosenCard = document.querySelector(".car-card[chosen]")
	// if (chosenCard) {
	// 	const carId = chosenCard.dataset.carId
	// 	updateTotalPrice(carId)
	// }
}

// back home button click
const backHomeButtons = document.querySelectorAll(
	".back-home-btn, .logo-clickable"
)

backHomeButtons.forEach(button => {
	button.addEventListener("click", resetOrderAndSummarySections)
})

function resetOrderAndSummarySections() {
	hideCarOrder()
	hidePurchaseSummary()
	showCarCards()
}

function showCarCards() {
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
	carPriceElement,
	accessoryNameElements,
	accessoryPriceElements,
	accessoryColorInputs
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
		image.dataset.carId = carData.id
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
	if (accessoryNameElements && accessoryPriceElements && carData.accessories) {
		carData.accessories.forEach((accessory, index) => {
			accessoryNameElements[index].textContent = accessory.name
			accessoryPriceElements[index].textContent = accessory.price
		})
	}
	if (accessoryColorInputs && carData.accessories) {
		carData.accessories.forEach((accessory, index) => {
			if (accessory.color) {
				accessoryColorInputs[index].value = accessory.color
				// you can add additional logic to update accessory color
			}
		})
	}
	// TODO: Add additional logic to update accessory color
	// if (accessoryColorInputs[index]) {
	// })
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

/////////////////
////////////////

function handleCarCardButtonClick(chosenCar) {
	const chosenCard = document.getElementById(
		cleanId(`${chosenCar.model}-${chosenCar.id}`)
	)
	chosenCard.setAttribute("chosen", "")
	chosenCard.removeAttribute("hidden")
	document.querySelectorAll(".car-card").forEach(card => {
		if (card !== chosenCard) {
			card.setAttribute("hidden", "")
		}
	})
	updateOrCreateOrder(chosenCar)
	changeCarImage(chosenCar)
	renderOrderSection(chosenCar)
	renderAccessoryList(chosenCar.accessories, chosenCar.id)
	updateUserData(chosenCar.id)
}

function changeCarImage(chosenCar) {
	const carId = chosenCar.id
	const imageElements = document.querySelectorAll(`[data-car-id="${carId}"]`)

	if (!imageElements || imageElements.length === 0) {
		console.error(`No image found for car with id ${carId}`)
		return
	}

	imageElements.forEach(imageElement => {
		let currentImageIndex = 0
		setInterval(() => {
			currentImageIndex = (currentImageIndex + 1) % chosenCar.images.length
			imageElement.src = chosenCar.images[currentImageIndex]
		}, 4000)
	})
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

	carPriceElement.textContent = chosenCar.price.toFixed(2)
	totalPriceElement.textContent = chosenCar.price.toFixed(2)
}
// accessory list render
function renderAccessoryList(accessories, carId) {
	const listContainer = document.getElementById("accessories-list")
	listContainer.innerHTML = ""
	accessories.forEach(accessory => {
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
	const chosenAccessory = car.accessories.find(
		accessory => accessory.id === chosenAccessoryId
	)
	if (!chosenAccessory) return

	// TODO: update the input value in the UI for the chosen accessory
	// update summary li color to show the selected color by adding a class="chosen-color"
	// repair the summary list because it renders wrong after backbutton or reloading page
	// probably sth with localstorage that it needs to be fixed
	// or mayby it's a bug in the summary list or accessory list
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

function updateTotalPrice(carId) {
	const carPrice = parseFloat(
		document.querySelector(`#chosen-car .price`).textContent.trim()
	)
	const order = getOrder(carId)
	const totalAccessoriesPrice = order.accessories.reduce(
		(total, accessory) => total + parseFloat(accessory.price),
		0
	)

	const totalPrice = carPrice + totalAccessoriesPrice
	document.querySelector(`#total-price .total-price-value`).textContent =
		totalPrice.toFixed(2)
}

function handleAccessoryButtonClick(event) {
	const listItem = event.target.closest(".accessory-item")
	if (!listItem) return

	const carId = listItem.dataset.carId
	let order = getOrder(carId) // Pobierz zamówienie z local storage

	const accessoryId = listItem.dataset.accessoryId
	const accessoryName = listItem.querySelector(".accessory-name").textContent
	const accessoryPrice = parseFloat(
		listItem
			.querySelector(".accessory-price")
			.textContent.replace(/[^\d.]/g, "")
	)

	const addButton = event.target

	if (addButton.hasAttribute("add")) {
		if (!order) {
			order = { accessories: [] }
		}
		order.accessories.push({
			id: accessoryId,
			name: accessoryName,
			price: accessoryPrice,
		})
		localStorage.setItem(`order-${carId}`, JSON.stringify(order)) // Zapisz zamówienie do local storage

		addButton.removeAttribute("add")
		addButton.setAttribute("remove", "")
		listItem.classList.add("selected-acc")

		updateSummaryList(order) // Aktualizuj listę akcesoriów w podsumowaniu
		updateTotalPrice(carId) // Aktualizuj całkowitą cenę
	} else if (addButton.hasAttribute("remove")) {
		// Usuń akcesorium z zamówienia
		if (order) {
			order.accessories = order.accessories.filter(
				accessory => accessory.id !== accessoryId
			)
			localStorage.setItem(`order-${carId}`, JSON.stringify(order)) // Zapisz zamówienie do local storage
		}

		const summaryItem = orderSummaryList.querySelector(
			`li[data-accessory-id="${accessoryId}"]`
		)
		if (summaryItem) {
			orderSummaryList.removeChild(summaryItem)
		}

		addButton.removeAttribute("remove")
		addButton.setAttribute("add", "")
		listItem.classList.remove("selected-acc")

		updateTotalPrice(carId) // Aktualizuj całkowitą cenę
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const accessoriesList = document.getElementById("accessories-list")
	accessoriesList.addEventListener("click", handleAccessoryButtonClick)
})

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

function updateOrderSummaryFromLocalStorage(carId) {
	const order = getOrder(carId)
	if (order) {
		updateSummaryList(order) // Aktualizuj listę akcesoriów
		updateTotalPrice(carId) // Aktualizuj całkowitą cenę
	}
}

// Set a listen on the input event to check validation on the fly
const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+ [a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/

if (fullNameInput) {
	fullNameInput.addEventListener("input", () => {
		try {
			const nameValue = fullNameInput.value
			if (nameValue === null || nameValue === undefined) {
				throw new Error("Null or undefined name value")
			}

			if (nameRegex.test(nameValue)) {
				fullNameInput.removeAttribute("invalid")
				fullNameInput.setAttribute("valid", "")
			} else {
				fullNameInput.removeAttribute("valid")
				fullNameInput.setAttribute("invalid", "")
			}
		} catch (error) {
			console.error(error)
		}
	})
} else {
	console.error("Could not find #full-name-input")
}

const confirmOrderButton = document.getElementById("form-confirm-btn")

if (confirmOrderButton) {
	confirmOrderButton.addEventListener("click", function (event) {
		event.preventDefault()
		handleFormSubmit()
	})
} else {
	console.error("Nie można znaleźć #form-confirm-btn")
}

function handleFormSubmit() {
	console.groupCollapsed("handleFormSubmit()")
	console.log("handleFormSubmit()")

	const name = fullNameInput.value.trim()
	console.log("name:", name)

	const pickup = pickupPlaceInput.value.trim()
	console.log("pickup:", pickup)

	const paymentMethod = document.querySelector(
		'input[name="paymentMethod"]:checked'
	)
	console.log("paymentMethod:", paymentMethod)

	console.groupEnd()

	if (!name) {
		focusInput(fullNameInput)
		console.log("Please enter your full name.")
		return alert("Please enter your full name.")
	}

	const match = name.match(/\d+/)
	console.log("match:", match)
	if (match && match.length) {
		console.log(`Removing order with id: ${match[0]}`)
		localStorage.removeItem(`order-${match[0]}`)
	}

	if (!pickup) {
		console.log("Please select a pickup place.")
		return alert("Please select a pickup place.")
	}

	if (!paymentMethod) {
		console.log("Please select a payment method.")
		return alert("Please select a payment method.")
	}

	hideCarOrder()
	showPurchaseSummary()
	// updatePurchaseSummaryHtml()
}

function focusInput(input) {
	input.focus()
}

function hideCarOrder() {
	carOrderSection.hidden = true
}

function showPurchaseSummary() {
	purchaseSummarySection.hidden = false
}
function hidePurchaseSummary() {
	purchaseSummarySection.hidden = true
}

function updateUserData(user, carId) {
	const userDataString = localStorage.getItem("user")
	let userData = null

	if (userDataString) {
		userData = JSON.parse(userDataString)
	} else {
		userData = {
			fullNameInput: user.fullNameInput,
			pickupPlaceInput: user.pickupPlaceInput,
			pickupDateInput: user.pickupDateInput,
			paymentMethod: user.paymentMethod,
			carIds: [carId],
		}
	}

	if (!userData.carIds.includes(carId)) {
		userData.carIds.push(carId)
	}

	localStorage.setItem("user", JSON.stringify(userData))
}

function getUserDetails() {
	const selectedPaymentMethod = document.querySelector(
		'input[name="paymentMethod"]:checked'
	)

	const paymentMethodValue = selectedPaymentMethod
		? selectedPaymentMethod.value
		: null

	const user = {
		fullNameInput: fullNameInput.value,
		pickupPlaceInput: pickupPlaceInput.value,
		pickupDateInput: pickupDateInput.value,
		paymentMethod: paymentMethodValue,
	}

	return user
}

function saveOrder(order, carId) {
	localStorage.setItem(`order-${carId}`, JSON.stringify(order))
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

////////// minimal date for pickupDateInput
const currentDate = new Date()
const minDate = new Date(currentDate)
minDate.setDate(currentDate.getDate() + 14)

pickupDateInput.min = minDate.toISOString().split("T")[0]
pickupDateInput.value = minDate.toISOString().split("T")[0]

//// get current year for copy text and any other using
const currentYear = new Date().getFullYear()
document.getElementById("current-year").textContent = currentYear

////// event listener for the page load event
window.addEventListener("load", () => {
	try {
		initApp()
	} catch (error) {
		console.error(error)
	}
	const pickupPlaceInputElement = document.getElementById("pickup-place")
	pickupPlaces.forEach(place => {
		const option = document.createElement("option")
		option.value = place.id
		option.textContent = place.name
		pickupPlaceInputElement.appendChild(option)
	})
})
