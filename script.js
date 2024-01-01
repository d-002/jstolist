let divs = [];
let todo = {0: [], 1: [], 2: [], 3: []};
let helpdiv, infodiv, footerdiv, statep;

let mousePos = [0, 0];
let interval;
let dragging = false;

let saved;

function updateMousePos(evt) {
  let bound = document.body.getBoundingClientRect();

  let x = evt.clientX - bound.left - document.body.clientLeft;
  let y = evt.clientY - bound.top - document.body.clientTop;

  mousePos = [x, y];
}

function _export() {
	autosave(); // save to use pre-formatted localStorage data
	string = "";
	for (let i = 0; i < 4; i++) {
		string += localStorage.getItem(i);
		if (i < 3) {
			string += "\n";
		}
	}
	let file = new Blob([string], {type: "text/plain"});

	let a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = "JSToList export.jst";
	a.style.display = "none";
	document.body.appendChild(a); // FF support
	a.click();
	a.remove();
}

function _import() {
	if (localStorage.getItem("importok") == null) {
		infodiv.style.display = "block";
		return;
	}

	let input = document.createElement("input");
	input.style.display = "none";
	document.body.appendChild(input);
	input.type = "file";
	input.click();
	input.addEventListener("change", (event) => { __import(input, event) });
}

function __import(elt, event) {
	elt.remove();
	let file = event.target.files[0];

	// remove everything
	for (let i = 0; i < 4; i++) {
		let children = divs[i].children;
		for (let j = children.length-2; j >= 0; j--) {
			children[j].remove();
		}
	}

	// add new elements
	let reader = new FileReader();
	reader.addEventListener("load", (event) => {
		let i = 0;
		event.target.result.split("\n").forEach((area) => {
			if (area != "") {
				area.split("\t").forEach((text) => { add(i).value = text })
			}
			i++;
		})
	});
	reader.readAsText(file);
	unsavep();
}

function restore() {
	for (let i = 0; i < 4; i++) {
		let todo = localStorage.getItem(i);
		if (todo != null && todo != "") {
			todo.split("\t").forEach((text) => {add(i).value = text });
		}
	}
	if (localStorage.getItem("helpok") == null) {
		showHelp();
	}
	savep();
}

function savep() {
	saved = true;
	statep.innerHTML = "All saved";
	statep.className = "ok";
}

function unsavep() {
	saved = false;
	statep.innerHTML = "*Save scheduled*";
	statep.className = "";
}

function autosave() {
	if (!saved) {
		for (let i = 0; i < 4; i++) {
			let children = divs[i].children;
			let string = "";
			for (let j = 0; j < children.length-1; j++) {
				string += children[j].children[0].value.replace("\t", "    ").replace("\n", " ");
				if (j < children.length-2) {
					string += "\t";
				}
			}
			localStorage.setItem(i, string);
		}

		lastSave = Date.now();
		savep();
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

function hideInfo() {
	infodiv.style = "";
	localStorage.setItem("importok", 1);
	_import();
}

function add(i) {
	let elt = document.createElement("div");
	elt.className = "todo";
	elt.innerHTML = "<textarea></textarea>";
	elt.draggable = "true";
	todo[i].push(elt);
	divs[i].insertBefore(elt, divs[i].lastChild);

	elt.children[0].focus();
	unsavep();
	return elt.children[0];
}

function remove(i, elt) {
	elt.remove();
	todo[i].splice(todo[i].indexOf(elt), 1);
	unsavep();
}

function handleRemove(event) {
	if (event.target.tagName == "TEXTAREA") {
		let id = event.target.parentNode.parentNode.id;
		remove(parseInt(id[1]), event.target.parentNode);
	}
}

function dragStart(e) {
	for(let i = 0; i < 4; i++) if (Array.from(divs[i].children).includes(e.target)) {
		e.target.id = i;
		break;
	}
	e.dataTransfer.setData("text/plain", e.target.id);
	e.dataTransfer.setData("text/html", e.target.children[0].value);
}

function dragOver(e) {
	if (e.target) e.preventDefault();
}

function drop(e) {
	let id = e.dataTransfer.getData("text/plain");
	elt = document.getElementById(id);
	for(let i = 0; i < 4; i++) {
		if (e.target == divs[i] || e.target == divs[i].parentNode) {
			remove(parseInt(id), elt);
			e.target.id = "";
			elt.remove();
			add(i).value = e.dataTransfer.getData("text/html");
			return;
		}
	}
}

function init() {
	let left = document.getElementById("left");
	let right = document.getElementById("right");
	helpdiv = document.getElementById("help");
	infodiv = document.getElementById("import-info");
	footerdiv = document.getElementById("footer");
	statep = document.getElementById("state");

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

	restore();
	document.body.addEventListener("keyup", (event) => {if (event.key.length == 1) unsavep()});
	document.body.addEventListener("dblclick", handleRemove);
	document.body.addEventListener("dragstart", dragStart);
	document.body.addEventListener("dragover", dragOver);
	document.body.addEventListener("drop", drop);
	window.addEventListener("mousemove", updateMousePos);
	window.setInterval(autosave, 5000);
}
