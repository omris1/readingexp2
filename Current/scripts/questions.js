var currentArticleID = -1;
var currentQuestionID = 0;
var allArticleQuestions = [
                          ["\"The argument goes like this: eating meat is _________\": ", "The article states that the production of meat: ", "The UN report argued in favor of _________", "What is the solution to the wastefulness according to the UN report?", "Researchers at Carnegie Mellon said that vegetarian diets contribute more to _____ than omnivorous diets:", "The researchers claim that USDA recommendations lead the public to:"],
                          ["Middle Class Parents are accidentally turning their children into:", "What are \"Posh Dads\" incapable of doing when they are pouring a glass of wine?", "The study surveyed: ", "What did the Health and Social Care Information Center find about \"posh kids\" versus the \"underclass scum\"", "It's technically legal to: ", "Research indicates that the younger someone starts drinking, the more likely they are to: "],
                          ["Among all 33 counties included in the Perils of Perception survey New Zealand ranked ___ according to the index of ignorance:", "\"Kiwis ranked behind Australia, the US, and China in their ability to estimate how the population was performing across a number of subjects like _____\"", "The biggest disconnect found in the study was regarding New Zealanders' view of the nation's:", "What did the Kiwis believe about the the distribution of wealth in their country:", "Besides the surprising disconnects, the survey demonstrated that:", "The study, pointed out that the areas where citizens showed the least accurate perceptions were:"],
                          ["In the early 1500s what were the revolutionary brewers doing?", "How does the lager get its taste?", "\"The team's research [at University of Wisconsin, Madison] draws on _____\":", "What did old school German brewers do in their quest to make ale:", "The research team argues that their method would allow brewers to:", "What is the problem with most industrial species of yeast?"],
                          ["\"Taking _______ away from a psychiatric patient would burden them with additional pressure\"?", "Blondie got his nickname from:", "In the case of psychomotor agitation patients:", "When are patients chained to a bed?", "Social tensions of past decades in Serbia:", "Most 20-something patients stress about:"],
                          ["According to a recent study Australian adults are leading the world in:", "In other European countries where party drugs are popular:", "According to Dr. David Caldicott from the Australian National University, what is NOT the main cause for overdose:", "What is causing Australians to overdose the most?", "According to Caldicott, what do Australians need to do to prevent deaths at music festivals?", "What evidence is provided that the above policy could work?"],
                          ["Tim and Lance from the real time podcast Missing Maura Murray say: \"if we believe _____ then it's more real than entertainment, and if we don't believe that then it's all entertainment:\"", "When a true crime podcast progresses in real time:", "\"I don't feel that discussing a murder or disappearance is ______\" says Aaron of the long-running Generation Why podcast:", "What is one benefit of true crime podcasts that Aaron mentioned?", "Talking to Aaron, Justin, Tim and Lance made the author realize that his fear about being either medically ill or an accomplice to hurt is:", "The article ends with Aaron saying that it is legitimate to publicize a crime in podcasts because:"],
                          ["What happens to the author when he clicks away from a news article about the government's mass surveillance?", "What does the author say is the reason for him to quickly forget and stop worrying about government surveillance?", "______ spying powers has happened in the past", "How did congress react to the leaks in the 1970's?", "\"The creeping suspicion that we're all being monitored by the government is, itself, something to be feared if you're ______\":", "Which of the following is NOT true about writers after the Snowden revelation:"],
                          ];

