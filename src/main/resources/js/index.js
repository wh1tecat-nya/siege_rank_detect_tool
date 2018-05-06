const { remote, ipcRenderer } = require("electron");

const { dialog, BrowserWindow } = remote;

let button;
let folderPath;

document.addEventListener("DOMContentLoaded", () => {
	setDOM();
	setEvent();
	if (localStorage.getItem("folderPath") !== null) {
		folderPath.textContent = localStorage.getItem("folderPath");
		ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
	}
});

const setDOM = () => {
	button = document.getElementById("selectFolder");
	folderPath = document.getElementById("folderPath");
};

const setEvent = () => {
	button.addEventListener("click", () => {
		const focusedWindow = BrowserWindow.getFocusedWindow();
		dialog.showOpenDialog(focusedWindow, {
			properties: ["openDirectory"]
		}, (directory) => {
			localStorage.setItem("folderPath", directory[0] + "\\");
			folderPath.textContent = localStorage.getItem("folderPath");
			ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
		});
	});

	ipcRenderer.on("namedata", (event, arg) => {
		arg.forEach((value) => {
			fetch(`https://r6db.com/api/v2/players?name=${value}&platform=PC`, { headers: { "X-App-Id": "8719e50f-817c-483d-af53-0d185fd8d3cf" } })
				.then((response) => {
					return response.json();
				})
				.then((json) => {
					console.log(json[0]);
				});
		});
	});
};
