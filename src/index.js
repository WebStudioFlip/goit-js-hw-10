import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryCardTemplate from './templates/countryCard.hbs'
import {fetchCountries} from './js/fetchCountries'
const DEBOUNCE_DELAY = 300;
const MIN_LENGHT = 2;

const countryNameInputEl = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');
let countries =  []
countryNameInputEl.addEventListener('input', debounce( onCountryNameInput, DEBOUNCE_DELAY))

function onCountryNameInput(event) {
    let name = event.target.value.trim()
    if( name.length < MIN_LENGHT) {       
        Notiflix.Notify.info(`Please enter at least ${MIN_LENGHT} characters`,{
            timeout: 2000,
          });
          clearHTML()
        return;
    } 
    return fetchCountries(name)
    .then((result)=>{
        countries = result;
        responseShow (result)
    })
}

function responseShow (countries){
    if (countries.length === 0) {clearHTML()
        Notiflix.Notify.failure('Oops, there is no country with that name.',{
            timeout: 5000,
          });
        return;  }
        if (countries.length === 1) {buildCardCountry (countries[0])
                return;  }         
    
                if (countries.length > 1 && countries.length <11) {
            buildListCountries (countries)
            return;
                }
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.',{
                    timeout: 5000,
                  });    
    }

function buildListCountries (countries) {
const toInsertHTML = countries.map(el=>`<li class="countries-list-item">
<img src="${el.flags.svg}" alt="" width="30px" height="20px">
<p class="countries-list-item-name">${el.name.official}</p>
</li>`).join("")
clearHTML()
countriesList.innerHTML = toInsertHTML;
const countryListEl = document.querySelector('.country-list')
countryListEl.addEventListener("click", onCountryItemClick)
}

function onCountryItemClick(event) {
    const selectCountry = event.target.closest('.countries-list-item').querySelector('.countries-list-item-name').textContent;
    const clickCountry = countries.find(el => el.name.official === selectCountry);
    if (clickCountry) {countryNameInputEl.value = clickCountry.name.official;
        buildCardCountry (clickCountry) }
    else { Notiflix.Notify.failure('Oops, Something went wrong(',{
        timeout: 5000,
      });}
}

function buildCardCountry (country) {
    clearHTML()
    const {capital, population,name, languages, flags}=country;
    const toTemplate = {
        name: name.official,
        capital,
         population:String(population).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g,"$1,"),
         flags,
         languages: Object.values(languages).join(", "),
    }
    countryCard.innerHTML = countryCardTemplate(toTemplate)
}

function clearHTML(){
    countriesList.innerHTML ="";
    countryCard.innerHTML = "";
}