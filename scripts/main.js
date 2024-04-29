import {
	cleanId,
	processedCarsData,
	pickupPlaces,
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
const formConfirmButton = document.getElementById("form-confirm-btn")

const backButton = document.getElementById("back-home-btn")

const nameInputElement = document.getElementById("fullname")
const pickupPlaceInput = document.getElementById("pickupplace-input")
const pickupPlacesList = document.getElementById("pickup-places")
const pickupDateInput = document.getElementById("pickupdate-input")

availableCarsSection.hidden = false

function handleCarCardButtonClick(car) {
	try {
		if (!car) {
			throw new Error("Failed to find car in handleCarCardButtonClick")
		}
		selectedCar = car
		availableCarsSection.hidden = true
		carOrderSection.hidden = false
		renderCarCardChosen(selectedCar)
		// styleChosenCarCard(selectedCar)
		fillSelectedCarOrderHeaderData(selectedCar)
		renderAccessoriesList(selectedCar)
	} catch (error) {
		console.error(error)
	}
}

function createCarCardButton(car) {
	let buttonTemplate
	try {
		if (!car) {
			throw new Error("Failed to find car in createCarCardButton")
		}
		if (selectedCar) {
			buttonTemplate = carCardChosenButtonTemplate.content.cloneNode(true)
		} else {
			buttonTemplate = carCardButtonTemplate.content.cloneNode(true)
		}
		const button = buttonTemplate.querySelector(".car-card__button")
		button.addEventListener("click", () => {
			handleCarCardButtonClick(car)
		})
		return button
	} catch (error) {
		console.error(error)
	}
}

backButton.addEventListener("click", () => {
	try {
		carOrderSection.hidden = true
		purchaseSummarySection.hidden = true
		availableCarsSection.hidden = false
	} catch (error) {
		console.error(error)
	}
})
/**
 * Renders car cards into the specified container element.
 *
 * @return {void} This function does not return anything.
 */
function renderCarCardsAll() {
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
		card.querySelector(".car-card").classList.add("car-card--main-grid")

		const button = createCarCardButton(car)
		card.querySelector(".car-card__button-container").appendChild(button)
		container.appendChild(card)
	})
}
renderCarCardsAll()

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
	card.querySelector(".car-card").classList.add("car-card--chosen")
	card
		.querySelector(".car-card__details-container")
		.classList.add("car-card-chosen__details-container")

	const button = createCarCardButton(selectedCar)
	card.querySelector(".car-card__button-container").appendChild(button)

	container.appendChild(card)
}
renderCarCardChosen()

function fillSelectedCarOrderHeaderData() {
	// Pobierz elementy span
	const modelNameSpan = document.getElementById("chosen-model-name")
	const brandNameSpan = document.getElementById("chosen-brand-name")

	try {
		if (!selectedCar) {
			console.warn("No car selected")
			return
		}
		modelNameSpan.textContent = selectedCar.model
		brandNameSpan.textContent = selectedCar.brand
	} catch (error) {
		console.error(error)
	}
}
fillSelectedCarOrderHeaderData()

// set the minimum acceptance date to 14 days from the current date and put the minimum date as a placeholder in the input field
const minPickupDate = new Date()
minPickupDate.setDate(minPickupDate.getDate() + 14)
document.getElementById("pickupdate-input").min = minPickupDate
	.toISOString()
	.slice(0, 10)

// Get the name input element
// Utwórz wyrażenie regularne do walidacji imienia
const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)+$/

pickupPlaces.forEach(place => {
	const option = document.createElement("option")
	option.value = place.name
	pickupPlacesList.appendChild(option)
})

// Set a listen on the input event to check validation on the fly
if (nameInputElement) {
	nameInputElement.addEventListener("input", () => {
		// Check for bugs such as null pointer references, unhandled exceptions, and more.
		// If you don't see anything obvious, reply that things look good and that the user can reply with a stack trace to get more information.
		try {
			const nameValue = nameInputElement.value
			if (nameRegex.test(nameValue)) {
				nameInputElement.classList.remove("invalid")
				nameInputElement.classList.add("valid")
			} else {
				nameInputElement.classList.remove("valid")
				nameInputElement.classList.add("invalid")
			}
		} catch (error) {
			console.error(error)
		}
	})
}

// Funkcja obsługująca kliknięcia przycisków in accessories list

//
//
//
//
//
//
//
//

