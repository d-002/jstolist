// TODO: store in cookies, don't show cookie popup again, same for help (show on first use)

let divs = [];
let todo = {0: [], 1: [], 2: [], 3: []};
let selectdiv, helpdiv, footerdiv;

let date = new Date(Date.now() + 5184000000); // expires in 60 days
let cookieEnd = "; expires=" + date.toGMTString()
let preferences = {};

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    document.cookie = cookies[i].split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function _export() {
	
}

function _import() {
	
}

function showHelp() {
	helpdiv.style.display = "block";
}

function hideHelp() {
	helpdiv.style = "";
}

function readCookies() {
	let cookie = document.cookie.split("; ");
	for (let i = 0; i < cookie.length; i++) {
		let key = cookie[i].split("=")[0];
		let value = cookie[i].split("=")[1];
		preferences[key] = value;
	}

	if (preferences["cookieok"] == "1") {
		hideFooter();
	}
}

function hideFooter() {
	document.cookie = "cookiesok=1"+cookieEnd;
	console.log("cookiesok=1"+cookieEnd);
	footerdiv.style.display = "none";
}

function add(i) {
	let elt = document.createElement("div");
	elt.className = "todo";
	elt.innerHTML = "<textarea></textarea>";
	elt.addEventListener("dblclick", () => {remove(i, elt)});
	todo[i].push(elt);
	divs[i].insertBefore(elt, divs[i].lastChild);
	elt.children[0].focus();
}

function remove(i, elt) {
	elt.parentNode.removeChild(elt);
	todo[i].splice(todo[i].indexOf(elt), 1);
}

function init() {
	let left = document.getElementById("left");
	let right = document.getElementById("right");
	selectdiv = document.getElementById("selected");
	helpdiv = document.getElementById("help");
	footerdiv = document.getElementById("footer");

	readCookies();

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
}
