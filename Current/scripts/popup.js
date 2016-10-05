chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		console.log(sender.tab ?
        	"from a content script:" + sender.tab.url :
          "from the extension");
		if (request.isNextUrl == "yes"){
  			chrome.tabs.create({url: request.url});
    }
    else if (request.isUserID == "yes") {
      $('#user_id').append(request.user_id);
    }
});



function createDebugDiv() {
  console.log("debug mode test");
  $('body').append('<div id="debugFloat">'+
                   '<div id="debugRead">DEBUG MODE<div>' +
                   '</div>');
}


$(document).ready(function(){
  if(window.canRunAds === undefined ){
    $('body').append('<div id="adblock_notice">ADBLOCKER DETECTED</div>');
  } else {
    console.log(canRunAds)
  }

  $('body').on('click', 'a', function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  $('#exp_navigation').on('click', 'input', function(){
    var initials = document.getElementById('initials').value
    console.log("initials are " + initials);
    if (initials === ""){
      window.alert("Please enter your initials to give consent to participate!");
    }
    else{
     chrome.runtime.sendMessage({msg: "get_demographics_page"}, function() { });
     return false;
    }
   });

  $(document).keypress(function(e){
    if(e.keyCode==13) {
      $('#exp_navigation > input').click();
    }
  });

  $('body').on( "keydown", function( event ) {
    if(event.which==13) {
      $('#exp_navigation > input').click();
    }
    if(event.shiftKey && event.ctrlKey && event.which == 74){
      console.log("DEBUG MODE");
      createDebugDiv();
      chrome.runtime.sendMessage({msg: "startDebugMode"}, function() { });
    }
    console.log(event.which);
  });
});