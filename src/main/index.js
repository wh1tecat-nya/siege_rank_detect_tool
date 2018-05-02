import { app, Menu, MenuItem, Tray, BrowserWindow, ipcMain } from "electron";
import * as jimp from "jimp";
import * as fs from "fs";
import * as url from "url";

const vision = require("@google-cloud/vision");

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

let mainWindow

const winURL = process.env.NODE_ENV === "development"
	? "http://localhost:9080"
	: `file://${__dirname}/index.html`

const createWindow = () => {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		width: 640,
		height: 480,
		resizable: false
	})

	mainWindow.loadURL(winURL)

	mainWindow.on("closed", () => {
		mainWindow = null
	})
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow()
	}
})

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
