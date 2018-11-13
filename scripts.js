/* to do :
- validate the input
- format the input
- request data from apis.is
- display resaults
- support things, error handling..
*/

// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';
const testData = {
  "results": [{
    "domain": "hi.is",
    "registrantname": "Háskóli Íslands",
    "address": "Sæmundargötu 2",
    "city": "Reykjavík",
    "postalCode": "101",
    "country": "IS",
    "phone": "",
    "email": "hostmaster@hi.is",
    "registered": "11. December 1986",
    "expires": "11. December 2018",
    "lastChange": "29. November 2017"
  }]
};
let resultContainer;
let domainValues = false;

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  function init(domains, form) {
    form.addEventListener('submit', formHandler);
    domainValues = domains;
    console.log("Program Initialized");
  }

  function formHandler(e) {
    e.preventDefault();
    let isValid = false;
    domainValues.value = domainValues.value.trim();
    if (domainValues.value.length > 0) {
      isValid = true;
    }
    if (isValid) {
      renderResults(getDomains(domainValues.value));
    }
    console.log("Form Submitted", domainValues.value);
  }

  function getDomains(theQuery) {
    theQuery = testData.results[0];
    if (theQuery) {

    }
    console.log("Get Domains", theQuery);
    return theQuery;
    }

  function renderResults(data) {
    console.log("Render Results", data);
    let result = document.createElement("dl");
    for (var prop in data) {
        console.log("Print Result", prop, data[prop]);
        let row = document.createElement("dt");
        // row.appendChild(document.createTextNode(value));
        let theName = document.createElement("dt");
        let theValue = document.createElement("dd");
        theName.appendChild(document.createTextNode(prop));

        row.appendChild(theName, theValue);
        result.appendChild(row);
      }
    resultContainer.appendChild(result);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('input');
  const form = document.querySelector('form');
  resultContainer = document.querySelector('.results');
  program.init(domains, form);
});
