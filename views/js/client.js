'use strict';

window.onload = function() {

  if (typeof sessionLocation !== 'undefined') {
    console.log(sessionLocation);
    sendLocationRequest(sessionLocation);
  }

  var inputLocation = document.getElementById('inputLocation');
  var submitLocation = document.getElementById('submitLocation');
  var listParent = document.getElementById('listParent');
  var buttons;

  inputLocation.onclick = function clearDefaultValue() {
    if (inputLocation.value  === 'Enter your location') {
      inputLocation.setAttribute('value', '');
    }
  };

  submitLocation.onclick = function sendLocation(e) {
    e.stopPropagation();
    e.preventDefault();
    var formLocation = inputLocation.value;
    sendLocationRequest(formLocation);
  };

  function sendLocationRequest(location) {
    console.log(location);
    var locationURL = '/location/' + location;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        listBars(xhr.response);
      }
    };
    xhr.open('POST', locationURL, true);
    xhr.send();
  }

  function listBars(listOfBars) {
    listParent.innerHTML = "";
    var parsedList = JSON.parse(listOfBars);
    var mappedList = parsedList.businesses.map(function(each) {
      if (!each.is_closed) {
        console.log(each);
        each.rsvp = each.rsvp || 0;
        listParent.innerHTML = listParent.innerHTML +
          '<li class="bars">' +
          '  <img alt="Picture of '+ each.name + '" src="' + each.image_url + '"/>' +
          '  <a href=' + each.url + '><h3>' + each.name + '</h3></a>' +
          '  <p>' + each.snippet_text + '</p>' +
          '  <button id="' + each.id + '">RSVPs <span>' + each.rsvp + '</span></button>' +
          '</li>';
      }
    });
    updateButtonEventHandlers();
  }

  function updateButtonEventHandlers() {
    var buttons = document.getElementsByTagName('button');
    for (var i = 1; i < buttons.length; i++) {
      var button = buttons[i];
      button.onclick = rsvp;
    }
  }

  function rsvp(e) {
    // console.log('click');
    e.stopPropagation();
    e.preventDefault();
    var barId = this.getAttribute('id');
    var rsvpUrl = '/rsvp/' + barId;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        updateRSVP(xhr.response);
      }
    };
    xhr.open('POST', rsvpUrl, true);
    xhr.send();
  };

  function updateRSVP(rsvpString) {
    var rsvp = JSON.parse(rsvpString);
    console.log(rsvp);
    if (typeof rsvp.redirect == 'string') {
      window.location = rsvp.redirect;
    }
    var rsvpButton = document.getElementById(rsvp.barId);
    rsvpButton.innerHTML = 'RSVPs <span>' + rsvp.count + '</span>';

  };

};
