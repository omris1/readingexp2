var qualified = false;
var secret = "hush";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		console.log(sender.tab ?
        	"from a content script:" + sender.tab.url :
          "from the extension");
		// console.log(request);
		if (request.isQualified == true){
  			
  			secret = request.secret;
  			qualified = true;
			showQual();
    	} else {
    		console.log("showing disqual");
      		showDisQual();
    	}
});

function showQual() {
	console.log("1");
	$("#qualifiedDiv").show()
}

function showDisQual() {
	console.log("2");
	$("#disqualifiedDiv").show()
}


function checkText(){
	var code_item = document.getElementById("cont_code");
	var code = code_item.value;

	if (code === ""){
		window.alert("You cannot proceed without entering a code.\n\nPlease enter a code.");
		return false;
	} else if (code === secret) {
		return true;
	} else{
		window.alert("Incorrect code entered.\n\nPlease try again.");
		return false;
	}
}

function buttonClick(){
	if (qualified) {
		var form_valid = checkText();
		if (form_valid) {
			chrome.runtime.sendMessage({msg: "qualified_with_secret"}, function() { });			
		}
	} else {
		chrome.runtime.sendMessage({msg: "disqualified_finish"}, function() { });
	}
}

window.onload = function () {
  $("#qualifiedDiv").hide()
  $("#disqualifiedDiv").hide()
  document.getElementById("btnNext").onclick = buttonClick;
  chrome.runtime.sendMessage({msg: "get_qual"}, function() { });
};