
//**** THE QUESTIONS ARTICLE REF IS CORRECT, THE URL SAVING TO THE ARTICLE IS NOT"

var exp_articles = [ {"url": "http://munchies.vice.com/articles/new-research-says-vegetarian-diets-could-actually-be-worse-for-the-planet",
                        "wordCount": 793,
                        "difficulty": 1.1,
                        "condition": 1,
                        "location": 0 
                      },
                      {"url": "http://www.vice.com/read/drinking-is-really-bad-for-kids-turns-out-303",
                        "wordCount": 588,
                        "difficulty": 1,
                        "condition": 0,
                        "location": 1 
                      },
                      {"url": "http://www.vice.com/read/a-study-has-named-new-zealand-the-most-ignorant-developed-country-in-the-world",
                        "wordCount": 641,
                        "difficulty": 1.1,
                        "condition": 0,
                        "location": 2 
                      },
                      {"url": "http://motherboard.vice.com/read/scientists-are-genetically-modifying-their-way-to-new-types-of-beer",
                        "wordCount": 621,
                        "difficulty": 1.1,
                        "condition": 1,
                        "location": 3 
                      },
                      {"url": "http://www.vice.com/read/dr-laza-lazarevic-psychiatric-clinic-balkans-876",
                        "wordCount": 812,
                        "difficulty": 1,
                        "condition": 0,
                        "location": 4 
                      },
                      {"url": "http://www.vice.com/read/why-are-people-still-dying-at-australian-music-festivals",
                        "wordCount": 984,
                        "difficulty": 1,
                        "condition": 1,
                        "location": 5
                      },
                      {"url": "http://www.vice.com/read/what-does-our-obsession-with-true-crime-podcasts-say-about-us-814",
                        "wordCount": 1321,
                        "difficulty": 1,
                        "condition": 0,
                        "location": 6
                      },
                      {"url": "http://www.vice.com/read/how-scared-should-i-be-of-nsa-surveillance-492",
                        "wordCount": 1500,
                        "difficulty": 1,
                        "condition": 1,
                        "location": 7 
                      }
                    ];

var articleWordCounts = [641, 621, 812, 984, 1321, 1500];
var articleDiffs = [1.1, 1.1, 1, 1, 1, 1];
var firstQualWordCount = 793;
var secondQualWordCount = 588;
var secondQualDiff = 1;
var orderOfAppearance = [0, 1, 2, 3, 4, 5];
// 0 - skim; 1 - in-depth
var Conditions = [0, 1, 0, 1, 0, 1];
var qualPhase = 0;
var qualDuration = -1;
var currentArticleIndex = 0;
var participantWordPerSec = 0;
Firebase.enableLogging(true);
// var myFirebaseRef = new Firebase("https://longreads.firebaseio.com/");
var myFirebaseRef =  new Firebase("https://longreads2.firebaseio.com/");
// var myFirebaseRef3= new Firebase("https://longreads.firebaseio.com/participant_data");
// var myFirebaseRef3= new Firebase("https://longreads.firebaseio.com/mturk__data");
// var myFirebaseRef3= new Firebase("https://longreads.firebaseio.com/mturk__data_contigency");
var myFirebaseRef3 = new Firebase("https://longreads2.firebaseio.com/");

var pInfo = "saving data from background page";
var lastQualSent = false;
var uid = "";
var part_Id;
var storageFineTrackingIDSet = false;
var storageRenderTrackingSet = false;
var renderDisplayIndex = -1;
var fineTrackingDisplayIndex = -1;
var firstQualMinDuration = 60; // seconds
var userInfo
var reading_speed;
var totalQualCorrect;
var adBlockCond;
var tabId;
var qualified = false;


// Function that closes currently active tab; used when timer runs to 0 on article pages
function closeTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.remove(tabs[0].id, function() {});
  });
}

function calcTime() {
  var duration = -1;
  if (currentArticleIndex == 1){
    duration = (secondQualWordCount * secondQualDiff) / (participantWordPerSec * 3);
  }
  else {
    currentCondFactor = 1;
    if (exp_articles[currentArticleIndex]["condition"] == 0) {
      currentCondFactor = 2.5;
    }
    duration = (exp_articles[currentArticleIndex]["wordCount"] * exp_articles[currentArticleIndex]["difficulty"]) / (participantWordPerSec * currentCondFactor);
    console.log("duartion in calcTime is " + duration);
  }
  return duration;
}

// Function that sends a duration for an article to be shown
function sendTime(senderId) {
  
  duration = calcTime();
  Minutes = Math.floor(duration / 60);
  Seconds = duration % 60;
  // chrome.tabs.query returns all the tabs that are currently alive, having the filters
  // active: true and currentWindow: true limit the results to the active tab of the current window
  // the results are always structured as an array, so the "tabs" object at position 0 ([0]) 
  // is the current active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Still missing qualPhase++ mechanism
    // chrome.tabs.sendMessage(tabs[0].id, {isShowDuration: "yes", minutes: Minutes, seconds: Seconds}, function(response) { });
    // chrome.tabs.sendMessage(tabId, {isShowDuration: "yes", minutes: Minutes, seconds: Seconds}, function(response) { });
    
    // replacing tabId with senderId because this specific case does require sending a message to possible non-experiment 
    // tabs (in case of duplicated article tabs).
    chrome.tabs.sendMessage(senderId, {isShowDuration: "yes", minutes: Minutes, seconds: Seconds}, function(response) { });

    
  });
}

