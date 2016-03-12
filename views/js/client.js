'use strict';

window.onload = function() {

  var inputLocation = document.getElementById('inputLocation');
  var submitLocation = document.getElementById('submitLocation');
  var listParent = document.getElementById('listParent');

  if (sessionLocation !== void 0) {
    inputLocation.value = sessionLocation;
    requestBarsFor(sessionLocation);
  }

  inputLocation.onclick = function clearDefaultInputValue() {
    if (inputLocation.value  === 'Enter your location') {
      inputLocation.setAttribute('value', '');
    }
  };

  submitLocation.onclick = function sendLocation(e) {
    arrestEvent(e);
    var userLocation = inputLocation.value;
    requestBarsFor(userLocation);
  };

  function requestBarsFor(userLocation) {
    var requestUrl = '/location/' + userLocation;
    ajax('POST', requestUrl, listBars);
  }

  function listBars(listOfBars) {
    listParent.innerHTML = '';
    var parsedListOfBars  = JSON.parse(listOfBars);
    var mappedListOfBars = parsedListOfBars.map(function(bar) {
      if (!bar.is_closed) {
        bar.rsvp = bar.rsvp || 0;
        bar.userRsvp = bar.userRsvp || 'notgoing';
        listParent.innerHTML = listParent.innerHTML +
          '<li class="bars ' + bar.userRsvp + '">' +
          '  <img alt="Picture of ' + bar.name + '" src="' + bar.image_url + '"/>' +
          '  <a href=' + bar.url + '><h3>' + bar.name + '</h3></a>' +
          '  <p>' + bar.snippet_text + '</p>' +
          '  <button id="' + bar.id + '">RSVPs <span>' + bar.rsvp + '</span></button>' +
          '</li>';
      }
    });
    updateRsvpEventHandlers();
  }

  function updateRsvpEventHandlers() {
    var rsvpButtons = document.getElementsByTagName('button');
    for (var i = 1; i < rsvpButtons.length; i++) {
      var button = rsvpButtons[i];
      button.onclick = postRsvp;
    }
  }

  function postRsvp(e) {
    arrestEvent(e);
    var barId = this.getAttribute('id');
    if (this.parentNode.getAttribute('class') == 'going') {
      var removeUrl = '/remove/' + barId;
      ajax('POST', removeUrl, updateRsvpButton);
    } else {
      var rsvpUrl = '/rsvp/' + barId;
      ajax('POST', rsvpUrl, updateRsvpButton);
    }
  };

  function updateRsvpButton(rsvpConfirmation) {
    var rsvp = JSON.parse(rsvpConfirmation);
    if (typeof rsvp.redirect == 'string') {
      window.location = rsvp.redirect;
    }
    var rsvpButton = document.getElementById(rsvp.barId);
    rsvpButton.innerHTML = 'RSVPs <span>' + rsvp.count + '</span>';
    if (rsvpButton.parentNode.getAttribute('class') == 'going') {
      rsvpButton.parentNode.className = 'notgoing';
    } else {
      rsvpButton.parentNode.className = 'going';
    }
  };

  function arrestEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function ajax(method, url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        cb(xhr.response);
      }
    };
    xhr.open(method, url, true);
    xhr.send();
  }

};
