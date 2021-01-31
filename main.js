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
	$("#aggression_list input").prop("checked", false).trigger("change");
	$(".indeterminate").prop("checked", true).prop("indeterminate", true).prop("readonly", true);
	warning("Please select up to 3 pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
}

$("#toggle_instructions").click(function(){
	$(".instructions").toggle();
});

$("#toggle_descriptions").click(function(){
	$(".description").toggle();
});

$("#toggle_minimal").click(function(){
	$(".minimal").toggle();
	$(".description").toggle();
});

$(".toggle_buttons a").each(function(){
	$(this).click(function(){
		$(this).toggleClass("active");
	});
});

$("#reset").click(reset);

$("#aggression_list input").change(function() {
	const aggressionOptions = $("#aggression_list input");
	const wasAnUncheck = !$(this).prop("checked");
	const aggressionType = !wasAnUncheck ? $(this).prop("id") : null;

	/**
	 * Loop through each option and add/remove the "disabled" class
	 * depending on whether it's checked.
	 **/
	aggressionOptions.each(async function (i, item) {
		const curOption = $(item);
		if (!curOption.prop("checked") && !wasAnUncheck) {
			curOption.parent().addClass("disabled").removeClass("active");
		}
		else {
			curOption.parent().removeClass("disabled").addClass("active");
		}
	});

	// Reveal the appropiate companion text for aggression meaning.
	var textToRevealID = null

	if (wasAnUncheck) {
		$("#aggression_hints").addClass("hidden");
	} else {
		$("#aggression_hints").removeClass("hidden");
	}

	switch (aggressionType) {
		case 'aggressive': textToRevealID = "violent";
			break;
		case 'friendly1':
		case 'friendly2': textToRevealID = "placid";
			break;
		case 'nonefriendly1':
		case 'nonefriendly2': textToRevealID = "unfriendly";
			break;
	}

	$("#aggression_hints").children().addClass("hidden");
	$("#aggression_hints").children(`#${textToRevealID}`).removeClass("hidden");
});

$("#evidence input").change(function() {
	if(this.readOnly) {
		this.readOnly = false;
		this.checked = true;
		this.indeterminate = false;
	}
	else if(this.checked) {
		this.readOnly = true;
		this.indeterminate = true;
	}
	
	var foundEvidence = $('#evidence input[type="checkbox"]:not(:indeterminate):checked').map(function(){return this.id;}).get();

	{
		var changedEvidence = $(this).attr("id");
		var changedGhosts = $("ul.evidence > li").filter(function(){
			return $(this).data("evidence") === changedEvidence;
		});
		if(this.indeterminate) {
			changedGhosts.each(function() {
				$(this).removeClass("yes no");
			});
		} else if(this.checked) {
			changedGhosts.each(function() {
				$(this).removeClass("no");
				$(this).addClass("yes");
			})
		} else {
			changedGhosts.each(function() {
				$(this).removeClass("yes");
				$(this).addClass("no");
			})
		}
	}

	var minEvidenceLeft = Number.MAX_SAFE_INTEGER;
	var maxEvidenceLeft = 0;

	$(".evidence").each(function() {
		$(this).parents(".ghost").removeClass("excluded");
		if($(this).children(".yes").length !== foundEvidence.length)
			fadeout($(this).parents(".ghost"));
		else if($(this).children(".no").length > 0) {
			$(this).parents(".ghost").addClass("excluded");
			fadein($(this).parents(".ghost"));
		}
		else {
			var thisEvidenceLeft = $(this).children("li:not(.yes)");
			if(thisEvidenceLeft.length < minEvidenceLeft)
				minEvidenceLeft = thisEvidenceLeft.length;
			else if(thisEvidenceLeft.length > maxEvidenceLeft)
				maxEvidenceLeft = thisEvidenceLeft.length;
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

	$('#evidence input[type="checkbox"]:indeterminate, #evidence input[type="checkbox"]:not(:checked)').each(function() {
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
				warning("Please select up to " + maxEvidenceLeft + " pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
		}
		else
		{
			// Technically the if/else statements don't need to be as complex...
			warning("Please select up to " + maxEvidenceLeft + " pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
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
});

$(document).ready(reset);
