function sendDemographAnswers(){
	console.log("demographQ button clicked");
	var age_quest= document.getElementById("age");
	var part_age = age_quest[age_quest.selectedIndex].value;

	var gender_quest= document.getElementById("gender");
	var part_gender = gender_quest[gender_quest.selectedIndex].value;

	var edu_quest= document.getElementById("edu");
	var part_edu = edu_quest[edu_quest.selectedIndex].value;

	if (part_age === "-" || part_gender === "-" || part_edu === "-" ){
		window.alert("Please select an answer for each question!")
	}
	else{
		console.log("gender is: "+ part_gender + " age is: "+ part_age + " education is:  " + part_edu);
		chrome.runtime.sendMessage({msg: "save_demograph_quest", "age": part_age, "education": part_edu, "gender": part_gender}, function() { });
		chrome.runtime.sendMessage({msg: "getNextURL"} , function() { });
		return false;

	}
}

window.onload = function () {
  document.getElementById("demographQ").onclick = sendDemographAnswers;

};