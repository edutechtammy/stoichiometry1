
var btnClicked = "-1";
					 
function resizeInteraction(thewidth,theheight) {
	
	thewidth = String(thewidth).replace("px","");
	var scale = thewidth / (680+70);
	var margins = Math.round(25 * scale);
	margins+="px"
	scale = "scale(" + scale + ")";
	$('#reveal').css('-webkit-transform', scale);
	$('#reveal').css('-moz-transform', scale);
	$('#reveal').css('-o-transform', scale);
	$('#reveal').css('-ms-transform', scale);
	
	$('#reveal').css('-moz-transform-origin', '0 0');
	$('#reveal').css('-webkit-transform-origin', '0 0');
	$('#reveal').css('-moz-transform-origin', '0 0');
	$('#reveal').css('-o-transform-origin', '0 0');
	$('#reveal').css('-ms-transform-origin', '0 0');
	

	$('#reveal').css('margin-top', margins);
	$('#reveal').css('margin-left', margins);
	
}

//$(document).ready(function() {
function addClickHandlers() {
	$("#reveal").fadeIn();
	$('td a').each(function(index, element) {
       $(this).click(function(){
		  scrollContext($(this).attr('id'));
		  changeDescription(-1);
	});
	

	
});


}

function setupInput() {
	

    //Search input
    var self = this;
    self.input = $("#searchInput").select().focus();

    // Glossary search
    self.performSearch = function () {

        var phrase = self.input.val().replace(/^\s+|\s+$/g, "");
        phrase = phrase.replace(/\s+/g, "|");

        if (phrase.length < 1) { return; }

        phrase = ["\\b(", phrase, ")"].join("");
        var count = 0;
      $(".keyContext").each(function (i, v) {
		
            var block = $(v);
			//if (i != 0) {
            block.html(
					   		
							
							block.text().replace(
								new RegExp(phrase, "gi"),
								function (match) {
								    count++;
									
									scrollContext($(v).attr('id'));
									if(textArray[idholder[$(v).attr('data-id')]] != $("#Search_Result_Header").text())
									{
										changeDescription($(v).attr('data-id'));
										$(".keyContext").each(function() {
										this.style.backgroundColor = '#FFFFFF';
										this.style.color = '#666666';
										
									});
										$(v).val(function() {
											this.style.backgroundColor = '#2277CC';
											this.style.color = '#FFFFFF';
										});
									}
									
									//alert($(v).attr('id'));
								    return this.text(); //; ["<span class='highlight'>", match, "</span>"].join("");
								}));
			
			//}
        });

        $(".result-count").text(count + " results on this page!");
        self.search = null;

    };

    self.search;
    self.input.keyup(function (e) {
        if (self.search) { clearTimeout(self.search); }

        //start a timer to perform the search. On browsers like
        //Chrome, Javascript works fine -- other less performant
        //browsers like IE6 have a hard time doing this
        self.search = setTimeout(self.performSearch, 300);
    });
	
}

/*
if ($(this).attr('data-id') != undefined) {
				changeDescription($(this).attr('data-id'));				
			}
			
			
			*/
			
			
/*var theSnd = null;

function pauseSound() {
	if(theSnd != null) // && theSnd.src != wavePath)
	{ theSnd.pause();}
}

function play_sound(url){
	theSnd = new Audio(url);
	theSnd.load();
	theSnd.play();	
}*/

//Modifying the sound function - Audio load and play is now handled by captivate: IF it does not handle the audio revert to old code.
//This fix was mainly  implemented for IPAD.
var isiPad = navigator.userAgent.match(/iPad/i) != null;
var theSnd = null;
var theSndURL = null;

function pauseSound() {
	if(isiPad){
		if(!this.handle)
		return;
		
		if(!this.handle.stopWidgetAudio(theSndURL)){
			if(theSnd != null){ 
				theSnd.pause();
			}
		}else{
			this.handle.stopWidgetAudio(theSndURL)
		}
	} else {
		if(theSnd != null) // && theSnd.src != wavePath)
		{ theSnd.pause();}
	}
}

