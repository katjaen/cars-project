import {
	cleanId,
	processedCarsData,
	brandColors,
	cars,
	createCarData,
} from "./carsData.js"

let selectedCar = null

const availableCarsSection = document.getElementById("available-cars-sc")
const carOrderSection = document.getElementById("car-order-sc")
const purchaseSummarySection = document.getElementById("purchase-summary")

const carCardTemplate = document.getElementById("car-card-template")
const carCardButtonTemplate = document.getElementById(
	"car-card__button-template"
)
const carCardGridContainer = document.getElementById("cars-container-grid")

// const carCardChosenTemplate = document.getElementById(
// 	"car-card-chosen-template"
// )
const carCardChosenButtonTemplate = document.getElementById(
	"car-card-chosen__button-template"
)
const carCardChosenContainer = document.getElementById(
	"car-card-chosen-container"
)

const accessoriesListContainer = document.getElementById("accessories-list")
const orderListContainer = document.getElementById("order-summary-list")
const carOrderForm = document.getElementById("car-order-form")
const carOrderFormContainer = document.getElementById("form-container")
const formConfirmBtn = document.getElementById("form-confirm-btn")

let defaultPickupDate = null

availableCarsSection.hidden = false

function handleCardButtonClick(car) {
	selectedCar = car
	availableCarsSection.hidden = true
	carOrderSection.hidden = false
	renderCarCardChosen(selectedCar)
	styleChosenCard(selectedCar)
	renderAccessoriesList(selectedCar)
	// Dodaj tutaj inne funkcje renderujące dane dla wybranego samochodu
}

function createButton(car) {
	let buttonTemplate
	if (selectedCar) {
		buttonTemplate = carCardChosenButtonTemplate.content.cloneNode(true)
	} else {
		buttonTemplate = carCardButtonTemplate.content.cloneNode(true)
	}
	const button = buttonTemplate.querySelector(".car-card__button")
	button.addEventListener("click", () => {
		handleCardButtonClick(car)
	})
	return button
}

/**
 * Renders car cards into the specified container element.
 *
 * @return {void} This function does not return anything.
 */
function renderCarCards() {
	const container = carCardGridContainer
	const cardTemplate = carCardTemplate.content

	// Clear the container of any existing cards
	container.innerHTML = ""

	// Iterate over the processed car data and render each card
	processedCarsData.forEach(car => {
		const card = cardTemplate.cloneNode(true)

		card.querySelector(".brand-model").textContent = `${car.brand} ${car.model}`
		card.querySelector(".brand").textContent = car.brand
		card.querySelector(".model").textContent = car.model
		card.querySelector(".car-card__image").src = car.images[0]
		card.querySelector(".year").textContent = car.year
		card.querySelector(".engine-power").textContent = car.enginePower
		card.querySelector(".mileage").textContent = car.mileage
		card.querySelector(".price").textContent = car.price
		card
			.querySelector(".car-card")
			.style.setProperty("--car-bg", car.brandColor)

		const button = createButton(car)
		card.querySelector(".car-card__button-container").appendChild(button)
		container.appendChild(card)
	})
}
renderCarCards()

function renderCarCardChosen() {
	if (!selectedCar) {
		return
	}
	const container = carCardChosenContainer
	const cardTemplate = carCardTemplate.content

	// Clear the container of any existing cards
	container.innerHTML = ""

	// Iterate over the processed car data and render each card
	const card = cardTemplate.cloneNode(true)

	card.querySelector(".brand").textContent = selectedCar.brand
	card.querySelector(".model").textContent = selectedCar.model
	card.querySelector(".car-card__image").src = selectedCar.images[0]
	card.querySelector(".year").textContent = selectedCar.year
	card.querySelector(".engine-power").textContent = selectedCar.enginePower
	card.querySelector(".mileage").textContent = selectedCar.mileage
	card.querySelector(".price").textContent = selectedCar.price
	card
		.querySelector(".car-card")
		.style.setProperty("--car-bg", selectedCar.brandColor)

	const button = createButton(selectedCar)
	card.querySelector(".car-card__button-container").appendChild(button)

	container.appendChild(card)
}
renderCarCardChosen()

function styleChosenCard() {
	const chosenCard = carCardChosenContainer.querySelector(".car-card")
	const chosenCardDetails = carCardChosenContainer.querySelector(
		".car-card__details-container"
	)
	if (chosenCard) {
		chosenCard.classList.remove("car-card")
		chosenCard.classList.add("car-card--chosen")
		chosenCardDetails.classList.remove("car-card__details-container")
		chosenCardDetails.classList.add("car-card-chosen__details-container")
	}
}

styleChosenCard()

////////////////////////////////////
/////  render chosen car card  /////
////////////////////////////////////

////////////////////////////////////
////////  back home button  ////////
////////////////////////////////////

////////////////////////////////////
//////////  form section //////////
////////////////////////////////////

// Ustawienie domyślnej daty odbioru zamówienia na 14 dni od dnia dzisiejszego

const currentDate = new Date()
const datePicker = document.getElementById("pickupdate")

currentDate.setDate(currentDate.getDate() + 14)
defaultPickupDate = currentDate.toISOString().split("T")[0]
datePicker.value = defaultPickupDate
datePicker.min = defaultPickupDate

function renderAccessoriesList(car) {
	if (!accessoriesListContainer) {
		throw new Error("Failed to find accessories list container")
	}

	const itemTemplate = document.getElementById("accessory-li-template")
	if (!itemTemplate) {
		throw new Error("Failed to find accessory list item template")
	}
	// Sprawdzamy, czy selectedCar został ustawiony
	if (!selectedCar) {
		return
	}

	// Sprawdzamy, czy car jest wybranym samochodem
	if (car !== selectedCar) {
		return
	}
	accessoriesListContainer.innerHTML = ""

	if (
		!car.availableAccessories ||
		!Array.isArray(car.availableAccessories) ||
		car.availableAccessories.length === 0
	) {
		return
	}

	car.availableAccessories.forEach(accessory => {
		const itemClone = itemTemplate.content.cloneNode(true)
		const nameEl = itemClone.querySelector(".accessory-name")
		const priceEl = itemClone.querySelector(".accessory-price")

		nameEl.textContent = accessory.name
		priceEl.textContent = accessory.price

		const addColorSpan = itemClone.querySelector(".add-color-accessory")
		if (addColorSpan && accessory.id === "addColor") {
			addColorSpan.hidden = false
		}

		accessoriesListContainer.appendChild(itemClone)
	})
}
