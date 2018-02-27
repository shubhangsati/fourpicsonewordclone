function viewfullimage(element) {
	var src = element.src;
	$("#fullimage").attr("src", src);
	$(".hintimage").css("display", "none");
	$("#fullimagediv").css("display", "block");
}

function goback() {
	$("#fullimagediv").css("display", "none");
	$(".hintimage").css("display", "inline");
}