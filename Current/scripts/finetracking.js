// global variables
var currData = {}; 
var prevData = null;
// var ping = new Image();
var de = document.documentElement;
var g = document.getElementsByTagName('body')[0];
var buffer = [];

// register to our own event triggered when tracking data is available
window.addEventListener('postdata', function (e) {
  chrome.runtime.sendMessage({msg: "postFineTrackingData", data: e.payload, url: window.location.href}, function() { });
});

initData();
postData();

document.onload = postData;
document.onunload = postData;

window.onfocus = function () {
  currData.isActive = true;
};
window.onblur = function () {
  currData.isActive = false;
};
window.onresize = resizeHandler;
window.onscroll = scrollHandler;
document.onkeydown = keyDownHandler;
document.onkeyup = keyUpHandler;
document.onmousedown = mouseDownHandler;
document.onmouseup = mouseUpHandler;
document.onmousemove = mouseMoveHandler;

setInterval(bufferData, 100); // setInterval repeats every X ms
setInterval(postData, 5000);

function resizeHandler(event) {
  currData.w = window.innerWidth || de.clientWidth || g.clientWidth;
  currData.h = window.innerHeight|| de.clientHeight|| g.clientHeight;
}

function scrollHandler(event) {
  currData.t = window.scrollY;
  currData.l = window.scrollX;
}

function keyDownHandler(event) {
  currData.key = event.which || event.keyCode;
}

function keyUpHandler(event) {
  currData.key = null;
}

function mouseDownHandler(event) {
  currData.mouse = event.which;
}

function mouseUpHandler(event) {
  currData.mouse = null;
}

function mouseMoveHandler(event) {
    event = event || window.event;
    currData.x = event.pageX;
    currData.y = event.pageY;
}

function initData() {
  currData.isActive = true;
  currData.w = window.innerWidth || de.clientWidth || g.clientWidth;
  currData.h = window.innerHeight|| de.clientHeight|| g.clientHeight;
  currData.t = window.scrollY;
  currData.l = window.scrollX;
  currData.x = null;
  currData.y = null;
  currData.key = null;
  currData.mouse = null;
}

function bufferData() {
  var b = { tt: Math.floor(Date.now()) };
  //console.log("checking what is recorded in data object: " + b.tt);
  if (prevData == null || 
      currData.isActive != prevData.isActive ||
      currData.w != prevData.w ||
      currData.h != prevData.h ||
      currData.t != prevData.t ||
      currData.l != prevData.l ||
      currData.x != prevData.x ||
      currData.y != prevData.y ||
      currData.key != prevData.key ||
      currData.mouse != prevData.mouse
      ) {
    prevData = {}
    for (var i in currData) {
      b[i] = currData[i];
      prevData[i] = currData[i];
    }
    buffer.push(b);
  }
};

function postData() {
  if (buffer.length == 0) {
    b = { tt: Math.floor(Date.now()) };
    for (var i in currData)
      b[i] = currData[i];
    buffer.push(b);
  }
  var evt = document.createEvent("Event");
  evt.payload = buffer;
  evt.initEvent("postdata", true, false);
  window.dispatchEvent(evt);
  buffer = [];
};

$(document).ready(function() { 
  console.log("fine tracking loaded");
  return false;
});

