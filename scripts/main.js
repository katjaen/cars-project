import {
	cleanId,
	processedCarsData,
	brandColors,
	cars,
	createCarData,
} from "./carsData.js"

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

////////////////////////////////////
////////  render car cards  ////////
////////////////////////////////////
function renderCarCards() {
	// Sprawdź, czy znaleziono kontener i szablony
	if (!carCardGridContainer || !carCardTemplate || !carCardButtonTemplate) {
		console.error("Nie znaleziono kontenera lub szablonów")
		return
	}

	// Usuń istniejące karty aut, jeśli istnieją
	carCardGridContainer.innerHTML = ""

	// Iteruj przez przetworzone dane o samochodach i renderuj karty
	processedCarsData.forEach(car => {
		// Sklonuj szablon karty auta
		const carCardClone = carCardTemplate.content.cloneNode(true)

		// Uzupełnij dane na karcie auta
		carCardClone.querySelector(".brand").textContent = car.brand
		carCardClone.querySelector(".model").textContent = car.model
		carCardClone.querySelector(".car-card__image").src = car.images[0]
		carCardClone.querySelector(".year").textContent = `Year: ${car.year}`
		carCardClone.querySelector(
			".engine-power"
		).textContent = `Engine Power: ${car.enginePower}`
		carCardClone.querySelector(
			".mileage"
		).textContent = `Mileage: ${car.mileage}`
		carCardClone.querySelector(".price").textContent = `Price: ${car.price}`
		carCardClone
			.querySelector(".car-card")
			.style.setProperty("--car-bg", car.brandColor)

		// Renderuj button na karcie auta
		const buttonClone = carCardButtonTemplate.content.cloneNode(true)
		buttonClone.querySelector(".car-card__button").textContent =
			"Want to have it?"
		buttonClone
			.querySelector(".car-card__button")
			.addEventListener("click", () => {
				availableCarsSection.hidden = true
				carOrderSection.hidden = false
				renderAccessoriesList(car)

				// Tutaj umieść logikę obsługi kliknięcia przycisku
				console.log(`Kliknięto przycisk dla samochodu ${car.model} ${car.id}`)
			})
		carCardClone
			.querySelector(".car-card__button-container")
			.appendChild(buttonClone)

		// Dodaj sklonowaną kartę auta do kontenera
		carCardGridContainer.appendChild(carCardClone)
	})
}

// Wywołaj funkcję renderującą karty aut
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
	const container = document.getElementById("accessories-list")
	if (container === null) {
		throw new Error("Failed to find accessories list container")
	}

	const accessoryLiTemplate = document.getElementById("accessory-li-template")
	if (accessoryLiTemplate === null) {
		throw new Error("Failed to find accessory list item template")
	}

	container.innerHTML = "" // Clear current list items

	if (
		car.availableAccessories === null ||
		!Array.isArray(car.availableAccessories) ||
		car.availableAccessories.length === 0
	) {
		console.error("Brak akcesoriów lub nieprawidłowy format danych")
		return
	}

	car.availableAccessories.forEach(accessory => {
		const accessoryLiClone = accessoryLiTemplate.content.cloneNode(true)
		const nameEl = accessoryLiClone.querySelector(".accessory-name")
		if (nameEl === null) {
			throw new Error("Failed to find accessory name element")
		}
		nameEl.textContent = accessory.name

		const priceEl = accessoryLiClone.querySelector(".accessory-price")
		if (priceEl === null) {
			throw new Error("Failed to find accessory price element")
		}
		priceEl.textContent = accessory.price

		const addColorSpan = accessoryLiClone.querySelector(".add-color-accessory")
		if (addColorSpan !== null && accessory.id === "addColor") {
			addColorSpan.hidden = false
		}

		container.appendChild(accessoryLiClone)
	})
}

// Ustaw domyślną wartość koloru inputa na wartość zmiennej CSS
// document.getElementById("color-picker").value = "--individualcar"
