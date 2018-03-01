//CONSTANTS
var leveltoanswers = {
	1 : "ELON",
	2 : "SUMMER",
	3 : "NOTE",
	4 : "BAND"
}

var currentlevel = 1;
var tempanswer = leveltoanswers[currentlevel];
var noofhints = 2;
//

//
var options = {
	0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
}

var blanks = {}

var letters = {}

var freq = {}

var tempfreq = {}
//


function main() {
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var answer = leveltoanswers[currentlevel];
	for (var i = 0; i < 26; ++i) {
		freq[alphabets[i]] = 0;
		tempfreq[alphabets[i]] = 0;
	}
	for (var i = 0; i < answer.length; ++i)
		freq[answer[i]] += 1;

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
		$("#blanks").append("<span class='blank' onclick='deselect(\"" + i + "\")'>_</span>");
		blanks[i] = null;
	}
	$("#blanks").append("<div id='hintbutton' onclick='hint(" + level + ")'><i class='fas fa-lightbulb' style='font-size: 60px;'></i><br><span id='noofhints'></span></div><br><br>")
	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining";
}
//END



//To add options
//START
function addoptions(level) {
	var s = createstring(level);
	for (var i = 0; i < 18; ++i) {
		letters[i] = s[i];
	}
	$("#letters").empty();
	for (var i = 0; i < 9; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
	$("#letters").append("<br>");
	for (var i = 9; i < 18; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
}

String.prototype.shuffle = function() {

	var that = this.split("");
	var len = that.length, t, i;
	while(len) {
		i = Math.random() * len-- | 0;
		t = that[len], that[len] = that[i], that[i] = t;
	}
	return that.join("");
}

function createstring(level) {
	var answer = leveltoanswers[level];
	var numberremaining = 18 - answer.length;
	var s = answer;
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var possible = "";
	for (var i = 0; i < alphabets.length; ++i) {
		if (answer.indexOf(alphabets[i]) == -1)
			possible += alphabets[i];
	}
	for (var i = 0; i < numberremaining; ++i)
		s += possible.charAt(Math.floor(Math.random() * s.length));
	s = s.shuffle();
	return s;
}

//END


function updatetempanswer() {
	var answer = leveltoanswers[currentlevel];
	var s = "";
	$(".blank").each(function(item, element){
		if (element.innerHTML == "_") {
			s += answer[item];
		}
	});
	tempanswer = s;
}

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
		$(".letter")[index].onclick = null;
		$(".letter")[index].style.cursor = "not-allowed";
		$(".letter")[index].style.background = "green";
		blanks[elindex] = index;
		updatetempanswer();
		tempfreq[lettertoadd] += 1;
		if (allfilled())
			nextmove();
	}
}

//END


//DESELECT a character
//START

function deselect(elindex) {
	if ($(".blank")[elindex].innerHTML == "_") {
		return;
	}
	var lettertoremove = $(".blank")[elindex].innerHTML;
	tempfreq[lettertoremove] -= 1;
	$(".blank")[elindex].innerHTML = "_";
	var index = blanks[elindex];
	options[index] = true;
	$(".letter")[index].onclick = function() {
		addletter(letters[index], index);
	};
	$(".letter")[index].style.cursor = "pointer";
	$(".letter")[index].style.background = "#222";
	$(".blank").css("color", "black");
	updatetempanswer();
}

//END






//NEXT MOVES
//START
function nextmove() {
	if (checkifcorrect(currentlevel)) {
		if (currentlevel == 4) {
			window.location = "congrats.html";
		}
		currentlevel += 1;
		tempanswer = leveltoanswers[currentlevel];
		options = {
			0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
		}

		blanks = {
		}

		letters = {
		}

		noofhints = 2;

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


//HINT
//START

function findlast(letter) {
	var index;
	$(".letter").each(function(item, element) {
		if (element.innerHTML == letter) {
			index = item;
		}
	});
	return index;
}

function getRandomLetter() {
	var position = Math.floor(Math.random() * tempanswer.length);
	var letter = tempanswer.charAt(position);
	tempanswer = tempanswer.substr(0, position) + tempanswer.substr(position + 1, tempanswer.length);
	var pos;
	var answer = leveltoanswers[currentlevel];
	for (var i = 0; i < answer.length; ++i) {
		if (answer[i] == letter && $(".blank")[i].innerHTML == "_") {
			pos = i;
			break;
		}
	}
	return [letter, pos];
}

function addhint(lettertoadd, index, position) {
	var answer = leveltoanswers[currentlevel];
	if (tempfreq[lettertoadd] == freq[lettertoadd]) {
		var firstfoundat;
		for (var i = 0; i < answer.length; ++i) {
			if ($(".blank")[i].innerHTML == lettertoadd) {
				firstfoundat = i;
				break;
			}
		}

		deselect(firstfoundat);
	}

	var element = $(".blank")[position];
	var elindex = position;
	element.innerHTML = lettertoadd;
	options[index] = false;
	$(".letter")[index].onclick = null;
	$(".letter")[index].style.cursor = "not-allowed";
	$(".letter")[index].style.background = "green";
	blanks[elindex] = index;
	$(".blank")[elindex].onclick = null;
	if (allfilled())
		nextmove();
	else {
		return elindex;
	}
}

function hint() {
	if (noofhints <= 0) {
		return;
	}
	var grl = getRandomLetter();
	//console.log(grl);
	var letter = grl[0];
	var position = grl[1];
	var index = findlast(letter);
	//console.log(index);
	var elindex = addhint(letter, index, position);
	noofhints -= 1;

	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining";
}

//END
