var startTime = -1;
var isFirstQual = false;
var articleDuration = -1;
var isMinScrollSat = true;

function getTimeRemaining(endtime){
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}



function initializeClock(id, endtime){
  var clock = $(id);
  clock.show();

  function updateClock(){
    var t = endtime - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    clock.text(minutes + ":" + ("00" + seconds).substr(-2,2));
    if(t<=0){
      clearInterval(timeinterval);
      chrome.runtime.sendMessage({msg: "timerEnd", duration: articleDuration}, function(response) { });
    }
  }
  updateClock(); // run function once at first to avoid delay
  var timeinterval = setInterval(updateClock,1000);
}

function buttonClick(e) {
  console.log("button Click called, done button pressed");
  e.preventDefault();
  if ($(this).hasClass('disabled')) { return false; }
	var title = document.title;
	var url = window.location.href;
  console.log(title + ': ' + url);
  currentTime = new Date();
  qualDuration = (currentTime.getTime() - startTime.getTime()) / 1000;
  if (startTime != -1 && isFirstQual == true) {
    chrome.runtime.sendMessage({msg: "qualDuration", duration: qualDuration}, function() { });
  }
  else if (startTime != -1) {
    chrome.runtime.sendMessage({msg: "expDuration", duration: qualDuration}, function() { });
  }
  chrome.runtime.sendMessage({msg: "expButtonPress"}, function(response) { });
}


function sendMessageSaveData(){
  chrome.runtime.sendMessage({msg: "postFireBase"}, function(response) { });
}


function createButton() {
	  	var styles = 'position: fixed; z-index: 1; top: 20px; left: 20px;';
		$('<div class="reading_experiment" id="experiment_header"></div>').insertBefore(".logo");
		$('#experiment_header').append('<input type="button" id="first_button" value="TEST">');
		$('#first_button').on('click', buttonClick); 
	}

function createTimer(requiredMinutes, requiredSeconds) {
	var oldDateObj = new Date();
	var diff = (requiredMinutes * 60) + requiredSeconds;
  articleDuration = diff;
	var deadline = new Date(oldDateObj.getTime() + diff*1000);
	initializeClock('#clockdiv > span', deadline);
}

function createFloatingDiv() {
  $('body').append('<div id="expFloat">'+
                    '<div id="condDiv"><span id="condReminder"></span><br><div>' +
                    '<div id="clockdiv"><span></span></div>' + 
                    '<a href="#" id="btnDone" class="button"><span>✓</span>&nbsp;Done</a>' +
                '</div>');
  $('#btnDone').on('click', buttonClick);
}

function measureTime() {
  startTime = new Date();
  console.log("measuring time");
}

function updateCondTag(cond, isBtnDisabled) {
  if (typeof isBtnDisabled === 'undefined') { isBtnDisabled = false; }
  $('#expFloat').removeClass().addClass(cond);
  $('#condReminder').removeClass().addClass(cond);
  $('#btnDone').removeClass('read skim').addClass(cond);
  if (isBtnDisabled) { $('#btnDone').addClass('disabled')}
  var condDiv = document.getElementById("condDiv");
  var condSpan = condDiv.querySelector('#condReminder');
  if (cond == "skim"){
    condSpan.innerHTML = "Skim";
  } else if (cond == "read"){
    condSpan.innerHTML = "Read in-depth";
  }
  
}

function enableButton() {
  $('#btnDone').removeClass('disabled');
}

function TestAds() {
    console.log("testing ad");
    var adElementsList = $('.vmp-ad:visible, .motherboard-ad:visible');
    if ( adElementsList.length === 0 ) {
      console.log("ads blocked");
      window.alert("We have detected that you are running an ad-blocker. \nWe will redirect you to the previous page. Please disable the adblocker and start again.");
      chrome.runtime.sendMessage({msg: "adBlockDetect"}, function() { });
    } else {
      console.log("ads running");
    }
}

function blockAds() {
  console.log("blocking ads");
  var cnt = 10;
  var clearAdsTimer = setInterval(removeAds, 1000);
  function removeAds() {
    if (cnt > 0) {
      $('.vmp-ad:visible, .motherboard-ad:visible').hide();
      cnt--;
    } else {
      clearInterval(clearAdsTimer);
    }
  };
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
        	"from a content script:" + sender.tab.url :
            "from the extension");
		console.log("request: " + request);
    if (request.isShowDuration == "yes") {
      console.log("got show duration message")
  			//createTimer(10, 14);
        createTimer(request.minutes, request.seconds);
        console.log(request.minutes);
        console.log(request.seconds);
    }
    if (request.isFirstQual == "yes"){
        isFirstQual = true;
        updateCondTag('read', true);
        isMinScrollSat = false;
        // css for selecting one of the last paragraphs
        minScrollDepth = $('.rich-text > p:nth-child(15)').offset().top;
        window.onscroll = function(e) {
          if (!isMinScrollSat && window.scrollY > minScrollDepth) {
            isMinScrollSat = true;
            enableButton();
          }
        };
        console.log("first qual time limit: " + request.firstQualDuration*1000)
        setTimeout(enableButton, request.firstQualDuration*1000); 
    }
    if (request.isFirstQual == "no") {
        console.log("received not first qual message")
        updateCondTag(request.cond)
        chrome.runtime.sendMessage({msg: "getCurrentDuration"}, function() { });
    }
    console.log("Block ads condition: " + request.blockAds)
    
    if (request.blockAds) {
      blockAds();
    } else {
      console.log("not blocking ads");
    }


  });

$(document).ready(function() { 
  console.log("inject loaded");
  createFloatingDiv();
  measureTime();

  TestAds();

	chrome.runtime.sendMessage({msg: "getQualNumber"}, function() { });

  
  return false;
});

