function writeCookie(name,value) {
	d = new Date();
	d.setTime(d.getTime() + (365*24*60*60*1000));
	let expires = d.toGMTString();
	document.cookie = name + "=" + value + ";" + "expires=" + expires + ";path=/";
}
function readCookie(name) {
	let cname = name + "=";
	let dc = decodeURIComponent(document.cookie);
	let ca = dc.split(';');
	for(let i = 0;i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if(c.indexOf(cname) == 0) {
			return c.substring(cname.length, c.length);
		}
	}
	return "";
}

function loadSettings() {
	if(readCookie("info") == "t") {
		$(".description").hide();
		$("#toggle_descriptions").addClass("active");
	}
	if(readCookie("info") == "f") {
		$(".description").show();
	}
	if(readCookie("min") == "t") {
		$("div.minimal").hide();
		$("#toggle_minimal").addClass("active");
		$("span").addClass("minimal");
	}
	if(readCookie("min") == "f") {
		$("div.minimal").show();
	}
	if(readCookie("inst") == "t") {
		$(".instructions").show();
		$("#toggle_instructions").addClass("active");
	}
	if (readCookie("orb") == "f") {
		$("#toggle_floatingorb").addClass("active");
		$("body").removeClass("orb");
	}
}

function warning(message, bgcolor, color) {
	$(".warning").css(
		"background-color", bgcolor
		);
	$(".warning_text").text(message);
	$(".warning_text").css("color", color);
}

function fadeout(div) {
	div.removeClass("fadein maybe yes");
	div.addClass("fadeout disabled");
}

function fadein(div) {
	div.removeClass("fadeout disabled maybe yes");
	div.addClass("fadein");
}

function reset() {
	$('.ghost').each(function() {
		$(this).removeClass('maybe disabled yes excluded fadein fadeout');
	});
	$(".evidence li").each(function() {
		$(this).removeClass('yes no');
	});
	$("#evidence li").removeClass("disabled");
	$('form').trigger("reset");
	//$("#aggression_list input").prop("checked", false).trigger("change");
	$("#possessions_list input").prop("checked", false).trigger("change");
	$('#evidence input').val(1);
	$(".evidenceToggle input").each(function() {
		$(this).removeClass('yes no');
	});
	warning("Please select up to 3 pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
}

function updateGhosts() {
	var foundEvidence = $('#evidence input').filter(function() { return this.value == 0 }).map(function(){return this.id;}).get();
	var nightmare = $('#nightmare_difficulty').prop("checked");
	var minEvidenceLeft = Number.MAX_SAFE_INTEGER;
	var maxEvidenceLeft = 0;

	/**
	*	Check the evidence list of each ghost
	* Hide any ghosts that do not contain all currently discovered evidence
	* Fade any ghosts that can be ruled out based on excluded evidence
	*/
	$(".evidence").each(function() {
		$(this).parents(".ghost").removeClass("excluded");
		if($(this).children(".yes").length !== foundEvidence.length) {
			fadeout($(this).parents(".ghost"));
		} else if($(this).children(".no").length > (nightmare ? 1 : 0) || $(this).find(".no[required='true']").length > 0 ) {
			// In nightmare difficulty one piece of evidence is hidden, so a ghost can only be ruled out if
			// two pieces of evidence are excluded OR if a required piece of evidence is excluded
			$(this).parents(".ghost").addClass("excluded");
			fadein($(this).parents(".ghost"));
		}	else {
			var thisEvidenceLeft = $(this).children("li:not(.yes)");
			if(thisEvidenceLeft.length < minEvidenceLeft) {
				minEvidenceLeft = thisEvidenceLeft.length;
			}
			if(thisEvidenceLeft.length > maxEvidenceLeft) {
				maxEvidenceLeft = thisEvidenceLeft.length;
			}
			fadein($(this).parents(".ghost"));
		}
	});

	var validEvidence = $(".ghost:not(.disabled):not(.excluded) .evidence li:not(.yes)").map(function(){return $(this).data("evidence");}).get()
		.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});

	var validableEvidence = $(".ghost:not(.disabled).excluded .evidence li.no").map(function(){return $(this).data("evidence");}).get()
		.filter(function(value, index, self) {
		return self.indexOf(value) === index && validEvidence.indexOf(value) === -1;
	});


	$('#evidence_list input').filter(function() { return this.value != 0 }).each(function() {
		if(validEvidence.includes($(this).attr("id")))
			$(this).parents('li').removeClass('disabled');
		else if(validableEvidence.includes($(this).attr("id")))
			$(this).parents('li').removeClass('disabled');
		else
			$(this).parents('li').addClass('disabled');
	});

	if(maxEvidenceLeft >= 1)
	{
		if(minEvidenceLeft === maxEvidenceLeft)
		{
			if(maxEvidenceLeft === 1)
				warning("Please select another evidence to identify the spookster.", "#2f2f2f", "#fff");
			else
				warning("Please select up to " + maxEvidenceLeft + " pieces of evidence to narrow down the spookster. Click it again to eliminate it as a possibility.", "#2f2f2f", "#fff");
		}
		else
		{
			// Technically the if/else statements don't need to be as complex...
			warning("Please select up to " + maxEvidenceLeft + " pieces of evidence to narrow down the spookster. Click it again to eliminate it as a possibility.", "#2f2f2f", "#fff");
		}
	}
	else if($(".ghost:not(.excluded):not(.disabled)").length === 1)
	{
		var Ghost = $(".ghost:not(.excluded):not(.disabled)");
		if($(".ghost.excluded").length > 0)
		{
			Ghost.addClass("maybe");
			warning("A ghost! But how can you be so sure?", "#1faef4", "#000");
		}
		else
		{
			Ghost.addClass("yes");
			warning("Oh shit, a ghooost! Click the reset button above to start over.", "#55be61", "#000");
		}
	}
	else if($(".ghost.excluded").length > 0)
		warning("You excluded a vital piece of evidence!", "#c61c1ce0", "#fff");
	else
		warning("No combination of evidence works!", "#c61c1ce0", "#fff");
}

$(".toggle_buttons a").each(function(){
	$(this).click(function(){
		$(this).toggleClass("active");
	});
});

$("#reset").click(reset);

//Evidence has changed, update all affected ghosts
$("#evidence_list input").change(function() {
	{
		var changedEvidence = $(this).attr("id");
		var changedGhosts = $("ul.evidence > li").filter(function(){
			return $(this).data("evidence") === changedEvidence;
		});

		if(this.value == 1) {
			$(this).removeClass("yes no");
			changedGhosts.each(function() {
				$(this).removeClass("yes no");
			});
		} else if(this.value == 0) {
			$(this).removeClass("no");
			$(this).addClass("yes");
			changedGhosts.each(function() {
				$(this).removeClass("no");
				$(this).addClass("yes");
			})
		} else if(this.value == 2) {
			$(this).removeClass("yes");
			$(this).addClass("no");
			changedGhosts.each(function() {
				$(this).removeClass("yes");
				$(this).addClass("no");
			})
		}
	}

	updateGhosts();
});

$(document).ready(reset);
