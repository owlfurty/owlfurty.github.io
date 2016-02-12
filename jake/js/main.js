/* jslint node: true */
/* jshint newcap: false */
/* global mina */
/* global Snap */
/* global _gaq */
$(document).ready(function(){
	"use strict";

	  //====================================//
	 // Global vars
	//====================================//
	var //originalUrl 		= location.href,
		mobileWidth 		= 480,
		smallWidth  		= 600,
		browserHeight 		= $(window).height(),
		browserWidth 		= $(window).width(),
		//scrolling 			= window.requestAnimationFrame,
		lastPositionWork 	= -1,
		lastPositionAbout   = -1,
		scrollwheelActive 	= 0,
		scrollContainers 	= $(".aboutPage .containerInner, .workPage");

	$(window).resize(function(){
		browserHeight 	= $(window).height();
		browserWidth 	= $(window).width();
	});

  	  //====================================//
	 // Main Scrolling Events
	//====================================//
	function scrollAnimation(){
		//variables
		var nav 				= $("nav"),
			workPage			= $(".workPage"),
			workScrolled 		= workPage.scrollTop(),
			aboutScrolled 		= $(".aboutPage .containerInner").scrollTop();

		//don't recalculate if not scrolling
		if (lastPositionWork === workScrolled && lastPositionAbout === aboutScrolled) {
			
			//scrolling( scrollAnimation );
			
			return false;
		} else {

			//update last position when scrolling
			lastPositionWork = workScrolled;
			lastPositionAbout = aboutScrolled;
			
			//scrolling( scrollAnimation );

			if (workScrolled >= 0 && workPage.hasClass("activePage") && !workPage.hasClass("noScroll")){
				var textAnimationScroll = (workScrolled * 0.66),
					textOpacityScroll	= (workScrolled - (browserHeight * 0.4)) / (browserHeight * -0.4),
					stuckNavigationCalc = (((((workScrolled - browserHeight) / browserHeight) * (browserHeight * -0.33) + browserHeight * -0.33)) + 64);

				//intro text scroll animation
				$(".introText").css({'transform': "translateY(" + textAnimationScroll + "px)", 'opacity': textOpacityScroll});

				//sticky navigation
				if (browserWidth > mobileWidth){
					if (stuckNavigationCalc > 0){
						nav.css('transform', "translateY(" + stuckNavigationCalc + "px)").removeClass("withBackground");
					} else {
						nav.css('transform', "translateY(0px)").addClass("withBackground");
					}
				}
			}

			if($(".aboutPage").hasClass("activePage")){
				//parallax header
				if (aboutScrolled >= 0 && aboutScrolled <= browserHeight){
					$(".aboutPageBannerImage").css('transform', 'translateY(' + (aboutScrolled / 3) + 'px)');
				}
			}
	    }
	}

	// Call the loop to execute scroll events
	scrollContainers.on('mousewheel', function() {
		scrollAnimation();
		scrollwheelActive = 1;

		//timer to avoid more scroll functions if mousewheel event is already being used
		clearTimeout($.data(this, 'timer'));
		$.data(this, 'timer', setTimeout(function() {
		    //not using the scrollwheel anymore to scroll
		    scrollwheelActive = 0;
		}, 100));
	})

	//for non-scrollwheel
	.scroll(function(){
		//only run if scrollwheel isn't being used
		if (scrollwheelActive === 1){
			return false;
		} else{
			scrollAnimation();
		}
	});

	  //====================================//
	 // Sliding Nav Indicator
	//====================================//
	var link 			= $("nav li.link"),
		navIndicator	= $("li.navIndicator");

	function moveIndicator(linkObject){
		var linkPosition	= linkObject.position(),
			linkLeftPos 	= linkPosition.left + parseInt(linkObject.css('paddingLeft')),
			linkWidth		= linkObject.width();
		
		//move / change width of indicator
		navIndicator.velocity({ 
			left: linkLeftPos,
			width: linkWidth
		}, { queue: false, duration: 250, easing: [ 0.4, 0, 0.2, 1 ] });
	}

	//give initial width to indicator on page load
	function initialSlideIndicator(){
		$(window).load(function(){
			//
			var linkWidth = link.eq(0).width(),
				linkLeft  = (link.eq(0).position().left + parseInt(link.eq(0).css('paddingLeft')));
			navIndicator.css({"width": linkWidth, "left": linkLeft });
		});
	}

	//on hover move over hovered section
	link.mouseenter(function(){
		moveIndicator($(this));
	})

	//back to position when unhovered
	.mouseleave(function(){
		moveIndicator($("nav li.active"));
	});

	  //====================================//
	 // Animate in out nav bar background
	//====================================//
	function animateInNavBackground(){
		var nav = $("nav");
		nav.velocity({ 
			translateY: ["0px", nav.position().top]
		}, { queue: false, duration: 600, easing: [ 0.4, 0, 0.2, 1 ] });
		setTimeout(function(){
			nav.addClass("withBackground"); 
		}, 350);	
	}

	function animateOutNavBackground(){
		var scrolled 			= $(".workPage").scrollTop(),
			stuckNavigationCalc = (((((scrolled - browserHeight) / browserHeight) * (browserHeight * -0.33) + browserHeight * -0.33)) + 64);

		if (stuckNavigationCalc > 0){
			$("nav").removeClass("withBackground").velocity({ 
				translateY: [stuckNavigationCalc + "px", "0px"]
			}, { queue: false, duration: 600, easing: [ 0.4, 0, 0.2, 1 ] });
		}
	}

	  //====================================//
	 // Close work
	//====================================//
	function closeWork(){
		var theThumbnail		= $(".workThumbnail.expandedWork"),
			allThumbnails 		= $(".workThumbnail"),
			expandedWork 		= $(".expandedWork"),
			descriptionParts    = $(".descriptionTitle, .descriptionBody"),
			initialWidth		= 0,
			initialHeight 		= 0,
			initialLeft 		= 0,
			initialTop 			= 0;

		//get initial size
		if (theThumbnail.hasClass("small")){
			initialWidth 	= allThumbnails.filter(".small").not(expandedWork).width();
			initialHeight 	= initialWidth;
		} else if (theThumbnail.hasClass("medium")){
			initialWidth 	= allThumbnails.filter(".medium").not(expandedWork).width();
			initialHeight 	= allThumbnails.filter(".medium").not(expandedWork).outerHeight();
		} else if (theThumbnail.hasClass("large")){
			initialWidth 	= allThumbnails.filter(".medium").not(expandedWork).width();
			initialHeight 	= initialWidth;
		}

		//get initial left position
		if (theThumbnail.hasClass("columnOne")){
			initialLeft = allThumbnails.filter(".columnOne").not(expandedWork).position().left;
		} else if (theThumbnail.hasClass("columnTwo")){
			initialLeft = allThumbnails.filter(".columnTwo").not(expandedWork).position().left;
		} else if (theThumbnail.hasClass("columnThree")){
			initialLeft = allThumbnails.filter(".columnThree").not(expandedWork).position().left;
		}

		//get initial top position
		if (browserWidth > smallWidth){
			if (theThumbnail.hasClass("rowOne")){
				initialTop  = allThumbnails.filter(".rowOne").not(expandedWork).position().top;
			} else if (theThumbnail.hasClass("rowTwo")){
				initialTop  = allThumbnails.filter(".rowTwo").not(expandedWork).position().top;
			} else if (theThumbnail.hasClass("rowThree")){
				//since theres no thumbnails in this row
				initialTop  = allThumbnails.filter(".rowTwo").not(expandedWork).position().top + initialHeight;
			} else if (theThumbnail.hasClass("rowFour")){
				initialTop  = allThumbnails.filter(".rowFour").not(expandedWork).position().top;
			} else if (theThumbnail.hasClass("rowFive")){
				initialTop  = allThumbnails.filter(".rowFive").not(expandedWork).position().top;
			}
		} else {
			var positionInLayout = theThumbnail.attr("data-pos");
			initialTop = positionInLayout + "00vw";
		}

		//remove the close on click outside events
		theThumbnail.off();
		theThumbnail.removeClass("cursor");

		//shrink work back into position
		theThumbnail.removeClass("expandedWorkFinish").velocity({
			left: 			initialLeft,
			top: 			initialTop,
			width:    		initialWidth,
			height:   		initialHeight,
		}, { queue: false, duration: 600, easing: [ 0.23, 1, 0.32, 1 ], begin: function(){
			//remove all styles from the thumbnail image container to reset height
			theThumbnail.find(".thumbnailImageContainer, a").removeAttr('style');

			//fix mobile positioning
			if (browserWidth < smallWidth){
				theThumbnail.velocity({
					translateY: 	0
				}, { queue: false, duration: 600, easing: [ 0.23, 1, 0.32, 1 ]});
			}
			
			//fadeout work description
			theThumbnail.find(descriptionParts).removeClass("fadeIn");

			//scroll to the top thumbnail
			theThumbnail.find("a").velocity("scroll", { container: theThumbnail, mobileHA: false, duration: 0, easing: [ 0.23, 1, 0.32, 1 ] });

		}, complete: function() {
			//remove all styles from the thumbnail (to avoid anything janky) 
			theThumbnail.removeAttr('style').removeClass("expandedWork invisiblePadding");
			
			//return scrolling to parent
			$(".workPage").removeClass("noScroll");
		}});
	}

	$(document).on("click", ".backToWorkContainer", function(){
		closeWork();
		//replace this soon
		history.back();
	});

	  //====================================//
	 // Work Expand Animation
	//====================================//
	function ajaxWork(container, workUrl){
		//load contents of article on the desired page
		container.load( workUrl + " section > *" );
	}

	function openWork(element){
		//get index of parent
		var link 					= element.attr('href'),
			index 					= element.parent().index(),
			descriptionContainer	= element.prev(".workDescription"),
			theThumbnail			= $(".workThumbnail").eq(index),
			thumbnailPos    		= theThumbnail.position(),
			thumbnailWidth  		= theThumbnail.width(),
			finalTopPos 			= $(".workPage").scrollTop() - (browserHeight * 0.65 + 128),
			containerWidth 			= $(".workThumbnailContainer").width(),
			scaleMultiplier 		= containerWidth / thumbnailWidth,
			paddingStart 			= theThumbnail.css('paddingBottom'),
			thumbnailImageHeight    = 384;

		if (browserWidth <= mobileWidth){
			thumbnailImageHeight = 240;
		}

		//analytics
		_gaq.push(['_trackPageview', link]);

		//if already expanded ignore the link
		if (theThumbnail.hasClass("expandedWork")){
			return false;
		}

		//load in work description
		ajaxWork(descriptionContainer, link);

		//stop scrolling on parent
		$(".workPage").addClass("noScroll");

		//give thumbnail its starting position
		theThumbnail.css({
			"left": thumbnailPos.left + "px", 
			"top":  thumbnailPos.top + "px"
		});

		//animate nav bar to top if not already
		if (!$("nav").hasClass("withBackground")){
			animateInNavBackground();
		}

		//expand the thumbnail to top of container
		theThumbnail.addClass("expandedWork expandedWorkFinish").velocity({ 
			translateX: 	[-thumbnailPos.left, 0],
			translateY: 	[finalTopPos - thumbnailPos.top, 0],
			//scale updates the width
			scale: 			 scaleMultiplier,
			//padding updates the height
			paddingBottom:  [(browserHeight / containerWidth) * 100 / (scaleMultiplier) + "%", paddingStart]
		}, { queue: false, duration: 800, easing: [ 0.23, 1, 0.32, 1 ] }).velocity({
			//give it all the final dimensions (do a repaint)
			scale: 			1,
			width: 			"100%", 
			height: 		"100vh",
			paddingBottom:  "0px"
		}, { delay: 800, queue: false, duration: 0, complete: function(){
			theThumbnail.find("a").velocity({ 
				//shrink thumbnail image to header size
				height: thumbnailImageHeight
			}, { queue: false, duration: 600, easing: [ 0.23, 1, 0.32, 1 ], begin: function() {
				//animate in work description
				theThumbnail.find(".descriptionTitle, .descriptionBody").addClass("fadeIn");
			}, complete: function(){
				//give it all the final position so it doesn't break on browser resize
				theThumbnail.css({
					"transform": 		"",
					"left": 			"0px", 
					"top": 				finalTopPos + "px"

				//give invisible padding so scrollwheel shows on outside
				}).addClass("invisiblePadding")

				//click outside work to close it
				.on("click", function(e){
					var theThumbnail 		= $(this),
						mousePos 			= e.pageX,
						thumbnailWidth 		= theThumbnail.width(),
						leftPaddingEnd 		= parseInt(theThumbnail.css("padding-left")),
						rightPaddingStart	= thumbnailWidth + leftPaddingEnd;
					//if work already open
					if ($(".workThumbnail").hasClass("expandedWorkFinish") && browserWidth > mobileWidth){
						//if clicked on padding outside description
						if(mousePos < leftPaddingEnd || mousePos > rightPaddingStart){
							closeWork();
							//replace this soon
							history.back();
						}
					}
				})

				//show x when hovering outside work on padding
				.on("mouseover", function(e){
					var theThumbnail 		= $(this),
						mousePos 			= e.pageX,
						thumbnailWidth 		= theThumbnail.width(),
						leftPaddingEnd 		= parseInt(theThumbnail.css("padding-left")),
						rightPaddingStart	= thumbnailWidth + leftPaddingEnd;
					//if work already open
					if ($(".workThumbnail").hasClass("expandedWorkFinish") && browserWidth > mobileWidth){
						if(mousePos < leftPaddingEnd || mousePos > rightPaddingStart){
							theThumbnail.addClass("cursor");
						} else{
							theThumbnail.removeClass("cursor");
						}
					}
				})

				//cement the height and force repaint for higher resolution
				.find(".thumbnailImageContainer").css({
					"height": 			thumbnailImageHeight + "px",
					"padding-bottom": 	"0px"
				});
			}});
		}});
	}

	$(".workThumbnail > a").click(function(e){
		e.stopPropagation();
		//stop link clicking
		e.preventDefault();

		openWork($(this));
		//update url
		history.pushState(null, null, $(this).attr('href'));
	});

	  //====================================//
	 // Work Thumbnail Hover Eyecon
	//====================================//
	var parentSvg 		= Snap('.eyecon'),
		eyeconSVG 		= parentSvg.selectAll('path'),
		eyeconCircle 	= $(".eye svg circle");

	//timeouts
	var timeoutArray = [];
	var eyeInterval = null;

	function refreshEyeAnimation(){
		//reset all timers
		clearInterval(eyeInterval);
		for (var t = 0; t < timeoutArray.length; t++) {
			clearTimeout(timeoutArray[t]);
		}
		//clear the array to get rid of junk
		timeoutArray = [];
		//reset animation
		eyeconSVG.animate({
			d: "M22,14c-7.485,0-14,8-14,8s6.515,8,14,8c7.484,0,14-8,14-8S29.484,14,22,14z"
		}, 100, mina.easein);
	}

	//the animation
	function eyeconAnimation(){
		var startSvgDValue = "M22,14c-7.485,0-14,8-14,8s6.515,8,14,8c7.484,0,14-8,14-8S29.484,14,22,14z",
			endSvgDValue   = "M22,22c-7.485,0-14,0-14,0S14.515,22,22,22c7.484,0,14,0,14,0S29.484,22,22,22z";
		
		//first blink animation
		eyeconSVG.animate({
			d: endSvgDValue
		}, 140, mina.easein);
		timeoutArray.push(setTimeout(function(){
			eyeconSVG.animate({
				d: startSvgDValue
			}, 200, mina.easein);
		}, 250));

		//blink again & look up
		timeoutArray.push(setTimeout(function(){
			eyeconSVG.animate({
				d: endSvgDValue
			}, 140, mina.easein);
		}, 1000));
		timeoutArray.push(setTimeout(function(){
			eyeconSVG.animate({
				d: startSvgDValue
			}, 200, mina.easein);
		}, 1200));
		timeoutArray.push(setTimeout(function(){
			eyeconCircle.velocity({
				cx: "21",
				cy: "20"
			}, { queue: false, duration: 200, easing: [ 0.4, 0, 0.2, 1 ] });
		}, 1200));

		//blink again and look back down
		timeoutArray.push(setTimeout(function(){
			eyeconSVG.animate({
				d: endSvgDValue
			}, 140, mina.easein);
		}, 2400));
		timeoutArray.push(setTimeout(function(){
			eyeconSVG.animate({
				d: startSvgDValue
			}, 200, mina.easein);
		}, 2600));
		timeoutArray.push(setTimeout(function(){
			eyeconCircle.velocity({
				cx: "22",
				cy: "21"
			}, { queue: false, duration: 200, easing: [ 0.4, 0, 0.2, 1 ] });
		}, 2600));
	}

	//event handlers
	$(".eye").hover(function(){
		//delay to compensate for hover animation
		timeoutArray.push(setTimeout(function(){
			//initial animation
			eyeconAnimation();
			//repeat
			eyeInterval = setInterval(function(){
				eyeconAnimation();
			}, 3600);
		}, 600));
	}).mouseleave(function(){
		//refresh timers
		refreshEyeAnimation();
	});

	  //========================================//
	 // Gyroscope work thumbnails
	//========================================//

	//setup gyroscope origin
	var gyroOriginTrigger 	= false,
		gyroOrigin 			= null;
	function gyroOriginFunction(a, b, c){
		gyroOrigin = [a.toFixed(0), b.toFixed(0), c.toFixed(0)];
		if (gyroOrigin[0] !== "0" && gyroOrigin[1] !== "0" && gyroOrigin[2] !== "0" ){
			gyroOriginTrigger = true;
		}
	}

	//animate thumbnails
	function gyroThumbnails(a, b, c){
		if (!$(".workThumbnail").hasClass("expandedWorkFinish")){
			if (gyroOriginTrigger === false && browserWidth <= mobileWidth){
		    	gyroOriginFunction(event.alpha, event.beta, event.gamma);

		    	//if there is a gyrometer present remove class so we can remove hovers
				$(".workContainer").removeClass("noGyro");
		    }

		    var backgroundCenter = (browserWidth / 3);
		    
			if ($(".workPage").hasClass("activePage")){
				//top gyro effect = more motion
				$(".gyroTop").css("transform", "translateX(" + (gyroOrigin[2] - c) * -0.35 + "px) translateY(" + (gyroOrigin[1] - b) * -0.35 + "px) translateZ(0px)");	

				//bottom gyro effect = less motion
		        $(".gyroBottom").css("transform", "translateX(" + (gyroOrigin[2] - c) * -0.2 + "px) translateY(" + (gyroOrigin[1] - b) * -0.2 + "px) translateZ(0px)");	

		        //background gyro
		        var gyroBackgroundX = ((gyroOrigin[2] - c) * -0.15) - backgroundCenter,
		        	gyroBackgroundY = ((gyroOrigin[1] - b) * -0.15) - backgroundCenter;
		        $(".gyroBackground").css("background-position",  gyroBackgroundX + "px " + gyroBackgroundY + "px");
			}
		} else{
			//remove gyro event listener and style to reposition image as banner
			$(".gyroTop, .gyroBottom").removeAttr('style');
		}
	}

	// Gyro event listener
	if (window.DeviceOrientationEvent) {

		//create event listener
	    window.addEventListener("deviceorientation", function (e) {
	    	e.preventDefault();
	        gyroThumbnails(event.alpha.toFixed(1), event.beta.toFixed(1), event.gamma.toFixed(1));
	    }, true);
	}

	  //====================================//
	 // Navigation scrolling + animation
	//====================================//
	var currentSection 	= 0;

	function slide(amount){
		$("section").css("transform", "translateX(" + amount + "%)");
	}

	function slideNav(clickedLink){
		var clicked 		= clickedLink,
			desiredSection 	= clickedLink.index(),
			nav 			= $("nav"),
			workPage 		= $(".workPage");

		//Tap indication animation for Nav on mobile
		if (browserWidth <= mobileWidth && clicked.hasClass("link") && !clicked.hasClass("active")){
			clicked.addClass("clickedNav");
			setTimeout(function(){
				clicked.removeClass("clickedNav");
			}, 800);
		}

		//udpate nav indicator
		link.removeClass("active")
		.eq(desiredSection).addClass("active");

		//move indicator if clicked on logo
		if (!clickedLink.hasClass("link")){
			moveIndicator(link.eq(desiredSection));
		}

		//close work if already on work section, and on work description, not main thumbnails
		if (currentSection === 0 && desiredSection === 0 && $(".workThumbnail").hasClass("expandedWork")){
			closeWork();
			//replace this soon
			history.back();
		}

		//update active page
		$("section").removeClass("activePage").eq(desiredSection).addClass("activePage");

		//update nav position for each page
		if (browserWidth > mobileWidth){
			if (!workPage.hasClass("activePage")){
				animateInNavBackground();	
			} else if (workPage.hasClass("activePage") && nav.hasClass("withBackground")){
				animateOutNavBackground();
			}
		}

		//slide animation
		slide("-" + desiredSection + "00");

		//update current section
		currentSection = desiredSection;

		//close work/journal
		if ($(".workThumbnail").hasClass("expandedWork")){
			closeWork();
			//replace this soon
			history.back();

			//return scrolling to parent
			$(".workPage").removeClass("noScroll");
		} else if($(".journalEntry").hasClass("expandedEntry")){
			closeJournalEntry();
			//replace this soon
			history.back();
		}
		
	}

	$("nav li.link, nav .logo").click(function(){
		var clicked = $(this);
		slideNav(clicked);
	});

	  //====================================//
	 // Jake Blakeley -> Jake.ly animation in introduction text
	//====================================//
	var nameAnimationTriggered = 0;
	function nameAnimation(){
		if (nameAnimationTriggered === 0 && $(".workPage").scrollTop() < ($(window).height() / 4)){
			var introText 		= $(".introText"),
				hidingElements	= introText.find("span.hide");

			//hide animation
			hidingElements.velocity({
				width: [0]
			}, { queue: false, duration: 450, easing: [ 0.4, 0, 0.2, 1 ] }).velocity({ 
				opacity: [0, 1]
			}, { queue: false, duration: 225, easing: [ 0.4, 0, 0.2, 1 ] });
			
			//fix underline for transition
			introText.find("span.l").addClass("noBackground");

			introText.find("span.jake").velocity({ 
				paddingRight: "3px",
				marginRight: "-3px"
			}, { queue: false, duration: 450, easing: [ 0.4, 0, 0.2, 1 ], complete: function(){
				//remove cursor pointer, so people don't think it can animate back
				introText.find("span").addClass("animated");
			} });

			//trigger so it won't run again
			nameAnimationTriggered = 1;
		}	
	}

	//actual events
	$(".introText span").click(function(){ nameAnimation(); })
	.mouseenter(function(){ nameAnimation(); });

	  //====================================//
	 // Journal Expand Animation
	//====================================//
	function ajaxJournal(container, journalUrl){
		//load contents of article on the desired page
		//container.load( journalUrl + " .journalEntryBodyInner" );
		$.ajax({
		    url: journalUrl,
		    success: function(html) {
		        var content = $('<div />').html(html).find('.journalEntryBodyInner');
		        container.html(content);
		    }
		});
	}

	function openJournalEntry(link, descriptionContainer, theJournalEntry){
		//load in journal entry
		ajaxJournal(descriptionContainer, link);

		//transition height of the container
		descriptionContainer.velocity({ 
			height: [browserHeight, 0]
		}, { queue: false, duration: 400, easing: [ 0.23, 1, 0.32, 1 ], begin: function(){
			//transition in the journal entry content
			setTimeout(function(){
				theJournalEntry.addClass("expandedEntry");
			}, 100);
		}, complete: function(){
			//on complete update to original height
			descriptionContainer.css({"height": "auto"});
		}});
	}

	function closeJournalEntry(){
		var expandedEntry = $(".expandedEntry");

		//animate closed
		expandedEntry.find(".journalEntryBody").velocity({ 
			height: 0
		}, { queue: false, duration: 400, easing: [ 0.23, 1, 0.32, 1 ], complete: function(){
			//remove class
			expandedEntry.removeClass("expandedEntry");
		} });
	}

	$(".journalEntry > a").click(function(e){
		//stop link clicking
		e.preventDefault();

		//close if already open
		if($(this).parent().hasClass("expandedEntry")){
			closeJournalEntry();
			//replace this soon
			history.back();
		} else {
			//get index of parent
			var link 					= $(this).attr('href'),
				index 					= $(this).parent().index(),
				descriptionContainer	= $(this).next(".journalEntryBody"),
				theJournalEntry			= $(".journalEntry").eq(index);

			//if another entry is already open
			if ($(".journalEntry").hasClass("expandedEntry")){
				//close all other entries
				closeJournalEntry();

				//scroll to top of the journal entry (to align to top)
				theJournalEntry.velocity("scroll", { container: $(".journalPage"), mobileHA: false, duration: 400, easing: [ 0.23, 1, 0.32, 1 ], complete: function(){
					//open the new entry
					openJournalEntry(link, descriptionContainer, theJournalEntry);
					
					//update url
					history.pushState(null, null, link);
				}});
			//if no other entries are open
			} else {
				//scroll to top of the journal entry (to align to top)
				theJournalEntry.velocity("scroll", { container: $(".journalPage"), mobileHA: false, duration: 600, easing: [ 0.23, 1, 0.32, 1 ] });

				//open the entry
				openJournalEntry(link, descriptionContainer, theJournalEntry);
				
				//update url
				history.pushState(null, null, link);
			}
		}
	});

	  //====================================//
	 // Social api functions for footer
	//====================================//
	//dribbble
	$.get( "https://api.dribbble.com/v1/users/Jakely?access_token=3d7fa1a3c4c6c792ffc2a77f21051c7fe3a6c873c4d39d40e80da4cc56dfc795", function( data ) {
		//get data
		var pixelsPerShot 		= (800*600),
			pixelsDribbbled 	= data.shots_count * pixelsPerShot,
			dribbbleContainer 	= $(".pixelsDribbbled");

		//add into html
		dribbbleContainer.text(pixelsDribbbled);
	});

	//twitter
	$.ajax({
	    url: 'https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=JakelyDesigns',
	    dataType: 'jsonp',
	    success: function(data){
	        var followers 			= data[0].followers_count,
				twitterFollowers	= $(".twitterFollowers");
			twitterFollowers.text(followers);
	    },
	    fail: function(){
	    	$(".twitterFollowers").text("150");
	    }
	});

	  //====================================//
	 // Email Security
	//====================================//
	//update email text to avoid spam
	$(window).load(function(){
		setTimeout(function(){  
			var username = "Jakeblakeley93";
			var hostname = "gmail.com";
			$(".emailText").text(username + "@" + hostname);
		}, 500);
	});

	  //====================================//
	 // Contact Page Form
	//====================================//
	//on .blur if text !== empty then keep animation
	$("form input, form textarea").blur(function(){
		if ($(this).val() === ''){
			$(this).removeClass("filled");
		} else {
			$(this).addClass("filled");
		}
	}).on('keyup blur', function() {
		//once all the inputs are filled then activate submit button
		var input 		= $("form input"),
			textarea	= $("form textarea"),
			formButton	= $("form button");
		if ($.trim(input.eq(0).val()).length !== 0 && $.trim(input.eq(1).val()).length !== 0 && $.trim(textarea.val()).length >= 10){
				formButton.removeClass("inactive");
		} else {
			formButton.addClass("inactive");
		}
	});

	  //====================================//
	 // History API
	//====================================//
	function openWorkOrJournal(url, onPageLoad){
		var cleanedUrl 		= url.split('?')[0],
			workThumbnails 	= $(".workThumbnail a"),
			journalEntries 	= $(".journalEntry a"),
			matchedWork 	= null,
			matchedJournal 	= null,
			urlExtension	= cleanedUrl.split('.').pop();

		//if url doesn't already include the .html
		if (urlExtension !== "html" ){
			cleanedUrl = cleanedUrl + ".html";
		}

		//search for this url in work thumbnails
		for (var w = 0; w < workThumbnails.length; w++) {
			var workUrl = workThumbnails.eq(w).attr("href");
			if (cleanedUrl === workUrl){
				//send this forward
				matchedWork = w;
				break;
			}
		}

		//if it doesn't match a work url then check the journal urls
		if (matchedWork === null){
			for (var j = 0; j < journalEntries.length; j++) {
				var journalUrl = journalEntries.eq(j).attr("href");
				if ("/journal/" + cleanedUrl === journalUrl){
					//send this forward
					matchedJournal = j;
					break;
				}
			}
		}

		//open the relevant work/journal
		if (matchedWork !== null) {
			initialSlideIndicator();

			//scroll to this thumbnail
			$(".workThumbnail").eq(matchedWork).velocity("scroll", { offset: $(".workContainer").position().top, container: $(".workPage"), mobileHA: false, duration: 400, easing: [ 0.23, 1, 0.32, 1 ], complete: function(){
				//open work
				if (onPageLoad === true){
					setTimeout(function(){
						openWork($(".workThumbnail > a").eq(matchedWork));
						console.log("openwork from popstate");

						//update url
							history.pushState(null, null, cleanedUrl);
					}, 400);
				} else{
					openWork($(".workThumbnail > a").eq(matchedWork - 1));
					console.log("openwork from popstate");
				}
			} });
		} else if (matchedJournal !== null) {
			var theJournalEntry			= $(".journalEntry").eq(matchedJournal),
				descriptionContainer 	= $(".journalEntryBody").eq(matchedJournal),
				journalPageNavLink 		= $("nav ul li").eq(1);

			//scroll to journal section
			$("nav").velocity({ 
				translateY: "0px"
			}, { queue: false, duration: 0, complete: function(){
				$("section").velocity({ 
					translateX: "-100%"
				}, { queue: false, duration: 0 });
				moveIndicator(journalPageNavLink);
				slideNav(journalPageNavLink);
			} }).addClass("withBackground");	
			

			//scroll to top of the journal entry (to align to top)
			theJournalEntry.velocity("scroll", { container: $(".journalPage"), mobileHA: false, duration: 600, easing: [ 0.23, 1, 0.32, 1 ] });
			
			//update url
			if (onPageLoad === true){
				history.pushState(null, null, "/journal/" + cleanedUrl);
			}

			//open the entry
			openJournalEntry("/journal/" + cleanedUrl, descriptionContainer, theJournalEntry);
		} else if (cleanedUrl !== null || cleanedUrl !== "" || cleanedUrl !== " ") {
			//
			initialSlideIndicator();

			console.log("404");
			console.log(cleanedUrl);

			//page cannot be found
			$(".popup404").addClass("show");

			setTimeout(function(){
				$(".popup404").addClass("hide");
			}, 4000);

			//reset url
			history.replaceState(null, null, "/");

			//
			return false;
		}
	}

	//close 404 popup
	$(".popup404 .close").click(function(){
		$(".popup404").addClass("hide");
	});

	function onPopState(){
		console.log("popstate");
		if ($(".workThumbnail").hasClass("expandedWork")){
			closeWork();

			//return scrolling to parent
			$(".workPage").removeClass("noScroll");
		} else if($(".journalEntry").hasClass("expandedEntry")){
			closeJournalEntry();
			console.log("close journal");
			//return scrolling to parent
			$(".workPage").removeClass("noScroll");
		} else{
			//forward button check url
			var urlPath 		= window.location.pathname.split("/"),
				urlPathLast		= urlPath[urlPath.length - 1];
			console.log(urlPathLast);

			//
			openWorkOrJournal(urlPathLast, false);
		}
	}
	
	var pageLoaded = 0;
	//popstate event that ignores initial load
	window.addEventListener('load', function() {
	  	setTimeout(function() {
			window.addEventListener('popstate', function() {
		  		onPopState();
			});
	  	}, 500);
	});

	//check if we're coming from another url
	var queryString = window.location.search.slice(1);
	if (queryString.length > 0){
		//add a state so on back button we go to the main page again
		history.replaceState(null, null, "/");

		//open work or journal page
		openWorkOrJournal(queryString, true);
	} else{
		initialSlideIndicator();
	}
});


  //====================================//
 // Mail functions