function play_sound(url){
	if(isiPad){
		if(!this.handle)
		return;
		
		theSndURL = url;
		if(!this.handle.playWidgetAudio(url)){	
			theSnd = new Audio(url);
			theSnd.load();
			theSnd.play();
		}else{
			this.handle.playWidgetAudio(url)
		}
	}else{
		theSnd = new Audio(url);
		theSnd.load();
		theSnd.play();	
	}
}

////////////////////////////////////////////////////////

function changeTheme(newCSS, newHeader) {
	document.getElementById("cssFile").href = newCSS;
	document.getElementById("cssHeader").href = newHeader;
}
///////////////////////////////////////////////////////////////////
function formatColor(clr) {
	clr = clr.substring(2);
	if (clr.length == 4) { 
		clr = "#00" + clr; 
	} else if (clr.length == 5) {
		
		clr = "#0" + clr; 
	} else {
		clr = "#" + clr;
	}
	return clr; 
}


function setupCustomStyles() {
	generalStyles.headerColor = formatColor(generalStyles.headerColor); //generalStyles.headerColor.substring(2);
	generalStyles.letterBarColor = formatColor(generalStyles.letterBarColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.contentHeaderColor = formatColor(generalStyles.contentHeaderColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.contentBodyColor = formatColor(generalStyles.contentBodyColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.bodyColor = formatColor(generalStyles.bodyColor); //"#" + generalStyles.bodyColor.substring(2);
	//generalStyles.arrowColor = formatColor(generalStyles.arrowColor);
	//generalStyles.btnColorUp = formatColor(generalStyles.btnColorUp);
	//generalStyles.btnColorOver = formatColor(generalStyles.btnColorOver);
//	generalStyles.btnColorDown = formatColor(generalStyles.btnColorDown);
	//generalStyles.lineColor = formatColor(generalStyles.lineColor);	

	//alert(generalStyles.lineColor);
		if (currentTheme != 3 && currentTheme != 11 && currentTheme != 16) {
			$('#headerColor').css('background-color', generalStyles.headerColor)//generalStyles.headerColor);
		} else {
			$('#headerColor').css('background-color', generalStyles.bodyColor)//generalStyles.headerColor);
			
		}//$('#headerColor').css('background-image', 'none');
	$('#Navigation_Container').css('background-color', generalStyles.letterBarColor);
	$('#Search_Result_Header').css('background-color', generalStyles.contentHeaderColor);
	$('#Search_Input_Container').css('background-color', generalStyles.contentHeaderColor);
	
	
	$('#Search_Result_Container').css('background-color', generalStyles.contentBodyColor);
	$('#content_bg').css('background-color', generalStyles.bodyColor);
	$('.letterHead').css('color', formatColor(buttonStyles.color));
	$('.sidebarWord').css('color', formatColor(buttonStyles.color));
	$('.navNode .NoValue').css('color', formatColor(letterStyles.textColorOver));
	$('.navNode .HasValue').css('color', formatColor(letterStyles.color));
	
	$('.navNode').css('font-family', letterStyles.face);
	
	$('.navNode .NoValue').css('font-weight', 'normal');
	$('.navNode .HasValue').css('font-weight', 'normal');
	
	$('.navNode').css('font-size', letterStyles.size+"px");
	$('.sidebarWord').css('cursor', 'pointer');
	$('.sidebarWord').css('font-weight', 'normal');
	$('#Glossary_Context').css('width', '100%');
	

	if (generalStyles.headerActive == 2) {
		$('#headerColor').css('display', 'none');
	}	

}

//function setupStyle(cssObj,color,face,style,size,align) {
function setupStyle(cssObj, styleObj) {
	//assign the new class
	$(cssObj).css('font-size', styleObj.size+"px");
	$(cssObj).css('color', formatColor(styleObj.color));
	$(cssObj).css('font-family', styleObj.face);
		
	
	if (styleObj.italic == 'true') {	
		$(cssObj).css('font-style', 'italic');
	} else {
		$(cssObj).css('font-style', 'none');
		
	}
	
	if (styleObj.bold == 'true') {	
		$(cssObj).css('font-weight', 'bold');
	} else {
		
		$(cssObj).css('font-weight', 'none');
	}
		
		
	$(cssObj).css('text-align', styleObj.align);


}
	

	