var handle

function sortAnswers(sortArray) {

	sortArray = jQuery.unique(sortArray);

}

function getKeys() {

} 
var idholder = new Array();

function populateGlossary(sortArray, contentArray) {

	//sortArray = jQuery.unique(sortArray);
	var currentChar;
	var num;
	var letterFound;
    var numTwo;
	numTwo = 0;//alert("found");
	currID = 0;
	// Iterate through ASCII of A to Z (Uppercase)
	
	 tabindex = tindex;
	 
    for (var i = 65; i <= 90; i++) {
		
		currentChar = String.fromCharCode(i);
		letterFound = false;
		for (num = 0; num < sortArray.length;num++) {
			//alert(sortArray[num].substring(0,1));	
			
			if (currentChar == sortArray[num].substring(0,1).toUpperCase()) {
				if (!letterFound) {
					lettersArray[numTwo] = new Array();
					lettersArray[numTwo][0] = currentChar
					lettersArray[numTwo][1] = 'Y'
					letterFound = true;
					numTwo++
				}
				
				lettersArray[numTwo] = new Array();
				idholder[numTwo] = currID;
				currID++
				lettersArray[numTwo][0] = sortArray[num]
				lettersArray[numTwo][1] = sortArray[num]
				numTwo++;
			}
				
		}
		if (!letterFound) {

		}
		
        var navID = currentChar + "_Nav";
		
        $("#Navigation_Row").append("<td style='width: 4%;'><a id='" + navID + "' href='#' class='NoValue'  tabindex="+tindex+">" + currentChar + "</a></td>");	
		
		tindex++;
		
    }
	
	 tabindex= tindex;
	 

   populateSideBar();
}
/*populate sidebar with items from the array*/
function populateSideBar(){
	var letterStartNum = 0;
	for (var i = 0; i < lettersArray.length; i++) {
		
		var currChar=lettersArray[i][0];
		var secondChar=lettersArray[i][1];
		var contextID = currChar.toUpperCase().replace(/\s+/g, '')  + "_Context";
		/*add items to #Glossary_Context table*/
		
		/*check if secondChar is Y, then highlight it by changing class to .HasValue*/
		if (secondChar=='Y' || secondChar =='') { //then it's the letter
			$("#Glossary_Context").append("<tr><td  class='letterHead' id='" + contextID + "' data-id='"+i+"'  tabindex="+tindex+">" + currChar + "</td></tr>");
		} else {
			$("#Glossary_Context").append("<tr><td class='sidebarWord' id='" + contextID + "' data-id='"+i+"'   tabindex="+tindex+">" + currChar + "</td></tr>");
		}
		if (secondChar=='Y'){ //enter in here if it's a category heading
			$("#" + currChar + "_Nav").removeClass('NoValue').addClass('HasValue');
			
		} else { //enter if word so we can setup audio
			upSoundArray[(i)] = soundArray[letterStartNum];
			letterStartNum++;
		}
		
		/*if there is no secondChar and that secondChar is not Y, then add .keyContext class*/
		if ((secondChar!='')&&(secondChar!='Y')){
			$("#" + currChar.toUpperCase().replace(/\s+/g, '') + "_Context").addClass('keyContext');
		}
		tindex++;
		
	}
	
	/*loop through items with class .keyContext and trigger changeDescription click behavior*/
	$(".keyContext").click(function () {
			 if ($(this).attr('data-id') != undefined) {
				changeDescription($(this).attr('data-id'));
				$(".keyContext").val(function() {
					this.style.backgroundColor = '#FFFFFF';
					this.style.color = '#666666';
				});
				this.style.backgroundColor = '#b2b2b2';
				this.style.color = '#FFFFFF';
			}
    });	
	
	
	$(document).keydown(function(e){	
	//console.log("key press",btnClicked,e.target.firstChild,e.keyCode)
		if(e.keyCode  == 13 || e.keyCode  == 32) {
		
		if ($(e.target).attr('data-id') != undefined) {
				changeDescription($(e.target).attr('data-id'));
				$(".keyContext").val(function() {
					e.target.style.backgroundColor = '#FFFFFF';
					e.target.style.color = '#666666';
				});
				e.target.style.backgroundColor = '#b2b2b2';
				e.target.style.color = '#FFFFFF';
			}
			
		}
		});
}

/*scroll the sidebar*/
function scrollContext(elementId) {
	
    var contextElementId = elementId.replace("_Nav", "_Context");
	
	var dataID=$("#" + contextElementId).attr('data-id');
	var elementPosition = dataID*20;//(28 is estimated height of each td item with padding)
   
    $("#Glossary_Context_Container").animate({ scrollTop: elementPosition }, 'slow');
}



