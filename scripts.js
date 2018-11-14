const API_URL = 'https://apis.is/isnic?domain=';
let resultContainer;
let domainValues = false;

const program = (() => {
  /* Helper function - sýnir loading gif */
  function displayLoading(isLoading = false) {
    const loadingContaier = document.createElement('div');
    const loading = document.createElement('img');
    const loadingText = document.createElement('span');
    if (isLoading) {
      loadingContaier.classList.add('loading');

      loading.setAttribute('alt', 'Loading Image');
      loading.setAttribute('src', '/soa20/vefforritun/Verkefni-9/loading.gif');

      loadingText.appendChild(document.createTextNode('Leita að léni...'));

      loadingContaier.appendChild(loading);
      loadingContaier.appendChild(loadingText);
      resultContainer.appendChild(loadingContaier);
    } else if (resultContainer.querySelector('.loading')) {
      resultContainer.querySelector('.loading').remove();
    }
  }
  /*
   * Formattar dagsetningar í ISO 8601 dagsetningar (YYYY-MM-DD)
   * https://caniuse.com/#feat=internationalization
   */
  function formatDate(date = null, useIntl = true) {
    const newDateFormat = new Date(date);
    let formatted = null;
    if (typeof Intl === 'object' && useIntl) {
      formatted = new Intl.DateTimeFormat('is-IS').format(newDateFormat);
    } else {
      formatted = newDateFormat.toLocaleString('is-IS', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    }
    return formatted;
  }

  function renderResults(data) {
    const result = document.createElement('dl');
    const keys = Object.keys(data);
    const values = Object.values(data);
    console.log('renderResults', data);
    displayLoading(false);
    if (typeof data !== 'string') {
      for (let i = 0; i < keys.length; i += 1) {
        if (values[i].length > 0) {
          const theName = document.createElement('dt');
          const theValue = document.createElement('dd');
          let keyName = keys[i];
          let keyValue = values[i];

          // Þýðir keyNames yfir á íslensku og formattar dagsetningar
          switch (keyName) {
            case 'domain':
              keyName = 'Lén';
              break;
            case 'registrantname':
              keyName = 'Skráningaraðili';
              break;
            case 'address':
              keyName = 'Heimilisfang';
              break;
            case 'email':
              keyName = 'Netfang';
              break;
            case 'city':
              keyName = 'Borg';
              break;
            case 'postalCode':
              keyName = 'Póstnúmer';
              break;
            case 'country':
              keyName = 'Land';
              break;
            case 'phone':
              keyName = 'Sími';
              break;
            case 'registered':
              keyName = 'Skráð';
              keyValue = formatDate(keyValue, true);
              break;
            case 'lastChange':
              keyName = 'Seinast breytt';
              keyValue = formatDate(keyValue, true);
              break;
            case 'expires':
              keyName = 'Rennur út';
              keyValue = formatDate(keyValue, false);
              break;
            default:
              break;
          }

          theName.appendChild(document.createTextNode(keyName));
          result.appendChild(theName);

          theValue.appendChild(document.createTextNode(keyValue));
          result.appendChild(theValue);

          console.log('PRINT RESULT', keyName, keyValue);
        }
      }
      resultContainer.appendChild(result);
    } else {
      resultContainer.appendChild(document.createTextNode(data));
    }
  }

  /* Helper Function fyrir Fetch til að determine-a status af ajax request */
  function getStatus(response) {
    let prom;
    if (response.status >= 200 && response.status < 300) {
      console.log(`ajaxRequest_fetch status: ${response.status}`);
      prom = Promise.resolve(response);
    } else {
      prom = Promise.reject(new Error(response.statusText));
    }
    return prom;
  }

  function ajaxRequestFetch(theQuery) {
    const query = API_URL + theQuery;
    const notFoundMsg = 'Lén er ekki skráð';
    const errorMsg = 'Villa við að sækja gögn';
    fetch(query)
      .then(getStatus)
      /* eslint-disable */
      .then(response => {
        return response.json();
      })
      /* eslint-enable */
      .then((data) => {
        console.log('ajaxRequestFetch succeeded with JSON response', data);
        console.log('ajaxRequest_fetch type', typeof data);
        if (typeof data === 'object'
          && typeof data.results[0] === 'object'
          && Object.keys(data).length > 0) {
          console.log('SUCCESS: let\'s render the results now.');
          renderResults(data.results[0]);
        } else {
          console.log('ajaxRequest', notFoundMsg);
          renderResults(notFoundMsg);
        }
      })
      .catch((err) => {
        console.log('ERROR:ajaxRequestFetch', errorMsg, err);
        renderResults(errorMsg);
      });

    return true;
  }

  function getDomains(theQuery = null) {
    let query = theQuery;
    console.log('getDomains', theQuery);
    displayLoading(true);
    query = ajaxRequestFetch(theQuery);
    return query;
  }

  function formHandler(e) {
    const theQuery = domainValues.value.trim();
    const isEmptyMsg = 'Lén verður að vera strengur';
    const isEmpty = `<b>${isEmptyMsg}</b>`;
    let isValid = false;

    e.preventDefault();

    if (theQuery.length > 0) {
      isValid = true;
    } else {
      resultContainer.innerHTML = isEmpty;
    }
    if (isValid) {
      resultContainer.innerHTML = '';
      getDomains(theQuery);
    }
    console.log('Form Submitted', domainValues.value);
  }

  function init(domains, form) {
    form.addEventListener('submit', formHandler);
    domainValues = domains;
    console.log('Program Initialized');
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