//====================================//
//success animation
function mailSuccess(){
	//hide error messages
	$('#errors').hide();

	//collapse the forms
	$(".formInputs").addClass("collapse");

	//show success message
	$('#success, form button').addClass("messageSent");
		
	//transform to checkmark
	setTimeout(function(){
		$("form button").addClass("checked");
	}, 400);
}

//error animation
function mailError(){
	var errorNotice 		= $('#errors'),
		successNotice 		= $('#success');

	//show error messages
	errorNotice.show();

	//hide success message
	successNotice.hide();
}

//main mail functions
$(function(){
	//set global variables and cache DOM elements for reuse later
	var form 				= $('form'),
		formElements 		= form.find('input[type!="submit"],textarea'),
		formSubmitButton 	= form.find('#submit-button'),
		errorNotice 		= $('#errors'),
		loading 			= $('#loading'),
		errorMessages 		= {
			required: ' is a required field',
			email: 'You have not entered a valid email address for the field: ',
			minlength: ' must be greater than '
		};
	
	//to ensure compatibility with HTML5 forms, we have to validate the form on submit button click event rather than form submit event. 
	//An invalid html5 form element will not trigger a form submit.
	formSubmitButton.on('click',function(){
		var formok = true,
			errors = [];
			
		formElements.each(function(){
			var name = this.name,
				nameUC = name.ucfirst(),
				value = this.value,
				type = this.getAttribute('type'), //get type old school way
				minLength = this.getAttribute('data-minlength');
			
			//if HTML5 formfields are supported			
			if( (this.validity) && !this.validity.valid ){
				formok = false;
				
				console.log(this.validity);
				
				//if there is a value missing
				if(this.validity.valueMissing){
					errors.push(nameUC + errorMessages.required);	
				}
				//if this is an email input and it is not valid
				else if(this.validity.typeMismatch && type === 'email'){
					errors.push(errorMessages.email + nameUC);
				}
				
				this.focus(); //safari does not focus element an invalid element
				return false;
			}
			
			//check minimum lengths
			if(minLength){
				if( value.length < parseInt(minLength) ){
					this.focus();
					formok = false;
					errors.push(nameUC + errorMessages.minlength + minLength + ' charcters');
					return false;
				}
			}
		});
		
		//if form is not valid
		if(!formok){
			
			//show error message 
			showNotice('error',errors);
			
		}
		//if form is valid
		else {
			loading.show();
			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: form.serialize(),
				success: function(){
					showNotice('success');
					form.get(0).reset();
					loading.hide();
				}
			});
		}
		
		return false; //this stops submission off the form and also stops browsers showing default error messages
		
	});

	//other misc functions
	function showNotice(type,data){
		if(type === 'error'){
			
			errorNotice.find("li[id!='info']").remove();
			var x;
			for(x in data){
				errorNotice.append('<li>'+data[x]+'</li>');	
			}
			mailError();
		}
		else {
			mailSuccess();	
		}
	}
	
	String.prototype.ucfirst = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
	
});