var allArticleResponses = [
                          [["immoral and unethical because of animal cruelty","the biggest contributor to pollution", "inefficient and requires many resources", "unhealthy and bad for your cholesterol"],
                           ["causes the spread of disease","is very unethical and cruel to the animals", "has no effect on the environment", "releases greenhouse emissions into the air"],
                           ["paleo diets","meat and dairy free diets", "organic only diets", "balanced and healthy diets"],
                           ["improving efficiency in the production of agricultural products","impose portion controls on the general population", "improving efficiency in the production of animal products", "genetically modifying food to make it bigger"],
                           ["weight loss","climate change", "resource depletion", "the environment"],
                           ["lead healthier lifestyles","be more mindful of the earth", "inadvertently consume more animal products", "consume more resources per calorie"]],
                          [["uptight over-achievers","raving alcoholics", "sophisticated wine drinkers", "over privileged spoiled brats"],
                           ["pouring a gigantic portion","taking a sip themselves", "mentioning France", "discussing the flavor profile of the wine"],
                           ["parents about giving alcohol to their children","children under the age of 15 about their drinking habits", "adults who had been given wine by their parents as children", "parents about their drinking habits"],
                           ["Posh kids were twice as likely to be regular drinkers","Underclass kids were more likely to grow up to be alcoholics", "No significant difference in long-term health outcomes between classes", "Posh Kids were more likely to give alcohol to their kids"],
                           ["put minors on trial if caught drinking","give children alcohol if it is part of their religious beliefs", "give children alcohol at home or on private premises", "take children away from reckless parents"],
                           ["try out drugs in adolescence","make poor decisions as an adult", "have problems with alcohol later in life", "have lower income"]],
                          [["1st","last", "5th", "3rd"],
                           ["carbon emissions per capita and energy efficiency","education and literacy rates", "female employment and obesity", "awareness of global events and general knowledge"],
                           ["wealth","urbanization", "age", "literacy rates"],
                           ["that the rich own much more than they really do","that the super rich are much older than in other countries", "that the rich own much less than they really do", "that the gap between rich and poor shrinks every year"],
                           ["nations can be entirely out of touch with reality","mass self perception can be manipulated and influenced", "a nation can hold narrow-minded views", "self-perceptions shift over time"],
                           ["not featured in the news","esoteric, difficult concepts", "taught to the nation in public schools", "extensively covered in the media"]],
                          [["Fermenting beers using crates","Mixing different types of beers", "Using different barleys to make beer", "Fermenting beers in caves"],
                           ["an ancient strain of yeast brought over from Asia gives it its taste","it is brewed at very cold temperatures, giving it a crisp taste", "a hybrid strain of yeast found in caves gives it its taste", "the wood imparts an earthy flavor to it"],
                           ["the wisdom of old-school German cave brewers","research from the Lager industry", "sophisticated techniques used in Biology", "numerous experiments of trial and error"],
                           ["let the beer ferment for much longer","inadvertently purified the yeast strain they were using", "encouraged the hybridization of two forms of yeast", "brewed beer at very low temperatures"],
                           ["be creative and experiment more","become even more profitable", "produce existing beer flavors with better precision", "create darker tasting beers that are lighter bodied"],
                           ["they hybridize too slowly","they are sterile", "they are not consistent enough for hybridization", "they produce only darker tasting flavors"]],
                          [["pills","cigarettes", "personal liberties", "loved ones"],
                           ["it's his real name","the way he looks", "his parents", "people at the hospital"],
                           ["are put in a strait jacket","are given electric shock therapy", "lash out at doctors", "receive pharmaceutical treatment"], 
                           ["when they are threatening to commit suicide","when they are seeing things", "when drugs don't help", "when they cannot be reasoned with"],
                           ["are now on the rise ","have created financial instability", "have created prolonged adolescence ", "have been resolved almost completely"],
                           ["romantic relationships and demanding jobs", "exams and high expectations for success ", "mortgage payments and housing", "unemployment and dependence on parents"]],
                          [["ecstasy consumption","alcohol consumption", "death rate in festivals", "drug use in festivals"],
                           ["the number of deaths is much lower","people are more cautious when buying drugs", "the number of deaths is much higher", "drug use is better regulated"],
                           ["self-administered drugs","mixing drugs with alcohol", "the underground drug market", "contaminated drugs"],
                           ["pills are contaminated with many different types of drugs","pills are more addictive causing drug takers to take more pills", "pills of a much higher dosage are being found on the market", "contaminated drugs that are sold at music festivals"],
                           ["decriminalize drugs and regulate it","reduce police presence at concerts ", "provide drug quality checking services at concert entrances", "increase surveillance and drug detection capabilities"],
                           ["he has conducted experiments at music festivals and seen good results","other european nations have instituted this and it worked", "it is a speculation based on Caldiocott's experience", "there is a broad support for the policy in parliament already"]],
                          [["the audience can help solve it","that the podcast is based on a true story", "events are happening at real time", "the case is still open"],
                           ["people get more engaged with it over time","listeners become informants, townspeople become characters", "it creates suspense that listeners love", "the podcast can drastically change from one week to the other"],
                           ["immoral","invasive", "detrimental", "helpful to solving the case"],
                           ["detectives get more tips from listeners","listeners have a distraction from their everyday lives", "listeners learn lessons from each podcast", "people bond over listening to the same podcast"],
                           ["shared by many others","the biggest concern for true crime producers", "unique to his personality", "overthinking the issue"],
                           ["listeners can provide valuable information that help solve open cases","the public wants and needs to know more about it", "it gives the victim's family a sense of vengeance", "it is well within the boundaries of the law"]],
                          [["he becomes motivated to do more research","he wants to help Edward Snowden", "he stops worrying about it", "he becomes paranoid"],
                           ["the problems are too abstract and far away","he realizes that the notion of privacy is gone", "it too tiring to keep worrying about it ", "he feels powerless to do anything"],
                           ["leaks about the white house's","political abuse of", "sabotage of", "fear of"],
                           ["it impeached the president","it allowed the white house to increase its spying powers", "it enacted reform measures", "it discussed them in a committee, but eventually did nothing"],
                           ["remotely involved in a criminal activity","a paranoid person or not", "truly an American", "someone who values free speech"],
                           ["they limited online communications with sources to a minimum","they cut back what they talked about on social media ", "they tried to avoid certain topics via phone or email", "they steered clear of issues in their writing"]],
                          ];
