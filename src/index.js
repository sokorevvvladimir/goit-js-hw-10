import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css'
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('[id="search-box"]'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

// console.log(fetchCountries('Ukraine'));


function oneCountry(countries) {
    clearList();

    const markup = countries.map(country => {
        const languages = Object.values(country.languages)
        return `
          <img src="${country.flags.svg}" width="80"/>
          <span class="name">${country.name.official}</span>
          <p class="common">Capital: <span class="value">${country.capital}</span></p>
          <p class="common">Languages: <span class="value">${languages}</span></p>
          <p class="common">Population: <span class="value">${country.population}</span></p>
            `
    })
    
    refs.info.innerHTML = markup;
};

function moreThanTen() {
    clearList();
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
};

function fromTwoToTen(countries) {
    clearList();
    const markup = countries.map(country => {
        return `
        <li>
          <img src="${country.flags.svg}" width="50"/>
          <span class="many-names">${country.name.official}</span>
        </li>
        `
    }).join("");
    refs.list.insertAdjacentHTML('beforeend', markup);
};

function clearList() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';

};

function renderInfo(countries) {
    if (countries.length > 10) {
        moreThanTen();
        return;
    };
    if (countries.length === 1) {
        oneCountry(countries);
        return;
    };
    fromTwoToTen(countries);
};

function invalidCountryName(error) {
    clearList();
Notiflix.Notify.failure('Oops, there is no country with that name');
};

function onInputHandle(e) {
    if (e.target.value.trim() !== "") {
        fetchCountries(e.target.value)
            .then(renderInfo)
            .catch(invalidCountryName);
}
};


refs.input.addEventListener('input', debounce(onInputHandle, DEBOUNCE_DELAY));