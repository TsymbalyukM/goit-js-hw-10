import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
let countryName = '';

const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');

searchBox.addEventListener('input', debounce(handleSearchBox, DEBOUNCE_DELAY));

function handleSearchBox(event) {
  countryName = event.target.value.trim();

  if (!countryName) {
    clearInterface();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length === 1) {
        clearInterface();
        countryInfo.innerHTML = renderSingleMarkup(data);
      } else if (data.length >= 2 && data.length <= 10) {
        clearInterface();
        countryList.innerHTML = renderMultipleMarkup(data);
      } else {
        clearInterface();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      clearInterface();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderSingleMarkup(data) {
  const languages = Object.values(data[0].languages).join(', ');

  return data
    .map(({ capital, flags, name, population }) => {
      return `<div class="country-info-box">
                    <img src="${flags.svg}" alt="Country flag" width="40" height="30" class="country-info-flag" />
                    <p class="country-info-name">${name.official}</p>
                </div>
                <p class="country-info-capital"><b>Capital:</b> ${capital}</p>
                <p class="country-info-population"><b>Population:</b> ${population}</p>
                <p class="country-info-languages"><b>Languages:</b> ${languages}</p>`;
    })
    .join('');
}
function renderMultipleMarkup(data) {
  return data
    .map(({ flags, name }) => {
      return `<li class="country-list-item">
                    <img src="${flags.svg}" alt="Conntry flag" width="40" height="30" class="country-list-flag">
                    <p class="country-list-name">${name.official}</p>
                </li>`;
    })
    .join('');
}

function clearInterface() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
