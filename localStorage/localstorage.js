function save() {
	var fieldvalue = document.getElementById("textfield").value;
	localStorage.setItem("text", fieldvalue);
}

function load() {
	var storedValue = localStorage.getItem("text");
	if (storedValue) {
		document.getElementById("textfield").value = storedValue;
	};
}

function removeItem() {
	document.getElementById("textfield").value = "";
	localStorage.removeItem("text");
}