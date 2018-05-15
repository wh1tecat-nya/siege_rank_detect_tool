// import modules
import { app, Menu, MenuItem, Tray, BrowserWindow, ipcMain } from "electron";
import * as jimp from "jimp";
import fetch from "node-fetch";
import * as fs from "fs";
import * as url from "url";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

// init constant value
const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;
const visionKey = "AIzaSyBsFcQNV6modwuDOZfdDZbQ-Qvqhn8gwpU";

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
	console.log("reflesh watcher");
	console.log(arg);
	watcher = null;
	setWatcher(arg);
});

// init function
const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 850,
		resizable: false,
		useContentSize: true
	});
	mainWindow.loadURL(winURL);

	mainWindow.on("close", (e) => {
		if (!app.isQuiting) {
			e.preventDefault();
			mainWindow.hide();
		}
	});
};

const createTray = () => {
	tray = new Tray(`${__dirname}/resources/img/icon_small.png`);
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
		if ( (filename !== "Thumbs.db" && filename !== ".DS_Store") && fileName !== filename) {
			const filePath = folderPath + "/" + filename;
			if (fs.existsSync((filePath))) {
				fileName = filename;
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
		}
	});
};

const cropPicture = (filePath) => {
	return new Promise((resolve, reject) => {
		jimp.read(filePath)
			.then((img) => {
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
		const sendJsonData = {
			requests: [{
				image: {
					content: base64.replace(/^data:image\/jpeg;base64,/, "")
				},
				features: [{
					type: "DOCUMENT_TEXT_DETECTION"
				}]
			}]
		};

		fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(sendJsonData)
		})
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				resolve(json);
			});
	});
};

const formatString = (result) => {
	return new Promise((resolve, reject) => {
		const descriptionString = result.responses[0].fullTextAnnotation.text.replace(/ |　/g, "");
		let nameArray = descriptionString.split("\n");
		nameArray = nameArray.filter((value) => {
			return value.length > 3;
		});
		if (nameArray.length > 5) {
			reject(new Error("overCount Names"));
		}
		console.log(nameArray);
		resolve(nameArray);
	});
};

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from "electron-updater"

autoUpdater.on("update-downloaded", () => {
	autoUpdater.quitAndInstall()
})

app.on("ready", () => {
	if (process.env.NODE_ENV === "production") autoUpdater.checkForUpdates()
})
 */
