var user_id

chrome.runtime.onMessage.addListener(
    	function(request, sender, sendResponse) {
    		console.log(sender.tab ?
            	"from a content script:" + sender.tab.url :
                "from the extension");

        if (request.isUserID == "yes") {
          user_id = request.user_id;
          $('#user_id').append(user_id);
        }
  	});

$(document).ready(function(){
	chrome.runtime.sendMessage({msg: "get_user_id"}, function() { }); 
	$('#navigation').on('click', 'input', function(){
    window.alert("Please enter the code, " + user_id + ", on mechanical turk to get paid!");
		 chrome.runtime.sendMessage({msg: "experimentOver"}, function() { });
	 return false;
	});

});

