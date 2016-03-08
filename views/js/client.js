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

  inputLocation.onclick = function clearDefaultValue() {
    if (inputLocation.value  === 'Enter your location') {
      inputLocation.setAttribute('value', '');
    }
  };

  submitLocation.addEventListener('click', sendLocation, false);

  function sendLocation(e) {

    e.stopPropagation();
    e.preventDefault();

    var location = inputLocation.value;
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
  };

  function listBars(listOfBars) {
    console.log('successful call from: ' + listOfBars);
    // loop
    // var bar = listParent.createElement('li');
    // bar.innerH;
    // listParent.appendChild(bar);
  }

  function updateRSVP(RSVP) {
    // on click for buttons
    // ajax with id from clicked button
    // callback updates button
  };

};
