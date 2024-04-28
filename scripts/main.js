import {
	cleanId,
	processedCarsData,
	brandColors,
	cars,
	createCarData,
} from "./carsData.js"

let selectedCar = null
let container = null

const availableCarsSection = document.getElementById("available-cars-sc")
const carOrderSection = document.getElementById("car-order-sc")
const purchaseSummarySection = document.getElementById("purchase-summary")

const carCardTemplate = document.getElementById("car-card-template")
const carCardButtonTemplate = document.getElementById(
	"car-card__button-template"
)
const carCardGridContainer = document.getElementById("cars-container-grid")

const carCardChosenTemplate = document.getElementById(
	"car-card-chosen-template"
)
const carCardChosenButtonTemplate = document.getElementById(
	"car-card-chosen__button-template"
)
const carCardChosenContainer = document.getElementById(
	"car-card-chosen-container"
)
let defaultPickupDate = null

availableCarsSection.hidden = false

function handleCardButtonClick(car) {
	selectedCar = car
	availableCarsSection.hidden = true
	carOrderSection.hidden = false
	renderAccessoriesList(selectedCar)
	// Dodaj tutaj inne funkcje renderujące dane dla wybranego samochodu
}

function renderCarCards() {
	const container = carCardGridContainer
	const cardTemplate = carCardTemplate.content
	const buttonTemplate = carCardButtonTemplate.content

	// Clear the container of any existing cards
	container.innerHTML = ""

	// Iterate over the processed car data and render each card
	processedCarsData.forEach(car => {
		const card = cardTemplate.cloneNode(true)
		const button = buttonTemplate.cloneNode(true)

		card.querySelector(".brand").textContent = car.brand
		card.querySelector(".model").textContent = car.model
		card.querySelector(".car-card__image").src = car.images[0]
		card.querySelector(".year").textContent = `Year: ${car.year}`
		card.querySelector(
			".engine-power"
		).textContent = `Engine Power: ${car.enginePower}`
		card.querySelector(".mileage").textContent = `Mileage: ${car.mileage}`
		card.querySelector(".price").textContent = `Price: ${car.price}`
		card
			.querySelector(".car-card")
			.style.setProperty("--car-bg", car.brandColor)

		button.querySelector(".car-card__button").textContent = "Want to have it?"
		button.querySelector(".car-card__button").addEventListener("click", () => {
			handleCardButtonClick(car)
		})

		card.querySelector(".car-card__button-container").appendChild(button)
		container.appendChild(card)
	})
}
renderCarCards()

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
	const listContainer = document.getElementById("accessories-list")
	if (!listContainer) {
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
	listContainer.innerHTML = ""

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

		listContainer.appendChild(itemClone)
	})
}