var allArticleAnswers = [
                        [2,3,1,0,1,3], //c|a|b|a|b|d -> c|d|b|a|b|d
                        [1,2,1,0,2,2], //b|c|b|a|c|c
                        [2,2,0,0,1,3], //c|c|a|a|b|d
                        [3,2,0,2,0,1], //d|c|a|c|a|b
                        [1,3,3,2,2,3], //b|d|d|c|c|d
                        [0,0,3,2,2,1], //a|a|d|c|c|b
                        [0,1,0,2,3,1], //a|b|a|c|d|b
                        [2,0,1,2,3,0]  //c|a|b|c|d|a
                        ]
allArticleQuestionTypes = [
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"], 
                          ["skim","read","skim","read","skim","read"] 
                          ]



var orderOfAnswers = [0,1,2,3];
var partId; 




// supportive function that shuffles an array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* TO DO: add a function for updating information, so that as questions are added, these get saved too */  
function updateQuestionHeader() {
  var questionHeader = document.getElementById("questionHeaderDiv");
  var currentSpan = questionHeader.querySelector('.questionId');
  var totalSpan = questionHeader.querySelector('.totalQuestions');
  currentSpan.innerHTML = (currentQuestionID+1) + "";
  
  totalSpan.innerHTML = allArticleQuestions[currentArticleID].length;
}


function updateQuestionBody() {
  var questionBody = document.getElementById("questionDiv");
  var currentQuestion = questionBody.querySelector('.questionBody');
  currentQuestion.innerHTML = allArticleQuestions[currentArticleID][currentQuestionID];
}

function updateResponses() {
  var questionBody = document.getElementById("answersDiv");
  var ans1 = questionBody.querySelector('.spanAns1');
  var ans2 = questionBody.querySelector('.spanAns2');
  var ans3 = questionBody.querySelector('.spanAns3');
  var ans4 = questionBody.querySelector('.spanAns4');
  orderOfAnswers = shuffle(orderOfAnswers)
  

  ans1.innerHTML = allArticleResponses[currentArticleID][currentQuestionID][orderOfAnswers[0]];
  ans2.innerHTML = allArticleResponses[currentArticleID][currentQuestionID][orderOfAnswers[1]];
  ans3.innerHTML = allArticleResponses[currentArticleID][currentQuestionID][orderOfAnswers[2]];
  ans4.innerHTML = allArticleResponses[currentArticleID][currentQuestionID][orderOfAnswers[3]];
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
        	"from a content script:" + sender.tab.url :
          "from the extension");
		
    if (request.isQuestionID == "yes") {
      console.log("ID: " + request.id)
      currentArticleID = request.id;
      updateQuestionHeader();
      updateQuestionBody();
      updateResponses();
      }  			
  });