function changeDescription(elementId) {
	if(elementId == -1)
	{
		var elem = document.getElementById('Search_Result_Header');
		elem.innerHTML = '&nbsp; '
		pauseSound();
		$(".keyContext").each(function() {
			this.style.backgroundColor = '#FFFFFF';
			this.style.color = '#666666';
		});
		
		$(".tab_content").hide(); //hide all
		
			$(selected_tab).fadeIn(function() {
				pauseSound();
		  });
	}
	else
	{
	//   alert(idholder[elementId]);
		var index = idholder[elementId] //1//lettersArray.indexOf(elementId);
		
	   $("#Search_Result_Header").text(textArray[index]);
		
		$(".tab_content").hide(); //hide all
		//btnClicked = e.target.id;
		var selected_tab = $(".tab_content").eq(index); //$(this).find("tab"+btnClicked);//.attr("href");
		
			$(selected_tab).fadeIn(function() {
				pauseSound();
				if (upSoundArray[elementId] != "-1") {
					play_sound(upSoundArray[elementId]);
					//setTimeout("play_sound(upSoundArray[elementId])",50);
				}
		  });
		//return false;
	}
			
		
}



//holder arrays
var nodeLeftProperty;
var textArray = [];
var buttonArray = [];
var imageIDArray = [];
var soundIDArray = [];
var imageArray = [];
var soundArray = [];
var upSoundArray = [];

var buttonXArray= [];
var picAlignArray=[];
keys = new Array();
description = new Array();

var width
var height
	
	
var lettersArray = [];
var color;
var face;
var style;
var size;
var align;
var contentStyles = new Object();
var contentHeadStyles = new Object();
var buttonStyles = new Object();
var letterStyles = new Object();
var headerStyles = new Object();
var instStyles = new Object();
var generalStyles = new Object();
var tabindex = 1000;