// Funkcja renderująca listę akcesoriów
function renderAccessoriesList(car) {
	try {
		if (!accessoriesListContainer) {
			throw new Error("Failed to find accessories list container")
		}
		const itemTemplate = document.getElementById("accessory-li-template")
		if (!itemTemplate) {
			throw new Error("Failed to find accessory list item template")
		}
		if (!selectedCar) {
			throw new Error("No car selected")
		}
		if (car !== selectedCar) {
			return
		}
		accessoriesListContainer.innerHTML = ""

		if (
			!car.availableAccessories ||
			!Array.isArray(car.availableAccessories) ||
			car.availableAccessories.length === 0
		) {
			const noAccesoriesParagraph = document.createElement("p")
			noAccesoriesParagraph.textContent = "No accessories available"
			accessoriesListContainer.appendChild(noAccesoriesParagraph)
			return
		}

		car.availableAccessories.forEach(accessory => {
			// Klonujemy element template
			const itemClone = itemTemplate.content.cloneNode(true)

			const nameEl = itemClone.querySelector(".accessory-name")
			const priceEl = itemClone.querySelector(".accessory-price")
			const addButton = itemClone.querySelector(".toggle-button")

			// Sprawdzamy, czy elementy dostępne
			if (!nameEl || !priceEl || !addButton) {
				throw new Error("Failed to find accessory element")
			}

			nameEl.textContent = accessory.name
			priceEl.textContent = accessory.price

			const addColorSpan = itemClone.querySelector(".add-color-accessory")
			if (addColorSpan && accessory.id === "addColor") {
				addColorSpan.hidden = false
			}

			// Sprawdzamy, czy akcesorium już istnieje w zamówieniu
			const orderItems = document
				.getElementById("order-summary-list")
				.getElementsByClassName("accessory-item-summary")
			const accessoryExists = Array.from(orderItems).some(item =>
				item.textContent.includes(accessory.name)
			)

			// Ustawiamy odpowiednią klasę przycisku w zależności od tego, czy akcesorium jest już w zamówieniu
			if (accessoryExists) {
				addButton.classList.remove("add-accessory")
				addButton.classList.add("remove-accessory")
				addButton.textContent = "-"
			} else {
				addButton.classList.remove("remove-accessory")
				addButton.classList.add("add-accessory")
				addButton.textContent = "+"
			}

			// Dodajemy klonowane elementy do listy akcesoriów
			accessoriesListContainer.appendChild(itemClone)
		})
	} catch (error) {
		console.error(error)
	}
}

function handleAccessoriesButtonsClick(addButton, accessory, orderSummaryList) {
	try {
		if (!orderSummaryList) {
			throw new Error("Failed to find order summary list")
		}
		if (!addButton) {
			throw new Error("Failed to find add button")
		}
		if (!accessory) {
			throw new Error("Failed to find accessory")
		}
	} catch (error) {
		console.error(error)
		return
	}

	addButton.addEventListener("click", () => {
		try {
			const orderItem = document.createElement("li")
			orderItem.classList.add("accessory-item-summary")
			orderItem.id = `accessory-${accessory.id}`
			orderItem.dataset.id = accessory.cleanId
			orderItem.innerHTML = `<span class="accessory-name">${accessory.name}</span> | <span class="accessory-price">${accessory.price}</span>`
			orderSummaryList.appendChild(orderItem)

			let order = JSON.parse(localStorage.getItem("order")) || []
			order.push({ name: accessory.name, price: accessory.price })
			localStorage.setItem("order", JSON.stringify(order))

			addButton.classList.remove("add-accessory")
			addButton.classList.add("remove-accessory")
			addButton.textContent = "-"

			const priceSpan = orderItem.querySelector(".accessory-price")
			if (!priceSpan) {
				throw new Error("Failed to find price span")
			}
			priceSpan.classList.add("price")

			// const ifColorPicker = orderItem.querySelector("add-color-accessory")
			// if (!ifColorPicker) {
			// 	throw new Error("Failed to find color picker")
			// }
			// ifColorPicker.classList.add("chosen-color")
		} catch (error) {
			console.error(error)
		}

		const orderItems = orderSummaryList.getElementsByClassName(
			"accessory-item-summary"
		)
		const accessoryExists = Array.from(orderItems).some(item =>
			item.textContent.includes(accessory.name)
		)

		if (accessoryExists) {
			addButton.classList.remove("add-accessory")
			addButton.classList.add("remove-accessory")
			addButton.textContent = "-"
		} else {
			addButton.classList.remove("remove-accessory")
			addButton.classList.add("add-accessory")
			addButton.textContent = "+"
		}
	})
}
// Funkcja do obsługi złożenia zamówienia
function submitOrder(event) {
	try {
		event.preventDefault() // Zapobiega domyślnemu zachowaniu przycisku "submit"

		// Pobierz dane z formularza
		const fullname = document.getElementById("fullname").value
		const pickupplace = document.getElementById("pickupplace").value
		const pickupdate = document.getElementById("pickupdate").value
		const chosenColor = document.getElementById("chosen-color").textContent
		// Pobierz więcej danych z formularza według potrzeb

		// Sprawdzamy, czy wszystkie dane zostały podane
		if (!fullname || !pickupplace || !pickupdate || !chosenColor) {
			throw new Error("All fields must be filled")
		}

		// Pobierz informacje o zamówieniu z local storage
		let order = JSON.parse(localStorage.getItem("order")) || {}

		// Pobierz informacje o wybranym pojeździe z local storage
		const selectedCar = JSON.parse(localStorage.getItem("selectedCar"))

		// Dodaj lub zaktualizuj zamówienie dla wybranego pojazdu
		order[selectedCar.id] = {
			fullname,
			pickupplace,
			pickupdate,
			chosenColor,
		} // Zakładam, że identyfikatorem pojazdu jest jego unikalne id

		// Zapisz zamówienia w local storage
		localStorage.setItem("order", JSON.stringify(order))

		// Możesz dodać dodatkowe operacje, np. powiadomienie użytkownika o złożeniu zamówienia
	} catch (error) {
		console.error(error)
	}
}

const colorPicker = document.getElementById("color-picker")
if (colorPicker) {
	colorPicker.addEventListener("input", function () {
		// W tym miejscu możesz zaktualizować wygląd elementu lub wykonać inne akcje po zmianie wartości color-picker
		const selectedColor = this.value
		console.log("Wybrany kolor:", selectedColor)
	})
}
