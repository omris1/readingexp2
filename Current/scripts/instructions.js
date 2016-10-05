var skimInstructions = "";
var readInstructions = "";

$(document).ready(function(){
  chrome.runtime.sendMessage({msg: "instructionsLoaded"}, function() { });
  $('#btnNext').on('click', function(){
  	chrome.runtime.sendMessage({msg: "finishedInstructions"}, function() { });
  return false;
  });
  $(document).keypress(function(e){
    if(e.keyCode==13) {
      $('#btnNext').click();
    }
  });
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
        	"from a content script:" + sender.tab.url :
          "from the extension");
    var div_sel;
    if (request.cond == "qual"){
      div_sel = '#firstInstructionsDiv';
    } else if (request.cond == "read") {
      div_sel = '#readInstructionsDiv';
      var clock = document.getElementById("timeDivRead");
      clock.innerHTML = request.minutes + ":" + ("00" + Math.floor(request.seconds)).substr(-2,2);
      console.log("received time: " + request.minutes + ":" + request.seconds);
    } else if (request.cond == "skim") {
      div_sel = '#skimInstructionsDiv';
      var clock = document.getElementById("timeDivSkim");
      clock.innerHTML = request.minutes + ":" + ("00" + Math.floor(request.seconds)).substr(-2,2);
      console.log("received time: " + request.minutes + ":" + request.seconds);
	  } else if (request.cond == "questions") {
      div_sel = '#questionsInstructionsDiv';
    }
    $(div_sel).show();
  });