glossaryUse1 = {
	onLoad: function()
	{
		if ( ! this.captivate )
			return;
				handle = this.captivate.CPMovieHandle;
		if(handle.isWidgetVisible() == true)
		{

		this.movieProps = this.captivate.CPMovieHandle.getMovieProps();
		if ( ! this.movieProps )
			return;
		this.varHandle = this.movieProps.variablesHandle;
		this.eventDisp = this.movieProps.eventDispatcher;
		this.xmlStr = this.captivate.CPMovieHandle.widgetParams();
		var size = this.OpenAjax.getSize();
		width = size.width;
		height = size.height;
		this.internalImage = '';
		this.externalImage = '';
		this.instructions = '';
		this.buttonLabel = '';
		this.buttonContent = '';
		this.soundName = '';
		this.title = '';
		this.directions = '';
		this.currentTheme
		this.updateData();
		this.doUpdate();                               
		/*if (this.captivate.CPMovieHandle.pauseMovie ) {
			setTimeout("parent.cp.movie.pause(parent.cp.ReasonForPause.INTERACTIVE_ITEM)",100);
		}*/
		
		}
	},

	updateData: function()
	{
		var id = 0;
		var initresult = jQuery.parseXML( this.xmlStr );
		var initresultDoc = jQuery( initresult );
		var thexml = initresultDoc.find( 'string' ).text();  
		
		var result = jQuery.parseXML( thexml );
		var resultDoc = jQuery( result );
		//alert(jQuery.isXMLDoc(resultDoc));
		var theButtons = resultDoc.find( 'definitions' ); 
		var theTextProps = resultDoc.find( 'textProperties' );
		var theContentProps = resultDoc.find( 'buttonContent' );
		var theContentHeadProps = resultDoc.find( 'contentHeader' );
		var theButtonProps = resultDoc.find( 'labelText' );
		var theLettersProps = resultDoc.find( 'letterBarText' );
		var theHeaderProps = resultDoc.find( 'headerTitle' );
		var theInstProps = resultDoc.find( 'headerInst' );
		currentTheme = theTextProps.children('general').attr("themeNum");
		
		//setup styles
		contentStyles.color = theContentProps.children('color').attr("textColor");
		contentStyles.face = theContentProps.children('font').attr("face");
		contentStyles.italic = theContentProps.children('textDecoration').attr("italic");
		contentStyles.bold = theContentProps.children('textDecoration').attr("bold");
		contentStyles.size = theContentProps.children('font').attr("size");
		contentStyles.align = theContentProps.children('font').attr("align");
		

		//setup styles
		contentHeadStyles.color = theContentHeadProps.children('color').attr("textColor");
		contentHeadStyles.face = theContentHeadProps.children('font').attr("face");
		contentHeadStyles.italic = theContentHeadProps.children('textDecoration').attr("italic");
		contentHeadStyles.bold = theContentHeadProps.children('textDecoration').attr("bold");
		contentHeadStyles.size = theContentHeadProps.children('font').attr("size");
		contentHeadStyles.align = theContentHeadProps.children('font').attr("align");		
		
		buttonStyles.color = theButtonProps.children('color').attr("textColor");
		buttonStyles.textOver = theButtonProps.children('color').attr("textOver");
		buttonStyles.textDown = theButtonProps.children('color').attr("textDown");
		
		buttonStyles.face = theButtonProps.children('font').attr("face");
		buttonStyles.italic = theButtonProps.children('textDecoration').attr("italic");
		buttonStyles.bold = theButtonProps.children('textDecoration').attr("bold");
		buttonStyles.size = theButtonProps.children('font').attr("size");
		buttonStyles.align = theButtonProps.children('font').attr("align");	
		
		letterStyles.color = theLettersProps.children('color').attr("textColor");
		letterStyles.textColorOver = theLettersProps.children('color').attr("textOver");
		letterStyles.textColorDown = theLettersProps.children('color').attr("textDown");
		letterStyles.face = theLettersProps.children('font').attr("face");
		letterStyles.italic = theLettersProps.children('textDecoration').attr("italic");
		letterStyles.bold = theLettersProps.children('textDecoration').attr("bold");
		letterStyles.size = theLettersProps.children('font').attr("size");
		letterStyles.align = theLettersProps.children('font').attr("align");	
		
		
		headerStyles.color = theHeaderProps.children('color').attr("textColor");
		headerStyles.face = theHeaderProps.children('font').attr("face");
		headerStyles.italic = theHeaderProps.children('textDecoration').attr("italic");
		headerStyles.bold = theHeaderProps.children('textDecoration').attr("bold");;
		headerStyles.size = theHeaderProps.children('font').attr("size");
		headerStyles.align = theHeaderProps.children('font').attr("align");		
		
		instStyles.color = theInstProps.children('color').attr("textColor");
		instStyles.face = theInstProps.children('font').attr("face");
		instStyles.italic = theInstProps.children('textDecoration').attr("italic");
		instStyles.bold = theInstProps.children('textDecoration').attr("bold");
		instStyles.size = theInstProps.children('font').attr("size");
		instStyles.align = theInstProps.children('font').attr("align");				

		generalStyles.headerActive = theTextProps.children('general').attr("headerActive");
		generalStyles.headerColor = theTextProps.children('general').attr("headerColor");
		generalStyles.letterBarColor = theTextProps.children('general').attr("btnColorUp");
		generalStyles.contentHeaderColor = theTextProps.children('general').attr("contentHeaderColor");
		generalStyles.contentBodyColor = theTextProps.children('general').attr("contentBodyColor");
		generalStyles.bodyColor = theTextProps.children('general').attr("bodyColor");
		//generalStyles.btnColorUp = theTextProps.children('general').attr("btnColorUp");
		//generalStyles.btnColorOver = theTextProps.children('general').attr("btnColorOver");
		//generalStyles.btnColorDown = theTextProps.children('general').attr("btnColorDown");
		
/*
<button themeLabel="0" style="AeroArrow" txtRotationPos="0" a="1" b="0" c="0" d="1" tx="127.5" ty="100" arrowHead="38" arrowTail="31" fillColorRequired="false" fillColor="0xffffcc" borderColorRequired="false" borderColor="0xff9933" order="1">'
myData += '<text visible="true" width="170" height="20" a="1" b="0" c="0" d="1" tx="42" ty="138">Button Label 4</text>'
myData += '<buttonContent visible="true" picAlign="right" 

*/
		//headerActive, arrowColor, headerColor, contentBodyColor, bodyColor, btnColorUp, btnColorDown, btnColorOver, 
		//loop through each button node
		theButtons.children('definition').each(function(index) {
			textArray.push(cleanIt(jQuery( this ).children('label').text()));	
			buttonArray.push(cleanIt(jQuery( this ).children('def').text()));	
			imageIDArray.push(jQuery( this ).children('image').attr("id"));	//grab image id
			soundIDArray.push(jQuery( this ).children('sound').attr("id"));	//grab sound id		
			buttonXArray.push(jQuery( this ).children('buttonLocX').text());	
			picAlignArray.push(jQuery( this ).children('image').attr("picAlign"));			
		});
		
		//sortAnswers(textArray);
		
		//access other items on the stage
		this.title = resultDoc.find( 'general' ).attr("titleText");
		this.instructions = resultDoc.find( 'general' ).attr("instructionsText");
		
		
		///access audio and images
		
		for (num=0; num < imageIDArray.length; num++) {
			//first check images
			id = parseInt( imageIDArray[num] );	
			if (id != -1) { 
				imageArray[num] = this.movieProps.ExternalResourceLoader.getResourcePath( id )
				imageArray[num] = imageArray[num].replace("index.html", "");
			} else {
				imageArray[num] = -1;
			}
			//then check sound
			id = parseInt( soundIDArray[num] );	
			if (id != -1) { 
				soundArray[num] = this.movieProps.ExternalResourceLoader.getResourcePath( id )
		   		soundArray[num] = soundArray[num].replace("index.html", "");
			} else {
				soundArray[num] = -1;
			}
			
		}
	},
	
	doUpdate: function() 
	{
		//init the default html values
		//var divHtmlHeader = "<div class='header'><a>aaaa this button to see the response in the drop down box.</a></div>";
		//var divHtmlContent = "<div class='content'>aaaa job! That was easy, wasn't it?</div>";
		
		var tabHtmlHeader = "<li style='width: percent;'><a href='#placeholder'>Button Label JQuery</a></li>";
		var tabHtmlContent = "<div id='placeholder' class='tab_content' style='display: block;'><p>Testing JQuery</p></div>";



		//init the other elements on the page		
		var elem = document.getElementById('intTitle');
		elem.innerHTML = this.title;
		elem.tabIndex = tabindex;
		
		elem = document.getElementById('intInstructions');
		elem.innerHTML = this.instructions;
		elem.tabIndex = tabindex + 1;
		
				
				
				
		var button_elem;
		var body;
		var tabCount = textArray.length;
		var header
		//600, 14, 4
		var tabWidthPercentage
		if (tabCount == 2) {
			tabWidthPercentage = 560 / tabCount;
		} else if (tabCount == 3) {
			tabWidthPercentage = 530 / tabCount;
		} else if (tabCount == 4) {
			tabWidthPercentage = 510 / tabCount;
		}
		if (currentTheme == 3) { tabWidthPercentage = 100 } 
		//(1 / tabCount * 100) - 2;
		if (currentTheme == 2) { tabWidthPercentage -= 5 } 
		
		//	for (var i = 0; i < nodeCount; i++) {
		//$("#Timeline_Container").append("<div id='" + i + "' class='timelineNode' style='left: " + nodeLeftProperty[i] + "'>" + timelineLabel[i] + "</div>");
	
	//tabs_container
	//--> .timlineNode or id 1
	//--> id=tab1, .tab_content
	
	var leftPos;
	tindex =  tabindex + 2;
	
		//alert(tabWidthPercentage);
		jQuery.each(textArray, function(index, value) {
			//keys[index] = "Apple";
			//description[index] = "An Apple";
	
	//leftPos = parseInt(buttonXArray[index] - 50); //100 is the offset to even it out
			//button_elem = document.getElementById('tabs_container');
		  //	button_elem.innerHTML += "<li><a style='width: " + tabWidthPercentage + "px' href='#tab" + index + "' id='" + index + "'>" + textArray[index] + "</a></li>";			
			//textArray[index]
			//button_elem.innerHTML += "<div id='" + index + "' class='timelineNode' style='position:absolute; left: " + leftPos + "px'> </div>";			
			//add content first 
			
			
         //   <div id="Search_Result_Container" class="scroll-pane">
          //      <div id="Description">
				
				button_elem = document.getElementById('Search_Result_Container');
		
			//check if image exists
			if (imageArray[index] == "-1") { 
				button_elem.innerHTML += "<div id='tab" + index + "' class='tab_content' style='display: none;' tabindex="+tindex+">" + buttonArray[index] + "</div>";				
		   } else {  
				button_elem.innerHTML += "<div id='tab" + index + "' class='tab_content' style='height: 100px; display: none;' tabindex="+tindex+"><img width='150' align='" + picAlignArray[index] + "' height='150' src='" + imageArray[index] + "'/>" + buttonArray[index] + "</div> ";
			
		   }
		   
		   tindex = tindex + 1;
		   
 		 });
		 tabindex = tindex + 1;
		 
		populateGlossary(textArray, buttonArray);
		setupInput();
		
		changeTheme("themes/glossaryTheme" + currentTheme + ".css", "themes/headerTheme" + currentTheme + ".css" );
		
		setupStyle("#intTitle", headerStyles)
		setupStyle("#intInstructions", instStyles)
		setupStyle("#Search_Result_Container", contentStyles)
		setupStyle("#Search_Result_Header", contentHeadStyles)
		setupStyle(".sidebarWord", buttonStyles)
		setupStyle(".letterHead", buttonStyles)
		setupCustomStyles();
		//setupStyle(".tab_content", contentStyles)
		
		//getKeys();
		resizeInteraction(width,height);
    	addClickHandlers(); //setup the click handlers
		
	}
};

glossary_use = function ()
{
	return glossaryUse1;
}