// Function that sends the next experimental URL
function sendNextURL() {
  console.log("Current article index in SendNextURL is  " + currentArticleIndex);
  nextURL = "";
  if (currentArticleIndex == 0) {
    nextURL = exp_articles[0]["url"];
  }
  else if (currentArticleIndex == 1) {
    nextURL = exp_articles[1]["url"];
  }
  else if (currentArticleIndex == 2){
    
    nextURL = exp_articles[currentArticleIndex]["url"];
  }
  else {
    nextURL = exp_articles[currentArticleIndex]["url"];
  }
  if (exp_articles[currentArticleIndex]["condition"] == 0){
    var cond = "Skim";
  }
  else {
    var cond = "read";
  }
  FBPostArticleLoaded(exp_articles[currentArticleIndex]["location"], cond)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    // chrome.tabs.update(tabs[0].id, {url: nextURL});
    chrome.tabs.update(tabId, {url: nextURL});
  });
}

function startQuestionsPage() {
  saveStateFinishedReading();
  nextURL = "questions.html";
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    // chrome.tabs.update(tabs[0].id, {url: nextURL});
    chrome.tabs.update(tabId, {url: nextURL});
  });
}

function sendQualNum(senderId) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (currentArticleIndex == 0) {
      // chrome.tabs.sendMessage(tabs[0].id, {isFirstQual: "yes", firstQualDuration: firstQualMinDuration, blockAds: adBlockCond}, function(response) { });
      chrome.tabs.sendMessage(tabId, {isFirstQual: "yes", firstQualDuration: firstQualMinDuration, blockAds: adBlockCond}, function(response) { });
    }
    else {
      if (exp_articles[currentArticleIndex]["condition"] == 0) {
        Cond = "skim";
        console.log("currentArticleIndex ins sendQualNum is: " + currentArticleIndex + "condition is: " + Cond);
      } else {
        Cond = "read";
        console.log("currentArticleIndex ins sendQualNum is: " + currentArticleIndex + "Condition is: " + Cond);
      }
      console.log("sending is First Qual = no")
      // chrome.tabs.sendMessage(tabs[0].id, {isFirstQual: "no", cond:Cond, blockAds: adBlockCond}, function(response) { });
      // chrome.tabs.sendMessage(tabId, {isFirstQual: "no", cond:Cond, blockAds: adBlockCond}, function(response) { });

      chrome.tabs.sendMessage(senderId, {isFirstQual: "no", cond:Cond, blockAds: adBlockCond}, function(response) { });
    }
    
  });
}

// supportive function that shuffles an array
function shuffle(array) {
  array1 = array.splice(0,2);
  // console.log("array1 is: " + JSON.stringify(array1));
  // console.log("array is: " + JSON.stringify(array));
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
  arrayNew = array1.concat(array);
  // console.log("arrayNew is: " + JSON.stringify(arrayNew));
  // console.log("arrayNew.length is " + arrayNew.length);

  return arrayNew;
}

function randomizeConditions() {
  var conditionSelector = 0;
  conditionSelector = Math.floor(Math.random()*2);
  if (conditionSelector == 1) {
    Conditions[0] = 1;
    Conditions[1] = 0;
  }
  conditionSelector = Math.floor(Math.random()*2);
  if (conditionSelector == 1) {
    Conditions[2] = 1;
    Conditions[3] = 0;
  }
  conditionSelector = Math.floor(Math.random()*2);
  if (conditionSelector == 1) {
    Conditions[4] = 1;
    Conditions[5] = 0;
  }
}

// A function that initializes the experiment variables, randomizes the order of 
// articles and determines the order of experimental conditions
function startExperiment() {
  randomizeConditions();
  // for (i = 0; i < randomizeConditions.length; i++){
  for (i = 0; i < 6; i++) {
    // exp_articles[i+2]["condition"] = Conditions[i];
    exp_articles[i + 2]["condition"] = Conditions[i];
    // console.log("added condition");
  }
  exp_articles = shuffle(exp_articles);

  // Determine whether or not to block ads on pages
  if (Math.random() < 0.5){
    adBlockCond = true;
  } else {
    adBlockCond = false;
  }
  console.log("will be blocking ads: " + adBlockCond);
  // console.log( "exp_articles is " + JSON.stringify(exp_articles));
  // get user ID from cookie and save info to firebase
  chrome.cookies.get(
    {
      "url": "http://readingexp.vice.com", 
      "name": "mm_uid"
    }, 
    function(cookie) {
      // Handle 
      if (cookie) {
        console.log("retrieved cookie uid " + cookie.value);
        uid = cookie.value;
      } else {
        uid = generateUUID();
        setCookie('mm_uid', uid, 60);
        console.log("creating cookie uid " + uid);
      }

      userInfo = {agent: navigator.userAgent, 
                  screen_height: window.screen.height, screen_width: window.screen.width, 
                  langs: navigator.languages, 
                  exp_start_t: Math.floor(Date.now())};

      console.log("uid before queryFBForState is: " + uid);
      queryFBForState(uid);

      
    }
  );
}

