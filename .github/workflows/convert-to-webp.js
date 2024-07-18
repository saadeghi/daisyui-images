const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

// Function to recursively find all PNG and JPG images
function findImages(directory) {
	let images = [];

	for (file of fs.readdirSync(directory)) {
		const filePath = path.join(directory, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			images = images.concat(findImages(filePath));
		} else {
			if (file.match(/\.(png|jpe?g)$/i)) {
				images.push(filePath);
			}
		}
	}

	return images;
}

// Function to convert images to WebP
async function convertToWebP(imagePath) {
	const webpPath = imagePath.replace(/\.(png|jpe?g)$/i, ".webp");

	if (!fs.existsSync(webpPath)) {
		await sharp(imagePath).toFile(webpPath);
		console.log(`${imagePath} ——→ ${webpPath}`);
	} else {
		// console.log(`WebP version already exists for ${imagePath}`);
	}
}

// Main function to process images
function processImages(directory) {
	const images = findImages(directory);
	(async () => {
		for (const image of images) {
			await convertToWebP(image);
		}
	})();
}

// Replace '.' with the path to your directory containing images
const directory = "../../";

// Start processing images
processImages(directory);
