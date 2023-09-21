let divs = [];
let todo = {0: [], 1: [], 2: [], 3: []};
let selectdiv, helpdiv, footerdiv;

let saved = true;

function _export() {
	
}

function _import() {
	
}

function restore() {
	for (let i = 0; i < 4; i++) {
		let todo = localStorage.getItem(i);
		if (todo != null && todo != "") {
			todo.split("\t").forEach((text) => {add(i).value = text});
		}
	}
}

function update() {
	if (!saved) {
		for (let i = 0; i < 4; i++) {
			let children = divs[i].children;
			let string = "";
			for (let j = 0; j < children.length-1; j++) {
				string += children[j].children[0].value.replace("\t", "    ");
				if (j < children.length-2) {
					string += "\t";
				}
			}
			localStorage.setItem(i, string);
		}

		saved = true;
		lastSave = Date.now();
		console.log("Saved to local storage");
	}
}

function showHelp() {
	helpdiv.style.display = "block";
}

function hideHelp() {
	localStorage.setItem("helpok", 1);
	helpdiv.style = "";
}

function add(i) {
	let elt = document.createElement("div");
	elt.className = "todo";
	elt.innerHTML = "<textarea></textarea>";
	elt.addEventListener("dblclick", () => {remove(i, elt)});
	todo[i].push(elt);
	divs[i].insertBefore(elt, divs[i].lastChild);
	elt.children[0].focus();
	return elt.children[0];
}

function remove(i, elt) {
	elt.parentNode.removeChild(elt);
	todo[i].splice(todo[i].indexOf(elt), 1);
	saved = false;
}

function init() {
	let left = document.getElementById("left");
	let right = document.getElementById("right");
	selectdiv = document.getElementById("selected");
	helpdiv = document.getElementById("help");
	footerdiv = document.getElementById("footer");

	let text = ["More urgent, less important - <strong>DELEGATE</strong>",
				"Less urgent, less important - <strong>DELETE/MOVE</strong>",
				"More urgent, more important - <strong>DO NOW</strong>",
				"Less urgent, more important - <strong>SCHEDULE</strong>"];
	for (let i = 0; i < 4; i++) {
		let div = document.createElement("div");
		div.className = "_"+i;
		div.innerHTML = "<span>"+text[i]+"</span><div id=\"_"+i+"\"><a href=\"javascript:add("+i+")\" class=\"addbutton\">+</a></div>";
		if (i < 2) {
			left.appendChild(div);
		} else {
			right.appendChild(div);
		}
		divs.push(div.lastChild);
	}

	console.log(localStorage);
	restore();
	document.body.addEventListener("keyup", () => {saved = false});
	window.setInterval(update, 5000);
}
