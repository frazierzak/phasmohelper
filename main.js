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
	div.removeClass("fadeout disabled yes");
	div.addClass("fadein");
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

$("#reset").click(function() {
	$('.ghost').each(function() {
		$(this).removeClass('maybe disabled yes fadein fadeout');
	});
	$(".evidence li").each(function() {
		$(this).removeClass('yes');
	});
	$("#evidence li").removeClass("disabled");
	$('form').trigger("reset");
	$("#aggression_list input").prop("checked", false).trigger("change");
	warning("Please select up to 3 pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
	return
});

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
	var numChecked = $('#evidence input[type="checkbox"]:checked').length;
	var evidence = $("ul.evidence > li." + $(this).attr("class"));

	if(numChecked > 3){
		$(this).prop('checked', false);
		warning("You've already selected 3 pieces of evidence!", "#c61c1ce0", "#fff");
		return
	}

	if(this.checked){
		evidence.each(function() {
    		$(this).addClass("yes");
    	});
	} else {
		evidence.each(function() {
    		$(this).removeClass("yes");
    	});
	}
	switch(numChecked) {
		case 0:
			$(".evidence").each(function() {
				fadein($(this).parents(".ghost"));
				$(this).parents(".ghost").removeClass('maybe');
			});
			warning("Please select up to 3 pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
			break;
		case 1:
			$(".evidence").each(function() {
				if($(this).children(".yes").length < 1){
	        		fadeout($(this).parents(".ghost"));
	        	} else {
	        		fadein($(this).parents(".ghost"));
        			$(this).parents(".ghost").addClass('maybe');
	        	}
	        });
	        warning("Please select up to 2 more pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
	        break;
        case 2:
        	$(".evidence").each(function() {
        		if($(this).children('.yes').length < 2){
        			fadeout($(this).parents(".ghost"));
        		} else {
        			fadein($(this).parents(".ghost"));
        			$(this).parents(".ghost").addClass('maybe');
        		}
        	});
        	if($(".maybe").length == 1){
        		warning("Oh shit, a ghooost! Click the reset button above to start over.", "#55be61", "#000");
        		$(".maybe").addClass('yes');
        		$(".maybe").removeClass('maybe');
        	} else {
        		warning("Please select 1 more piece of evidence to identify the spookster.", "#2f2f2f", "#fff");
        	}
        	break;
         case 3:
         	$(".evidence").each(function() {
         		if($(this).children(":not(.yes)").length == 0){
         			fadein($(this).parents(".ghost"));
         			$(this).parents(".ghost").addClass("yes");
         			$(this).parents(".ghost").removeClass('maybe');
         			fadeout($(this).parents(".ghost").siblings());
         			warning("Oh shit, a ghooost! Click the reset button above to start over.", "#55be61", "#000");
         		}
         	});
         	if($("#ghosts").children(".yes").length == 0){
         		warning("No combination of evidence works!", "#c61c1ce0", "#fff");
         		fadeout($(".ghost"));
         	}
         	break;
	}
	//Remove incompatible evidence
	var evidence_left = [];
	$(".maybe div .evidence").each(function() {
		$(this).children(":not(.yes)").each(function() {
			evidence_left.push($(this).attr("class"));
			// alert($(this).attr("class"));
		});
	});
	if (numChecked >= 1){
		$('#evidence input[type="checkbox"]:not(:checked)').each(function() {
			if (!evidence_left.includes($(this).attr("id"))) {
				$(this).parents('li').addClass('disabled');
				// $(this).siblings('label').removeClass('disabled');
			} else {
				$(this).parents('li').removeClass('disabled');
				// $(this).siblings('label').addClass('disabled');
			}
		});
	}
});