function sendNextQuestionID() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    
    if (currentArticleIndex == 2) {
        lastQualSent = true
        // console.log("currentArticleIndex in send next Question id is: " + exp_articles[currentArticleIndex]["location"]);
      }
    console.log("in SendNextQuestionID, currentArticleIndex is: " + currentArticleIndex + "and the location is: " + exp_articles[currentArticleIndex]["location"]);
    // chrome.tabs.sendMessage(tabs[0].id, {isQuestionID: "yes", id: exp_articles[currentArticleIndex]["location"]}, function(response) { });
    chrome.tabs.sendMessage(tabId, {isQuestionID: "yes", id: exp_articles[currentArticleIndex]["location"]}, function(response) { });
  });
}

// Adding a listener to the browser action button (by omnibox) that opens index.html
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    // var clearToProceed = true;
    // clearToProceed = checkOpenTabs();
    // console.log("clear to proceed: " + clearToProceed);
    // if (clearToProceed) {
    console.log("extension id: " + chrome.runtime.id);
    article_urls = [
                  "http://munchies.vice.com/articles/new-research-says-vegetarian-diets-could-actually-be-worse-for-the-planet",
                  "http://motherboard.vice.com/read/scientists-are-genetically-modifying-their-way-to-new-types-of-beer",
                  "http://www.vice.com/read/a-study-has-named-new-zealand-the-most-ignorant-developed-country-in-the-world",
                  "http://www.vice.com/read/drinking-is-really-bad-for-kids-turns-out-303",
                  "http://www.vice.com/read/what-does-our-obsession-with-true-crime-podcasts-say-about-us-814",
                  "http://www.vice.com/read/why-are-people-still-dying-at-australian-music-festivals",
                  "http://www.vice.com/read/dr-laza-lazarevic-psychiatric-clinic-balkans-876",
                  "http://www.vice.com/read/how-scared-should-i-be-of-nsa-surveillance-492"
                  ];
    var ans = true;
    chrome.tabs.getAllInWindow(null, function(tabs) { 
      console.log("amount of found tabs: " + tabs.length);
      for (var i = 0; i < tabs.length; i++) {
        for (var j = 0; j<article_urls.length; j++){
          if (tabs[i].url == article_urls[j]) {
            ans = false;
            console.log("found bad url: " + tabs[i].url);
          }
        }
        if (tabs[i].url.includes(chrome.runtime.id) && !(tabs[i].url.includes("chrome.google.com"))) {
          ans = false;
          console.log("found extension id in url: " + chrome.runtime.id);
        }
      }
      if (ans) {
        startExperiment();
        var newURL = "index.html";
        chrome.tabs.create({ url: newURL });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {tabId = tabs[0].id; console.log(tabId); });
      } else {
        alert("Existing experiment tab detected.\n\nPlease use existing tab.");
      }


    });




      
    // } else {
    //   alert("We have found that you already have an experiment tab open.\nPlease use that tab.");
    // }
    
});

function checkCorrectAnswers() {
  console.log("checking for minimal correct asnwers");

  var userRef = myFirebaseRef3.child(uid);
  try {
    userRef.child("Articles").once("value", function(snapshot) {
      var Articles = snapshot.val();
      var numCorrect = 0;
      var numWrong = 0;
      var hasChartBeatPings = false;
      for (i = 0; i < 2; i++){
        // Check enough correct answers
        questions_data = Articles[i]["Questions"];
        for (j = 0; j < questions_data.length; j++){
          if (questions_data[j]["answer"] === questions_data[j]["correct answer"]){
            numCorrect++;
          }
          else{
            numWrong++;
          }
        }
        if (Articles[i]["Chartbeat"] != null) {
          console.log("XXX Found chartbeat pings XXX");
          hasChartBeatPings = true;
        }
      }

      console.log("num qual correct is " + numCorrect + "numWrong is " + numWrong);
      totalQualCorrect = numCorrect;
      try {
        userRef.child("Reading Speed (words per sec)").once("value", function(snapshot) {
          participantWordPerSec = parseFloat(snapshot.val());
          console.log("words per sec queried from Fb: " + JSON.stringify(participantWordPerSec));
          reading_speed = participantWordPerSec;
          userRef.child("state").update({
              "did_finish_exp" : "no",
              "disqualified" : "no"
            });
          // if (totalQualCorrect > 3 && reading_speed > 1.6 && hasChartBeatPings == true){
          //   userRef.child("state").update({
          //     "did_finish_exp" : "no",
          //     "disqualified" : "no"
          //   });
            qualified = true;
            nextURL = "instructions.html";
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
                chrome.tabs.update(tabId, {url: nextURL});
            });
          // }else{
          //   console.log("participant NOT viable");
          //   userRef.child("state").update({
          //     "did_finish_exp" : "yes",
          //     "disqualified" : "yes"
          //   });
          //   sendFinalPage();


            //sendFinalPage();
          // }
          // nextURL = "qual_break.html";
          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
          //     chrome.tabs.update(tabId, {url: nextURL});
          // });

        });
      }
      catch(error) {  
          console.log("there was an error in get reading speed");
      }
    });
  }
  catch(error){
    console.log("there was an error in FBCalcTotalNumQualCorrect ");
  }
}

