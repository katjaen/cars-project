export const pickupPlaces = [
	{ name: "Heaven", id: "heaven" },
	{ name: "Hell", id: "hell" },
];

const sharedAccessories = [
	{
		name: "Individual Color",
		id: "addColor",
		color: "--individual-color",
		price: 8000,
	},
	{ name: "Jet button", id: "jetBtn", price: 500 },
	{ name: "Autodestruction button", id: "destrBtn", price: 1000 },
];

const brandColors = {
	defaultColor: "var(--car-bg)",
	"Dom's": "var(--bg1)",
	DeLorean: "var(--bg2)",
	Chevrolet: "var(--bg3)",
	Porsche: "var(--bg4)",
	Ferrari: "var(--bg5)",
	Pagani: "var(--bg6)",
};

const cars = [
	{
		id: 1,
		model: "Dodge Charger",
		brand: "Dom's",
		year: 1970,
		enginePower: 375,
		mileage: 50000,
		price: 90000,
		images: [
			"./assets/Dom's Dodge Charger/42111_alt2.webp",
			"./assets/Dom's Dodge Charger/42111_alt3.webp",
			"./assets/Dom's Dodge Charger/42111_alt4.webp",
		],
		accessories: [{ name: "Cameleon effect", price: 1500, id: "cameleon" }],
	},
	{
		id: 2,
		model: "DMC-12",
		brand: "DeLorean",
		year: 1981,
		enginePower: 130,
		mileage: 30000,
		price: 70000,
		images: [
			"./assets/DeLorean DMC-12/10300_alt2.webp",
			"./assets/DeLorean DMC-12/10300_alt3.webp",
			"./assets/DeLorean DMC-12/10300_alt4.webp",
			"./assets/DeLorean DMC-12/10300_alt6.webp",
		],
		accessories: [
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
		enginePower: 290,
		mileage: 80000,
		price: 55000,
		images: [
			"./assets/Chevrolet Camaro Z28/10304_alt4.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt8.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt4.webp",
			"./assets/Chevrolet Camaro Z28/10304_alt5.webp",
		],
		accessories: [],
	},
	{
		id: 4,
		model: "911",
		brand: "Porsche",
		year: 2022,
		enginePower: 450,
		mileage: 10000,
		price: 150000,
		images: [
			"./assets/Porche 911/10295_alt12.webp",
			"./assets/Porche 911/10295_alt4.webp",
			"./assets/Porche 911/10295_alt14.webp",
			"./assets/Porche 911/10295.webp",
		],
		accessories: [
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
		enginePower: 490,
		mileage: 15000,
		price: 85000,
		images: [
			"./assets/Corvette/10321_alt6.webp",
			"./assets/Corvette/10321_alt2.webp",
			"./assets/Corvette/10321_alt3.webp",
			"./assets/Corvette/10321_alt5.webp",
			"./assets/Corvette/10321_alt6.webp",
		],
		accessories: [],
	},
	{
		id: 6,
		model: "Utopia",
		brand: "Pagani",
		year: 2023,
		enginePower: 864,
		mileage: 1000,
		price: 3000000,
		images: [
			"./assets/Pagani Utopia/76915_alt3.webp",
			"./assets/Pagani Utopia/76915_alt4.webp",
			"./assets/Pagani Utopia/76915.webp",
		],
		accessories: [{ name: "Custom interior", price: 20000, id: "interior" }],
	},
	{
		id: 7,
		model: "Daytona SP3",
		brand: "Ferrari",
		year: 2022,
		enginePower: 829,
		mileage: 5000,
		price: 2000000,
		images: [
			"./assets/Ferrari Daytona SP3/42143_alt2.webp",
			"./assets/Ferrari Daytona SP3/42143_alt3.webp",
			"./assets/Ferrari Daytona SP3/42143_alt4.webp",
			"./assets/Ferrari Daytona SP3/42143_alt13.webp",
		],
		accessories: [{ name: "Carbon fiber trim", price: 15000, id: "carbon" }],
	},
	{
		id: 6,
		model: "Corvette ZR1",
		brand: "Chevrolet",
		year: "",
		enginePower: 755,
		mileage: 10000,
		price: 120000,
		images: [
			"./assets/Chevrolet Corvette ZR1/42093_alt3.webp",
			"./assets/Chevrolet Corvette ZR1/42093.webp",
			"./assets/Chevrolet Corvette ZR1/42093_alt2.webp",
		],
		accessories: [{ name: "Performance exhaust", price: 3000, id: "exhaust" }],
	},
];

const validCars = [];
cars.forEach(car => {
	const carDataIsValid = Object.keys(car).every(key => {
		const value = car[key];
		if (value === undefined || value === "" || value === -1 || value === 0) {
			console.warn(
				`Car with id ${car.id} doesn't have valid value for ${key} key`
			);
			return false;
		}
		if (key === "price" && typeof value !== "number") {
			console.warn(`Car with id ${car.id} has invalid value for car price`);
			return false;
		}
		return true;
	});
	const accessoriesDataIsValid = car.accessories.every(accessory => {
		if (typeof accessory.price !== "number" || accessory.price < 0) {
			console.warn(
				`Car with id ${car.id} has invalid value for accessory price`
			);
			return false;
		}
		return true;
	});
	if (carDataIsValid && accessoriesDataIsValid) {
		validCars.push(car);
	}
});

/**
 * Returns an array of processed car data. Each car object in the array includes additional properties:
 * - brandColor: the color of the car brand, or the default color if the brand is not found.
 * - accessories: an array of accessories that are shared among all cars, plus the car's specific accessories.
 *
 * @return {Array} An array of car objects with additional properties.
 */
export const processedCarsData = validCars.map(car => ({
	...car,
	brandColor: brandColors[car.brand] || brandColors.defaultColor,
	accessories: [...sharedAccessories, ...(car.accessories || [])],
}));
export function cleanId(id) {
	return encodeURIComponent(id);
}
