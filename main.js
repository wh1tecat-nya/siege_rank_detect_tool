// require modules
const electron = require("electron");
const vision = require("@google-cloud/vision");
const jimp = require("jimp");
const iconv = require("iconv-lite");
const path = require("path");
const fs = require("fs");
const url = require("url");

// set class
const { app, Menu, MenuItem, Tray, BrowserWindow, ipcMain } = electron;
const client = new vision.ImageAnnotatorClient({
	projectId: "r6s-tools",
	keyFilename: `${__dirname}/resources/key/r6s-tools-40be5c890fdc.json`
});

// init constant value
const windowConfig = {
	width: 640,
	height: 480,
	show: false
};

// init let value
let tray;
let mainWindow;
let watcher = null;
let fileName;

app.on("ready", () => {
	createTray();
	createWindow();
});

// set ipc event
ipcMain.on("folderPath", (event, arg) => {
	watcher = null;
	setWatcher(arg);
});

// init function
const createWindow = () => {
	mainWindow = new BrowserWindow(windowConfig);
	mainWindow.loadURL(`file://${__dirname}/view/index.html`);

	mainWindow.on("close", (e) => {
		if (!app.isQuiting) {
			e.preventDefault();
			mainWindow.hide();
		}
	});
};

const createTray = () => {
	tray = new Tray(`${__dirname}/resources/img/icon.png`);
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "config",
			click: () => { mainWindow.show(); }
		},
		{
			label: "quit",
			click: () => {
				app.isQuiting = true;
				app.quit();
			}
		}
	]);
	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		tray.popUpContextMenu(contextMenu);
	});
};

const setWatcher = (folderPath) => {
	watcher = fs.watch(folderPath, {}, async (type, filename) => {
		if (filename !== "Thumbs.db" && fileName !== filename) {
			fileName = filename;
			const filePath = folderPath + filename;
			console.log(`type:${type} filepath:${filePath}`);
			setTimeout(() => {
				cropPicture(filePath)
					.then(getOCR)
					.then(formatString)
					.then((result) => {
						mainWindow.webContents.send("namedata", result);
					})
					.catch((err) => {
						console.log(err);
					});
			}, 500);
		}
	});
};

const cropPicture = (filePath) => {
	return new Promise((resolve, reject) => {
		jimp.read(filePath)
			.then((img) => {
				console.log(img);
				img.crop(300, 697, 450, 270)
					.getBase64(jimp.MIME_JPEG, (err, base64) => {
						resolve(base64);
					});
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

const getOCR = (base64) => {
	return new Promise((resolve, reject) => {
		client.documentTextDetection({
			image: {
				content: base64.replace(/^data:image\/jpeg;base64,/, "")
			}
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

const formatString = (result) => {
	return new Promise((resolve, reject) => {
		const descriptionString = result[0].fullTextAnnotation.text.replace(/ |　/g, "");
		console.log(result[0].fullTextAnnotation);
		let nameArray = descriptionString.split("\n");
		nameArray = nameArray.filter((value) => {
			return value.length > 3;
		});
		if (nameArray.length > 5) {
			reject(new Error("overCount Names"));
		}
		resolve(nameArray);
	});
};