function sendCondition() {
  currentIdx = exp_articles[currentArticleIndex]["condition"];

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (currentArticleIndex === 0) {
      ("currentArticleIndex in sendConidtion is: " + currentArticleIndex);
      // chrome.tabs.sendMessage(tabs[0].id, {cond: "qual"}, function(response) { });
      chrome.tabs.sendMessage(tabId, {cond: "qual"}, function(response) { });

    }
    else if (currentArticleIndex === 1) {
      ("currentArticleIndex in sendConidtion is: " + currentArticleIndex);
      duration = calcTime();
      Minutes = Math.floor(duration / 60);
      Seconds = duration % 60;
      // chrome.tabs.sendMessage(tabs[0].id, {cond: "skim", minutes: Minutes, seconds: Seconds}, function(response) { });
      chrome.tabs.sendMessage(tabId, {cond: "skim", minutes: Minutes, seconds: Seconds}, function(response) { });

    }
    else {
      duration = calcTime();
      Minutes = Math.floor(duration / 60);
      Seconds = duration % 60;
      if (exp_articles[currentArticleIndex]["condition"] === 0) {
        // chrome.tabs.sendMessage(tabs[0].id, {cond: "skim", minutes: Minutes, seconds: Seconds}, function(response) { });
        chrome.tabs.sendMessage(tabId, {cond: "skim", minutes: Minutes, seconds: Seconds}, function(response) { });

      }
      else {
        // chrome.tabs.sendMessage(tabs[0].id, {cond: "read", minutes: Minutes, seconds: Seconds}, function(response) { });
        chrome.tabs.sendMessage(tabId, {cond: "read", minutes: Minutes, seconds: Seconds}, function(response) { });
      }
    }
  });
}



function userQuestions(readingTechnique, assist_tech_used){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    nextURL = "final.html"
    // chrome.tabs.update(tabs[0].id, {url: nextURL});
    chrome.tabs.update(tabId, {url: nextURL});
  });
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("Demographic-Questions").update({
    "Skimming Technique" : readingTechnique,
    "Assistive_tech_used" : assist_tech_used
  });
  saveDidFinishState();

}

function FBAppendDemographQuest(age, gender, education, disability, diagnosis, assist_tech){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("Begin-Demographic-Questions").update({
    "Age" : age,
    "Gender" : gender,
    "Education": education,
    "Disability" : disability,
    "Diagnosis" : diagnosis,
    "Assitive_technology" : assist_tech
  });

}

function sendFinalPage(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    nextURL = "final.html"
    // chrome.tabs.update(tabs[0].id, {url: nextURL});
    chrome.tabs.update(tabId, {url: nextURL});
  });
}

function finishQuestions(){
  currentArticleIndex = currentArticleIndex + 1;
  saveQuestionStatetoFB();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
      var nextURL = "";
      if (currentArticleIndex < 8) {
        // console.log("qualPhase: " + qualPhase);
        console.log("article ID: " + currentArticleIndex);
        if (currentArticleIndex == 2 ) {
          //unsure if this should be 2 or 3
          checkCorrectAnswers();

        } else {
          nextURL = "instructions.html";
        }
      } else {
        console.log("finished")
        nextURL = "userQuestions.html"
      }
      if (nextURL != "") {
        // chrome.tabs.update(tabs[0].id, {url: nextURL});
        chrome.tabs.update(tabId, {url: nextURL});
      }
;
    });
}

function restoreArticleInstructions(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
      var nextURL = "";
      if (currentArticleIndex < 8) {
        // console.log("qualPhase: " + qualPhase);
        console.log("article ID: " + currentArticleIndex);
        if (currentArticleIndex == 2 ) {
          //unsure if this should be 2 or 3
          checkCorrectAnswers();

        } else {
          nextURL = "instructions.html";
        }
      } else {
        console.log("finished")
        nextURL = "userQuestions.html"
      }
      if (nextURL != "") {
        // chrome.tabs.update(tabs[0].id, {url: nextURL});
        chrome.tabs.update(tabId, {url: nextURL});
      }
;
    });
}

function getQualData() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    chrome.tabs.sendMessage(tabId, {isQualified: qualified, secret: "start"}, function(response) { });
  });
}


