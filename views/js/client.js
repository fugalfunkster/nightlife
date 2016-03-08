'use strict';

// form scripting
// prevent submittal of form on click of id="submitLocation"
// pull value from id="inputLocation"
// ajax to backend /location/:location
// callback creates list
//    append list items to id="listParent"
//  each list item contains
//  div img name<url> description rsvp-button<count - id>

window.onload = function() {

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
    var location = inputLocation.value;
    // console.log(location);
    var locationURL = '/location/' + location;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        listBars(xhr.response);
      }
    };
    xhr.open('POST', locationURL, true);
    xhr.send();
  };

  function listBars(listOfBars) {
    var parsedList = JSON.parse(listOfBars);
    var mappedList = parsedList.businesses.map(function(each) {
      if (!each.is_closed) {
        var bar = {};
        bar.id = each.id;
        bar.imageUrl = each.image_url;
        bar.name = each.name;
        bar.url = each.url;
        bar.info = each.snippet_text;
        bar.rsvp = each.rsvp || 0;
        return bar;
      }
    });
    mappedList.map(function(each) {
      listParent.innerHTML = listParent.innerHTML +
                      '<li class="bars">' +
                      '  <img alt="Picture of '+ each.name + '" src="' + each.imageUrl + '"/>' +
                      '  <a href=' + each.url + '><h3>' + each.name + '</h3></a>' +
                      '  <p>' + each.info + '</p>' +
                      '  <button id="' + each.id + '">RSVPs <span>' + each.rsvp + '</span></button>' +
                      '</li>';
    });

    updateButtonEventHandlers();

  }

  function updateButtonEventHandlers() {
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
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
    var rsvpButton = document.getElementById(rsvp.id);
    rsvpButton.innerHTML = 'RSVPs <span>' + rsvp.count + '</span>';
    
  };

};
