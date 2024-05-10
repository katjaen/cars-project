export const pickupPlaces = [
	{ name: "Heaven", id: "heaven" },
	{ name: "Hell", id: "hell" },
]
export const defaulPickupPlacetOption = pickupPlaces[0]

export const sharedAccesories = [
	{ name: "Individual Color", id: "addColor", inputColor: "", price: 8000 },
	{ name: "Jet button", id: "jetBtn", price: 500 },
	{ name: "Autodestruction button", id: "destrBtn", price: 1000 },
]

export const brandColors = {
	"Dom's": "var(--bg1)",
	DeLorean: "var(--bg2)",
	Chevrolet: "var(--bg3)",
	Porsche: "var(--bg4)",
}

export const cars = [
	{
		id: 1,
		model: "Dodge Charger",
		brand: "Dom's",
		year: 1970,
		enginePower: "375",
		mileage: "50,000",
		price: 90000,
		images: [
			"./assets/Dom's Dodge Charger/42111_alt2.webp",
			"./assets/Dom's Dodge Charger/42111_alt3.webp",
			"./assets/Dom's Dodge Charger/42111_alt4.webp",
		],
		accessoriesByModel: [
			{ name: "Cameleon effect", price: 1500, id: "cameleon" },
		],
	},
	{
		id: 2,
		model: "DMC-12",
		brand: "DeLorean",
		year: 1981,
		enginePower: "130",
		mileage: "30,000",
		price: 70000,
		images: [
			"./assets/DeLorean DMC-12/10300_alt2.webp",
			"./assets/DeLorean DMC-12/10300_alt3.webp",
			"./assets/DeLorean DMC-12/10300_alt4.webp",
			"./assets/DeLorean DMC-12/10300_alt6.webp",
		],
		accessoriesByModel: [
			{ name: "Hovercraft function", price: 2000, id: "hovercraft" },
			{ name: "Lunar rover", price: 8000, id: "lunarRover" },
			{ name: "Frowning face", price: 1000, id: "frown" },
		],
	},
	{
		id: 3,
		model: "Camaro Z28",
		brand: "Chevrolet",
		year: 1969,
		enginePower: "290",
		mileage: "80,000",
		price: 55000,
		images: [
			"./assets/Chevrolet Camaro Z28/10304_alt4.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt8.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt4.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt5.webp",
		],
		accessoriesByModel: [],
	},
	{
		id: 4,
		model: "911",
		brand: "Porsche",
		year: 2022,
		enginePower: "450",
		mileage: "10,000",
		price: 150000,
		images: [
			"./assets/Porche 911/10295_alt12.webp",
			"./assets/Porche 911/10295_alt4.webp",
			"./assets/Porche 911/10295_alt14.webp",
			"./assets/Porche 911/10295.webp",
		],
		accessoriesByModel: [
			{ name: "autonomous driving", price: 20000, id: "autonomous" },
			{ name: "Pink windows", price: 5000, id: "pinkWindows" },
			{ name: "Cauliflower", price: 50, id: "cauliflower" },
		],
	},
	{
		id: 5,
		model: "Corvette",
		brand: "Chevrolet",
		year: 2020,
		enginePower: "490",
		mileage: "15,000",
		price: 85000,
		images: [
			"./assets/Corvette/10321_alt6.webp",
			"./assets/Corvette/10321_alt2.webp",
			"./assets/Corvette/10321_alt3.webp",
			"./assets/Corvette/10321_alt5.webp",
			"./assets/Corvette/10321_alt6.webp",
		],
		accessoriesByModel: [],
	},
]
// Processing car data
export function createCarData(car) {
	const {
		id,
		brand,
		model,
		year,
		enginePower,
		mileage,
		price,
		accessoriesByModel,
		images,
	} = car

	const brandColor = brandColors[brand] || "defaultColor" // add
	const accessories = Array.isArray(accessoriesByModel)
		? [...sharedAccesories, ...accessoriesByModel]
		: []

	return {
		id,
		brand,
		model,
		year,
		enginePower,
		mileage,
		price,
		images,
		brandColor,
		accessories,
	}
}

// Processing data about all cars using the createCarData function
export const processedCarsData = cars.map(createCarData)

export function cleanId(id) {
	return encodeURIComponent(id)
}
