/* to do :
- validate the input
- format the input
- request data from apis.is
- display resaults
- support things, error handling..
*/

// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';
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
    console.log("Form Submitted", domainValues.value);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('input');
  const form = document.querySelector('form');
  program.init(domains, form);
});
