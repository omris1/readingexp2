

function sendUserAnswers(){
	console.log("demographQ button clicked");

		var readingTechnique = document.getElementById('technique').value;
		var assist_tech_used = document.getElementById('assist_tech_used').value;
		console.log( "readingTechnique: " + readingTechnique + "; assist_tech_used " + assist_tech_used);
		if (readingTechnique === " " || assist_tech_used ===" " ){
		window.alert("Please fill out all fields!");
		}
		else{
			chrome.runtime.sendMessage({msg: "userQuestions", "readingTechnique": readingTechnique, "assist_tech_used": assist_tech_used}, function() { });
		}

		return false;

}

window.onload = function () {
  document.getElementById("userQ").onclick = sendUserAnswers;

};