// Adding a listener for messages from content pages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("sender: " + sender);
      console.log("sender id: " + sender.tab.id);
      if (sender.tab.id == tabId) {

        if (request.msg == "get_qual")
        {
          console.log("getting qual data");
          getQualData();
        }

        if (request.msg == "disqualified_finish")
        {
          sendFinalPage();
        }

        if (request.msg == "qualified_with_secret")
        {
          nextURL = "instructions.html";
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
              chrome.tabs.update(tabId, {url: nextURL});
          });
        }

        if (request.msg == "get_demographics_page")
        {
          console.log("tab ID: " + tabId);
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
            // chrome.tabs.update(tabs[0].id, {url: "demograph.html"});
            chrome.tabs.update(tabId, {url: "demograph.html"});
          });
        }

        
        if (request.msg == "adBlockDetect")
        {
          console.log("adblocker detecetd");
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
              //chrome.tabs.update(tabs[0].id, {url: "instructions.html"});
              chrome.tabs.update(tabId, {url: "instructions.html"});
            });
        }
        if (request.msg == "startDebugMode")
        {
          console.log("DEBUG MODE");
          myFirebaseRef3= new Firebase("https://longreads.firebaseio.com/debug");
          //TBD
        }

        
        // if a request to close the main tab calls the close tab function
        // Should be verified as depracated and deleted.
        if (request.msg == "closeTab")
        {
        		//closeTab();
        }
        if (request.msg == "getNextURL")
        {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
              // chrome.tabs.update(tabs[0].id, {url: "instructions.html"});
              chrome.tabs.update(tabId, {url: "instructions.html"});
            });
        }
        if (request.msg == "startQuestionsPage")
        {
            sendNextURL2();

        }
        
        if (request.msg == "getNextQuestionID"){
          sendNextQuestionID();
          console.log("clear")
          storageRenderTrackingSet = false;
          storageFineTrackingIDSet = false;
        }



        if (request.msg == "saveQuestion"){
          currArticleID = request.currentArticleID;
          currQuestionID = request.currentQuestionID;
          question = request.question;
          answer = request.answerChosen;
          result = request.result;
          currentAnswerContent = request.currentAnswerContent;
          correctAns = request.correctAns;
          orderOfAnswers= request.orderOfAnswers;
          qType = request.qType;
          correctAnsContent =request.correctAnsContent;

          FBupdateUserData(uid, currArticleID, currQuestionID, question, answer, result, currentAnswerContent, correctAns, orderOfAnswers, qType, correctAnsContent);

        }
        if (request.msg == "finishedInstructions"){
          sendNextURL();
          saveStateToFB();
        }
        if (request.msg == "expButtonPress"){
          startQuestionsPage();
        }
        if (request.msg == "qualDuration") {
          qualDuration = request.duration;
          participantWordPerSec = firstQualWordCount / qualDuration;
          saveExperimentStarted();
          FBappendQualTime(qualDuration, participantWordPerSec);
          // experiment
        }
        if (request.msg == "expDuration"){
          durationIndex = -1;
          if (currentArticleIndex< 2) {
            durationIndex = currentArticleIndex;
          } else {
            durationIndex = (exp_articles[currentArticleIndex]["location"])
          }
          console.log("durationIndex is: " + durationIndex);
          FBappendExpTime(request.duration, durationIndex);
        }
        if (request.msg == "postFineTrackingData"){
          if (!storageFineTrackingIDSet) {
            if (request.url.substr(request.url.length - 15) == exp_articles[0]["url"].substr(exp_articles[0]["url"].length - 15)) {
              fineTrackingDisplayIndex = 0;
            } 
            else if (request.url.substr(request.url.length - 15) == exp_articles[1]["url"].substr(exp_articles[1]["url"].length - 15)) {
              fineTrackingDisplayIndex = 1;
            } 
            // else {
            //   fineTrackingDisplayIndex = ((exp_articles[currentArticleIndex]["location"]));
            // }
            else if (request.url.substr(request.url.length - 15) == exp_articles[2]["url"].substr(exp_articles[2]["url"].length - 15)) {
              fineTrackingDisplayIndex = exp_articles[2]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[3]["url"].substr(exp_articles[3]["url"].length - 15)) {
              fineTrackingDisplayIndex = exp_articles[3]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[4]["url"].substr(exp_articles[4]["url"].length - 15)) {
              fineTrackingDisplayIndex = exp_articles[4]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[5]["url"].substr(exp_articles[5]["url"].length - 15)) {
              fineTrackingDisplayIndex = exp_articles[5]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[6]["url"].substr(exp_articles[6]["url"].length - 15)) {
              fineTrackingDisplayIndex = exp_articles[6]["location"];
            }
            else {
              fineTrackingDisplayIndex = exp_articles[7]["location"];
            }
            storageFineTrackingIDSet = true;
          }
          FBpostFineTrackingData(request.data, fineTrackingDisplayIndex)
        }
        if (request.msg == "postRenderedPageElements") {
          if (!storageRenderTrackingSet) {
            if (request.url.substr(request.url.length - 15) == exp_articles[0]["url"].substr(exp_articles[0]["url"].length - 15)) {
              renderDisplayIndex = 0;
            } 
            else if (request.url.substr(request.url.length - 15) == exp_articles[1]["url"].substr(exp_articles[1]["url"].length - 15)) {
              renderDisplayIndex = 1;
            } 
            // else {
            //   renderDisplayIndex = (exp_articles[currentArticleIndex]["location"]) ;
            // }
            else if (request.url.substr(request.url.length - 15) == exp_articles[2]["url"].substr(exp_articles[2]["url"].length - 15)) {
              renderDisplayIndex = exp_articles[2]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[3]["url"].substr(exp_articles[3]["url"].length - 15)) {
              renderDisplayIndex = exp_articles[3]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[4]["url"].substr(exp_articles[4]["url"].length - 15)) {
              renderDisplayIndex = exp_articles[4]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[5]["url"].substr(exp_articles[5]["url"].length - 15)) {
              renderDisplayIndex = exp_articles[5]["location"];
            }
            else if (request.url.substr(request.url.length - 15) == exp_articles[6]["url"].substr(exp_articles[6]["url"].length - 15)) {
              renderDisplayIndex = exp_articles[6]["location"];
            }
            else {
              renderDisplayIndex = exp_articles[7]["location"];
            }
            storageRenderTrackingSet = true;
          }
          FBpostRenderedPageElements(request.data, renderDisplayIndex);
        }
        if (request.msg == "instructionsLoaded"){
          sendCondition();
        }
        if (request.msg == "finishQuestions"){
            
          currentArticleIndex = currentArticleIndex + 1;
          saveQuestionStatetoFB();
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
              var nextURL = "";
              if (currentArticleIndex < 8) {
                console.log("article ID: " + currentArticleIndex);
                if (currentArticleIndex == 2 ) {
                  //unsure if this should be 2 or 3
                    checkCorrectAnswers();
                   
                } 
                else {
                  nextURL = "instructions.html";
                }
              }
              else {
                console.log("finished")
                nextURL = "userQuestions.html"
              }
               if (nextURL != ""){
                // chrome.tabs.update(tabs[0].id, {url: nextURL});
                chrome.tabs.update(tabId, {url: nextURL});  
              } 
            });
        }
    
        if (request.msg == "experimentOver") {
          closeTab();
        }
        if (request.msg == "userQuestions") {
          qualDuration = request.duration;

          var readingTechnique = request.readingTechnique;
          var assist_tech_used = request.assist_tech_used;
          userQuestions(readingTechnique, assist_tech_used);
        }
        if (request.msg == "save_demograph_quest") {
          var age = request.age;
          var gender = request.gender;
          var education = request.education;
          var disability = request.disability;
          var diagnosis = request.diagnosis;
          var assist_tech = request.assist_tech;
          FBAppendDemographQuest(age, gender, education, disability, diagnosis, assist_tech)
        }

        if (request.msg == "get_user_id") {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
            // chrome.tabs.sendMessage(tabs[0].id, {isUserID: "yes", user_id: uid}, function(response) { });
            var userRef = myFirebaseRef3.child(uid).child("state").once("value", function(snapshot) {
              console.log(snapshot.val());
              results = snapshot.val();
              if (results["disqualified"] == "no") {
                chrome.tabs.sendMessage(tabId, {isUserID: "yes", user_id: uid}, function(response) { });                
              } else {
                chrome.tabs.sendMessage(tabId, {isUserID: "yes", user_id: "378bab0"}, function(response) { });
              }

            });
          });
        }
      }

      //PLACEHOLDER 
      if (request.msg == "getQualNumber")
      {
          sendQualNum(sender.tab.id);
      }
      if (request.msg == "timerEnd"){
        if (sender.tab.id == tabId) {
          durationIndex = -1;
          if (currentArticleIndex < 2) {
            durationIndex = currentArticleIndex;
          } else {
            durationIndex = (exp_articles[currentArticleIndex]["location"])
          }
          FBappendExpTime(request.duration, durationIndex);
          startQuestionsPage();
        } else {
          chrome.tabs.remove(sender.tab.id, function() {});
        }  
      }
      if (request.msg == "getCurrentDuration")
      {
        sendTime(sender.tab.id);
      }

    });

