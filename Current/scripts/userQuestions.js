

function sendUserAnswers(){
	console.log("demographQ button clicked");

		var readingTechnique = document.getElementById('technique').value;
		console.log( "readingTechnique: " + readingTechnique);
		if (readingTechnique === " "){
		window.alert("Please fill out all fields!");
		}
		else{
			chrome.runtime.sendMessage({msg: "userQuestions", "readingTechnique": readingTechnique}, function() { });
		}

		return false;

}

window.onload = function () {
  document.getElementById("userQ").onclick = sendUserAnswers;

};