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

////////////////////////////////////
///////  show/hide sections  ///////
////////////////////////////////////
const showSection = section => {
	if (section) {
		section.hidden = false
	}
}

const hideSection = section => {
	if (section) {
		section.hidden = true
	}
}

showSection(availableCarsSection)

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
				showSection(carOrderSection)
				hideSection(availableCarsSection)
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