// capturing pings to Chartbeat
chrome.webRequest.onBeforeRequest.addListener(function(req) {
    console.log("FOUND HTTP REQ ts: " + req.timeStamp + " url: " + req.url);
    console.log ("current article index in capturing pints to chartbeat is: " + currentArticleIndex);
    var displayIndex = -1;
    if (currentArticleIndex == 0 ){
      displayIndex = 0;
    } else if (currentArticleIndex == 1) {
      displayIndex = 1;
    } else {
      displayIndex = (exp_articles[currentArticleIndex]["location"]) ;
    }
    FBappendChartBeatRequest("ChartBeat", req.url, req.timeStamp, displayIndex);
  }, {
    urls: ["http://ping.chartbeat.net/ping?*"],
    types: ["image"]
  });


// Cookie handling and UUID generation
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    chrome.cookies.set(
      {
        "url": "http://readingexp.vice.com", 
        "name": cname, 
        "value": cvalue, 
        "expirationDate": (new Date().getTime()/1000) + exdays*24*60*60},
      function(cookie) {
        if (!cookie) {
          console.log("Could not save cookie!!");
          console.log(chrome.runtime.lastError);
        }
      });
}



function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// *******************************
// ****** FIREBASE HANDLING ******
// *******************************


function savePart_Id(part_Id){
  console.log ("saving participant_Id as: " + part_Id);
  myFirebaseRef3.child(part_Id).set({
    participant_Id : part_Id
  });

}


