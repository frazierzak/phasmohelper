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
    setTimeout(function() {
	    div.css(
	    	'display', 'none'
	    	);
	},300);
}

function fadein(div) {
	div.removeClass("fadeout disabled yes");
	div.addClass("fadein");
    setTimeout(function() {
	    div.css('display', 'block');
	}, 300);
}

$("#reset").click(function() {
	$('.ghost').each(function() {
		$(this).removeClass('maybe disabled yes fadein fadeout');
		$(this).css("display", "block");
	});
	$(".evidence li").each(function() {
		$(this).removeClass('yes');
	});
	$('form').trigger("reset");
	warning("Please select up to 3 pieces of evidence to narrow down the spookster.", "#2f2f2f", "#fff");
	return
});

$("#checkboxes input").change(function() {
	var numChecked = $('#checkboxes input[type="checkbox"]:checked').length;
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
        	warning("Please select 1 more piece of evidence to identify the spookster.", "#2f2f2f", "#fff");
        	break;
         case 3:
         	$(".evidence").each(function() {
         		if($(this).children(":not(.yes)").length == 0){
         			fadein($(this).parents(".ghost"));
         			$(this).parents(".ghost").addClass("yes");
         			$(this).parents(".ghost").removeClass('maybe');
         			fadeout($(this).parents(".ghost").siblings());
         			warning("A ghooost! Click reset to start over!", "#55be61", "#000");
         		}
         	});
         	if($("#ghosts").children(".yes").length == 0){
         		warning("No combination of evidence works!", "#c61c1ce0", "#fff");
         		fadeout($(".ghost"));
         	}
         	break;
	}

});