function detectAnswer() {
  var userAnsString = $('input[name=answers]:checked').val();
  var userAns = parseInt(userAnsString[userAnsString.length - 1]);
  var actualIdx = -1;
  var actualContent = "";
  if (userAns != 4){
    actualIdx = orderOfAnswers[userAns];
    actualContent = allArticleResponses[currentArticleID][currentQuestionID][actualIdx];
  } else {
    actualIdx = 4;
    actualContent = "I don't know";
  }
  console.log("order of answers: " + orderOfAnswers);
  console.log("user selected option is: " + userAns);
  console.log("actual option is: " + actualIdx);
  console.log("actual content is: " + actualContent)
  return [actualIdx, actualContent];
}

function validateAnswer(selectedOption) {
  var ans = false;
  var correctAns = allArticleAnswers[currentArticleID][currentQuestionID];
  console.log("selected option: " + selectedOption);
  console.log("correct answer: " + correctAns)
  if (correctAns == selectedOption){
    console.log("coorect answer is: " + allArticleResponses[currentArticleID][currentQuestionID][selectedOption])
    ans = true;
  }
  return [ans, correctAns];
}

function postAnswer() {
  var currentAnswer = -1;
  var currentResult = false;
  var ansArr = [];
  var validateAnsArr = [];
  ansArr = detectAnswer();
  currentAnswer = ansArr[0];
  currentAnswerContent = ansArr[1];
  validateAnsArr = validateAnswer(currentAnswer);
  currentResult = validateAnsArr[0];
  correctAns = validateAnsArr[1];
  correctAnsContent = allArticleResponses[currentArticleID][currentQuestionID][correctAns];
  console.log("correct ans contrent " + correctAnsContent);
  console.log("selected index is: " + currentAnswer);
  console.log("validation result is: " + currentResult);

  question = allArticleQuestions[currentArticleID][currentQuestionID];
  qtype = allArticleQuestionTypes[currentArticleID][currentQuestionID];
  console.log("question type is : " + qtype);
  chrome.runtime.sendMessage({msg: "saveQuestion", currentArticleID:currentArticleID, currentQuestionID :currentQuestionID, answerChosen : currentAnswer, question: question, result: currentResult, currentAnswerContent : currentAnswerContent, correctAns: correctAns, orderOfAnswers: orderOfAnswers, qType: qtype, correctAnsContent : correctAnsContent}, function() { });
}

function nextBtnClick() {
  console.log("next button pressed");
  console.log("current article ID: " + currentArticleID);
  if ($('input[name=answers]:checked').length > 0) {
    postAnswer();
    $('input[name=answers]').attr('checked',false);
    currentQuestionID += 1;
    if (currentQuestionID < allArticleQuestions[currentArticleID].length) {
      updateQuestionHeader();
      updateQuestionBody();
      updateResponses();
    }
    else {
      chrome.runtime.sendMessage({msg: "finishQuestions"}, function() { });
    }
  }
  else {
    console.log("no answer selected!")
    alert("please be sure to enter an answer, if you do not know the answer please select the last option.");
  }
}



function createButton() {
      var styles = 'position: fixed; z-index: 1; top: 20px; left: 20px;';
    $('<div class="reading_experiment" id="experiment_header"></div>').insertBefore(".logo");
    $('#experiment_header').append('<input type="button" id="first_button" value="TEST">');
    $('#first_button').on('click', buttonClick); 
}

function showQuestionBtnClick(){
  console.log("clicked show questions")
  $('#question').show();
  $('#questionsInstructionsDiv').hide();
}

$(document).ready(function(){
  $('#buttonDiv').on('click', 'input', function() { nextBtnClick() });
  $('#ShowQuestionButtonDiv').on('click', 'input', function() { showQuestionBtnClick() });
  $(document).keypress(function(e){
      if(e.keyCode==13) {
        if ($('#ShowQuestionButtonDiv').is(":visible")) {
          showQuestionBtnClick();
        } else {
          nextBtnClick();
        }
      }
    });
  chrome.runtime.sendMessage({msg: "getNextQuestionID"}, function() { });
  $('#ans0').focus();
});