function FBappendUserInfo(userInfo){
  // console.log("Saving User info: " + userInfo);
  myFirebaseRef3.child(uid).update({
    "User Info": userInfo
  });
}

function FBappendAdBlockCond(adBlockCond){
  console.log("Saving Ad Blocker Experiment Condition: " + adBlockCond);
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
    "AdBlock_Condition": adBlockCond
  });
}

function FBappendChartBeatRequest(ChartBeat, reqUrl, reqTimeStamp, articleID) {

  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
  var articleIndexRef = articleRef.child(articleID);
    
  articleIndexRef.child("Chartbeat").push({  
       "Time Stampe": reqTimeStamp, 
       "Request URL" : reqUrl
  });
}

function FBappendDisplayOrder(articleDisplayOrder) {

  myFirebaseRef3.child(uid).update({
     "Article Order": articleDisplayOrder,
     "Articles": "filler data"
   });

  // console.log("Storage Buffer: Received article display order: " + articleDisplayOrder);
}

function FBappendConditionOrder(conditionOrder) {
  myFirebaseRef3.child(uid).update({
     "Condition Order": conditionOrder
   });

  // console.log("Storage Buffer: Received condition order: " + conditionOrder);
}

function FBappendQualTime(qualTime, wordsPerSec) {
  myFirebaseRef3.child(uid).update({
       "Qualification Time": qualTime,
       "Reading Speed (words per sec)" :  wordsPerSec
  });
  console.log("Storage Buffer: Received qualification duration: " + qualTime + " participant words per sec: " + wordsPerSec);
}

function FBappendExpTime(expTime, articleID) {

  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
  var articleIndexRef = articleRef.child(articleID);
  articleIndexRef.update({  
       "Experiment Reading Time": expTime
  });
  console.log("Storage Buffer: Article ID: " + articleID + " Received experiment phase article duration shorter than timer: " + expTime);
}




function FBupdateUserData(uid, currArticleID, currQuestionID, question, answer, result, currentAnswerContent, correctAns, orderOfAnswers, questionType, correctAnsContent){
  console.log("Storgae Buffer: Received user answer; article: " + currArticleID + "; question ID: " + currQuestionID + "; question: " + question + "; answer: " + answer + "; result: " + result + "; currentAnswerContent: " + currentAnswerContent + "; correctAns: " + correctAns + "; orderOfAnswers: " + orderOfAnswers + "; questionType: " + questionType + "; correctAnsContent: " + correctAnsContent );
  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
  var articleIndexRef = articleRef.child(currArticleID);
  var questionRef = articleIndexRef.child("Questions");
  var questionIdRef = questionRef.child(currQuestionID);

  questionIdRef.update({  
       "questionID" : currQuestionID,
       "question": question,
       "answer" : answer,
       "answer content" : currentAnswerContent,
       "correct answer" : correctAns,
       "correct answer text" : correctAnsContent,
       "result" : result,
       "order of answers": orderOfAnswers,
       "question type" : questionType
  });


}




function FBpostFineTrackingData(data, articleID) {
  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
   var articleIndexRef = articleRef.child(articleID);
   articleIndexRef.child("Fine Tracking Data").push({ 
    data
  });
}

function FBpostRenderedPageElements(data, articleID) {
  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
  var articleIndexRef = articleRef.child(articleID);

  articleIndexRef.child("Rendered Page Elements").push({  
        data, timestamp: Date.now()
      }); 
}

