//CONSTANTS
var leveltoanswers = {
	1 : "ELON",
	2 : "SUMMER",
	3 : "NOTE"
}

var currentlevel = 1;
//

//
var options = {
	0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
}

var blanks = {

}
//


function main() {
	addimages(currentlevel);
	$(".hintimage").attr("onclick", "viewfullimage(this)");
	addblanks(currentlevel);
	addoptions(currentlevel);
}

//CHECK IF CORRECT
//START

function getsubmission() {
	var x = "";
	$(".blank").each(function(item, element) {
		x += element.innerHTML;
	});

	return x;
}

function checkifcorrect(level) {
	var submission = getsubmission();
	console.log(submission + " " + leveltoanswers[level]);
	console.log(submission == leveltoanswers[level]);
	if (submission == leveltoanswers[level])
		return true;
	return false;
}

//END


//To add images
//START
function addimages(level) {
	$("#smallimages").empty();
	var dir = "./img/level" + level + "/";
	for (var i = 1; i <= 2; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
	$("#smallimages").append("<br>");
	for (var i = 3; i <= 4; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
}
//END



//To add blanks
//START
function addblanks(level) {
	$("#blanks").empty();
	var answer = leveltoanswers[level];
	for (var i = 0; i < answer.length; ++i) {
		$("#blanks").append("<span class='blank'>_</span>");
		blanks[i] = null;
	}
	$("#blanks").append("<div id='hintbutton'><i class='fas fa-lightbulb' style='font-size: 60px;'></i></div><br><br>")
}
//END



//To add options
//START
function addoptions(level) {
	var s = createstring(level);
	$("#letters").empty();
	for (var i = 0; i < 9; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
	$("#letters").append("<br>");
	for (var i = 9; i < 18; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
}

String.prototype.shuffle=function(){

	var that=this.split("");
	var len = that.length,t,i
	while(len){
		i=Math.random()*len-- |0;
		t=that[len],that[len]=that[i],that[i]=t;
	}
	return that.join("");
}

function createstring(level) {
	var answer = leveltoanswers[level];
	var numberremaining = 18 - answer.length;
	var s = answer;
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < numberremaining; ++i)
		s += possible.charAt(Math.floor(Math.random() * s.length));
	s = s.shuffle();
	return s;
}

//END



//To add letters to the submission
//START

function allfilled() {
	var isempty = false;
	$(".blank").each(function(item, element) {
		if (element.innerHTML == "_")
			isempty = true;
	});

	return !isempty;
}

function findfirstvacant() {	
	var elementtoreturn;
	var index;
	var blanks = document.getElementsByClassName("blank");
	for (var i = 0; i < blanks.length; ++i) {
		if (blanks[i].innerHTML == "_") {
			index = i;
			elementtoreturn = blanks[i];
			break;
		}
	}

	return [elementtoreturn, index];
}

function addletter(lettertoadd, index) {
	if (options[index] == false) {
		return;
	}
	else {
		var ffv = findfirstvacant();
		var element = ffv[0];
		var elindex = ffv[1];
		element.innerHTML = lettertoadd;
		options[index] = false;
		blanks[elindex] = index;
		if (allfilled())
			nextmove();
	}
}
//END






//NEXT MOVES
//START
function nextmove() {
	if (checkifcorrect(currentlevel)) {
		currentlevel += 1;
		main();
	}

	else {
		markincorrect();
	}
}


function markincorrect() {
	$(".blank").css("color", "red");
}
//END


//SELECTION DESELECTION
//START
function clickoption(element) {
	var letter = element.innerHTML;
	addletter(letter);
}

//END