function queryFBForState(uid){
  try{
    console.log("uid before fb query is: " + uid);
    // myFirebaseRef3.orderByChild("participant_Id").equalTo(uid).once("value", function(snapshot) {
      myFirebaseRef3.child(uid).once("value", function(snapshot) {
      var got_result = true;
      // console.log("third firebase Query is " + JSON.stringify(snapshot.val()));
      // console.log(snapshot.val());
      if (snapshot.val() === null){
        got_result = false;
        console.log("queryFBForState returned false, saving data");
        savePart_Id(uid);
        FBappendUserInfo(userInfo);
        FBappendDisplayOrder(exp_articles);
        FBappendConditionOrder(Conditions);
        FBappendAdBlockCond(adBlockCond);
        saveExperimentNotStarted();
      } else {
        var object = snapshot.val();
        // console.log(object);
        var queriedUID = object.participant_Id;
        console.log("queried ID: ", queriedUID);
        console.log("queryFBForState  returned true, restoreState being called");
        restoreState();
      }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
  }
  catch (error) {
    console.log("queryFBForState returned an error, saving data");
    savePart_Id(uid);
    FBappendUserInfo(userInfo);
    FBappendDisplayOrder(exp_articles);
    FBappendConditionOrder(Conditions);
    FBappendAdBlockCond(adBlockCond);
    saveExperimentNotStarted();
  }
}


// TODO: Add adBlockCond to restored parameters on restore state.
function restoreState() {
  console.log("in restore state function");
  var userRef = myFirebaseRef3.child(uid);
  try {
    userRef.child("state").once("value", function(snapshot) {
    var stateObj = snapshot.val();
    // console.log("stateObj is: " + JSON.stringify(stateObj));
      if (stateObj.experiment_started === "no") {
        console.log("stateObj set to no" );
        userRef.child("Article Order").once("value", function(snapshot) {
          var articleData = snapshot.val();
          console.log("articleData queried from FB: " + JSON.stringify(articleData));
          exp_articles = articleData;
         adBlockCond = stateObj.AdBlock_Condition;
        });
        
      }
      else {
        // console.log("stateObj in restore state is: " + JSON.stringify(stateObj));
        currentArticleIndex = stateObj.currentArticleIndex;
        var location = stateObj.location;
        var finishQuest = stateObj.finished_questions;
        var finishRead = stateObj.finished_reading;
        var did_finish_exp = stateObj.did_finish_exp;
        console.log("in restore state currentArticleIndex is: " + currentArticleIndex + " location is: " + location + " finishQuestions is: " + finishQuest + " finishReading: " + finishRead);
        userRef.child("Article Order").once("value", function(snapshot) {
          var articleData = snapshot.val();
          console.log("articleData queried from FB: " + JSON.stringify(articleData));
          exp_articles = articleData;
          adBlockCond = stateObj.AdBlock_Condition;
        });
        
        
        userRef.child("Reading Speed (words per sec)").once("value", function(snapshot) {
          participantWordPerSec = parseFloat(snapshot.val());
          console.log("words per sec queried from Fb: " + JSON.stringify(participantWordPerSec));
        });
        userRef.child("Qualification Time").once("value", function(snapshot) {
          qualDuration= parseFloat(snapshot.val());
          console.log("qualification Time / qual duratoion: " + JSON.stringify(qualDuration));
        });
        if (did_finish_exp === "yes"){
          sendFinalPage();
        }
        else if ( finishRead === "yes" && finishQuest === "yes"){
          // finishQuestions();
          restoreArticleInstructions();
          // }
        }
        else if (finishRead === "yes" && finishQuest === "no"){
          console.log("starting Questions Page");
          startQuestionsPage();
          // }
        }
        else if (finishRead === "no" && finishQuest === "no" ){
          // sendNextURL();
          //restoreArticleInstructions();
          startQuestionsPage();
        }
      }
    });  
 }
 catch (error) {
    console.log("caught an error in restore state" );
    userRef.child("Article Order").once("value", function(snapshot) {
      var articleData = snapshot.val();
      console.log("articleData queried from FB: " + JSON.stringify(articleData));
      exp_articles = articleData;
    });
     userRef.child("Condition Order").once("value", function(snapshot) {
          Conditions = snapshot.val();
          console.log("Condition Order queried from FB: " + JSON.stringify(Conditions));
        });
 }   
}

function saveStateToFB(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
    "currentArticleIndex" : currentArticleIndex,
    "location" : exp_articles[currentArticleIndex]["location"],
    "finished_reading" : "no",
    "finished_questions" : "no"
  });
}

function saveStateFinishedReading(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "finished_reading" : "yes",
      "finished_questions" : "no",
  });

}

function saveQuestionStatetoFB(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "Article" : exp_articles[currentArticleIndex-1]["location"],
      "finished_questions" : "yes",
      "currentArticleIndex" : currentArticleIndex
  });
}

function saveNotFinishState(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "did_finish_exp" : "no"
  });
}

function saveExperimentNotStarted(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "experiment_started" : "no"
  });
}

function saveExperimentStarted(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "experiment_started" : "yes"
  });
}

function saveDidFinishState(){
  var userRef = myFirebaseRef3.child(uid);
  userRef.child("state").update({
      "did_finish_exp" : "yes",
      "disqualified" : "no"
  });
}

function FBPostArticleLoaded(location, expCondition) {
  console.log("Storage Buffer: Current article is ID: " + currentArticleIndex  + " article; the condition is: " + expCondition);
  var userRef = myFirebaseRef3.child(uid);
  var articleRef = userRef.child("Articles");
  var url = "";
  url = exp_articles[currentArticleIndex]["url"]
  var location = location;

  articleRef.child(location).update({
    "Url" : url,
    "experiment condition": expCondition
  });
}

function FBCalcTotalNumQualCorrect(totalQualCorrect){
  console.log("in calc total num qual correct function");
  var userRef = myFirebaseRef3.child(uid);
  try {
    userRef.child("Articles").once("value", function(snapshot) {
      var Articles = snapshot.val();

      var numCorrect = 0;
      var numWrong = 0;
      for (i = 0; i < 2; i++){
        questions_data = Articles[i]["Questions"];
        for (j = 0; j < questions_data.length; j++){
          if (questions_data[j]["answer"] === questions_data[j]["correct answer"]){
            numCorrect ++ ;
          }
          else{
            numWrong++;
          }
        }
      }
      console.log("num qual correct is " + numCorrect + "numWrong is " + numWrong);
      window.alert("num correct is: " + numCorrect + " num wrong is " + numWrong);
      totalQualCorrect = numCorrect;
      getReadingSpeed(reading_speed, totalQualCorrect);
    });
  }
  catch(error){
    console.log("there was an error in FBCalcTotalNumQualCorrect ");
  }
}





