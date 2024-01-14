const searchBox=document.querySelector('.searchBox')
const searchClearBtn=document.querySelector('.searchClearBtn')
const recentSrchDiv=document.querySelector('.recentSearchDiv')
const tempContentDiv=document.querySelector('.tempContent')
const humidityContentDiv=document.querySelector('.humidityContent')
const windContentDiv=document.querySelector('.windContent')
const mainHeader=document.querySelector('.mainHeader')
const recentSrchHeader=document.querySelector('.recentSrchHeader')
const srchBtn=document.querySelector('.srchBtn')
const suggestionBox=document.querySelector('.suggestionBox')
const suggestionList=document.querySelector('.suggestionList')
const suggestionBoxCloseBtn=document.querySelector('.suggestionBoxCloseBtn')
const searchedCities=new Set()
//search box clear
retainSearchedCitiesName()
searchBox.addEventListener('input',(e)=>{
    const previouslySuggestedCities=document.querySelectorAll('.suggestedCity')
    previouslySuggestedCities.forEach((previouslySuggestedCity)=>suggestionList.removeChild(previouslySuggestedCity))
    if(!suggestionBox.className.includes('invisible')) suggestionBox.classList.add('invisible')
    const suggestedList=getCitySuggestionList(e.target.value)
    if(suggestedList.length!==0) suggestionBox.classList.remove('invisible')
    suggestedList.forEach((suggestedcityElement)=>suggestionList.appendChild(suggestedcityElement))
    const suggestedCities=document.querySelectorAll('.suggestedCity')
    suggestedCities.forEach((suggestedCity)=>{
        suggestedCity.addEventListener('click',(e)=>{
            startLoader()
            updateWeather(suggestedCity.textContent)
            suggestionBox.classList.add('invisible')
            searchBox.value=''
            if(!(searchClearBtn.className.includes('hidden'))) searchClearBtn.classList.add('hidden')
        })
    })
    if(e.target.value.length===0) searchClearBtn.classList.add('hidden')
    else searchClearBtn.classList.remove('hidden')
})
searchClearBtn.addEventListener('click',()=>{
    searchBox.value=''
    searchClearBtn.classList.add('hidden')
    suggestionBox.classList.add('invisible')
})
suggestionBoxCloseBtn.addEventListener('click',()=>{
    suggestionBox.classList.add('invisible')
})
// document.querySelectorAll('.searchCardRemoveBtn').forEach((searchCardRemoveBtn)=>{
//     console.log(searchCardRemoveBtn)
//     searchCardRemoveBtn.addEventListener('click',function (e){
//         const currSrchCard=this.parentElement.parentElement.parentElement
//         recentSrchDiv.removeChild(currSrchCard)
//     })
// })
function getCitySuggestionList(cityPrefix){
    const matchedCities=getMatchedCities(cityPrefix)
    const suggestedList=[]
    matchedCities.forEach((cityName)=>{
        const listElement=document.createElement('li')
        listElement.classList.add('suggestedCity','hover:bg-slate-100','px-2')
        listElement.textContent=cityName
        suggestedList.push(listElement)
    })
    return suggestedList
}
function getMatchedCities(cityPrefix){
    const searchedCitiesArr=Array.from(searchedCities)
    const matchedCities=searchedCitiesArr.filter((city)=>city.startsWith(cityPrefix.toLowerCase()))
    return matchedCities
}
function startLoader(){
    const loader=document.querySelector('.loader')
    const srchBtnTxt=document.querySelector('.srchBtnTxt')
    loader.className=loader.className.replace('hidden','inline-block')
    srchBtnTxt.className=srchBtnTxt.className.replace('pl-0','pl-1')
    srchBtnTxt.textContent='Searching...'
}
function stopLoader(){
    const loader=document.querySelector('.loader')
    const srchBtnTxt=document.querySelector('.srchBtnTxt')
    loader.className=loader.className.replace('inline-block','hidden')
    srchBtnTxt.className=srchBtnTxt.className.replace('pl-1','pl-0')
    srchBtnTxt.textContent='Search'
}
srchBtn.addEventListener('click',()=>{
    if(!localStorage.getItem('data')) localStorage.setItem('data',searchBox.value)
    else{
        if(!localStorage.getItem('data').includes(searchBox.value)){
            localStorage.setItem('data',`${localStorage.getItem('data')},${searchBox.value.toLowerCase()}`)
            searchedCities.add(searchBox.value)
        }
    }
    startLoader()
    updateWeather(searchBox.value)
    searchBox.value=''
    if(!(searchClearBtn.className.includes('hidden'))) searchClearBtn.classList.add('hidden')
    suggestionBox.classList.add('invisible')
})
function retainSearchedCitiesName(){
    if(!localStorage.getItem('data')) return
    let cityName=''
    for(const char of localStorage.getItem('data')){
        if(char===','){
            searchedCities.add(cityName)
            cityName=''
        }
        else cityName+=char
    }
    searchedCities.add(cityName)
}
function getSrchCard(cityName,weatherResponse){
    // Create a new <div> element with the specified classes
    const searchCard = document.createElement('div');
    searchCard.classList.add('searchCard', 'min-w-[300px]', 'px-2');

    // Create the inner structure
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('w-full', 'border-2', 'border-slate-200', 'flex', 'flex-col', 'items-center');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('w-full', 'h-24', 'bg-blue-400');

    const iconDiv = document.createElement('div');
    iconDiv.classList.add('kdkkd', 'h-8', 'w-8', 'bg-blue-400', 'relative', 'top-[-13px]', 'right-[-90%]', 'rounded-[50%]', 'text-lg', 'flex', 'items-center', 'justify-center', 'drop-shadow-xl', 'shadow-slate-400', 'searchCardRemoveBtn');

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-xmark');

    iconDiv.appendChild(icon);
    headerDiv.appendChild(iconDiv);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('w-full', 'flex', 'flex-col', 'items-center', 'relative', 'top-[-50px]');

    const imageDiv = document.createElement('div');
    imageDiv.setAttribute('style', 'background-image:url(weather-icon-illustration03-Graphics-10205167-1.jpg);background-size: cover; background-position: center;');
    imageDiv.classList.add('flex', 'items-center', 'justify-center', 'h-[100px]', 'w-[100px]', 'rounded-[50%]', 'border-4', 'border-slate-100', 'overflow-hidden');

    const contentHeading = document.createElement('p');
    contentHeading.classList.add('py-1', 'text-lg', 'font-semibold');
    contentHeading.textContent =cityName.toUpperCase() ;

    const cloudPct = createParagraph('Cloud_pct: ', `${weatherResponse.cloud_pct}`);
    const feelsLike = createParagraph('Feels like: ', `${weatherResponse.feels_like}`);
    const humidity = createParagraph('Humidity: ', `${weatherResponse.humidity}`);
    const maxTemp = createParagraph('Max Temp: ', `${weatherResponse.max_temp}`);
    const minTemp = createParagraph('Min Temp: ', `${weatherResponse.min_temp}`);
    const windSpeed = createParagraph('Wind Speed: ', `${weatherResponse.wind_speed}`);

    // Append elements to build the structure
    searchCard.appendChild(innerDiv);
    innerDiv.appendChild(headerDiv);
    innerDiv.appendChild(contentDiv);

    contentDiv.appendChild(imageDiv);
    contentDiv.appendChild(contentHeading);
    contentDiv.appendChild(cloudPct);
    contentDiv.appendChild(feelsLike);
    contentDiv.appendChild(humidity);
    contentDiv.appendChild(maxTemp);
    contentDiv.appendChild(minTemp);
    contentDiv.appendChild(windSpeed);

    // Helper function to create the "p" elements with specified classes and content
    function createParagraph(text, value) {
    const p = document.createElement('p');
    p.classList.add('font-medium');
    
    const span = document.createElement('span');
    span.classList.add('text-slate-500');
    span.textContent = value;
    
    p.innerHTML = `${text}<span class="text-slate-500">${value}</span>`;
    
    return p;
    }

    iconDiv.addEventListener('click',function(e){
        const currSrchCard=this.parentElement.parentElement.parentElement
        if(recentSrchDiv.children.length===1) recentSrchHeader.textContent=''
        recentSrchDiv.removeChild(currSrchCard)
    })

    return searchCard

}
function utilityCapitalize(cityName){
    let capitalizedStr=''
    for(let i=0;i<cityName.length;i++){
        if(i===0) capitalizedStr+=cityName[i].toUpperCase()
        else capitalizedStr+=cityName[i].toLowerCase()
    }
    return capitalizedStr
}
function updateWeatherCards(jsonResponse){
    // temperature update
    tempContentDiv.children[0].children[0].textContent=`${jsonResponse.temp}`
    tempContentDiv.children[1].textContent=`Temperature is ${jsonResponse.temp}`
    tempContentDiv.children[2].textContent=`Min Temperature is ${jsonResponse.min_temp}`
    tempContentDiv.children[3].textContent=`Max Temperature is ${jsonResponse.max_temp}`

    // humidity update
    humidityContentDiv.children[0].children[0].textContent=`${jsonResponse.humidity}`
    humidityContentDiv.children[1].textContent=`Wind degree is ${jsonResponse.wind_degrees}`
    humidityContentDiv.children[2].textContent=`Feels like ${jsonResponse.feels_like}`
    humidityContentDiv.children[3].textContent=`Humidity is ${jsonResponse.humidity}`

    // wind update
    windContentDiv.children[0].children[0].textContent=`${jsonResponse.wind_speed}`
    windContentDiv.children[1].textContent=`Wind Speed is ${jsonResponse.wind_speed}`
    windContentDiv.children[2].textContent=`Sunrised at ${jsonResponse.sunrise}`
    windContentDiv.children[3].textContent=`Sunset at ${jsonResponse.sunset}`

}
function updateWeather(cityName){
    fetch(`https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${cityName}`, {
    headers: {
        'X-RapidAPI-Key': 'd0ec21ee22mshd1fd9ccd553d1f1p1812fejsnc617f120961d',
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com',
    }
    }).then((weatherResponse)=>{
        stopLoader()
        if(!weatherResponse.ok) throw new Error('bad request')
        else return weatherResponse.json()
    }).then((parsedWetherResponse)=>{
        mainHeader.textContent=`Weather For ${utilityCapitalize(cityName)}`
        if(recentSrchDiv.children.length===0) recentSrchHeader.textContent='Recent Searches'
        updateWeatherCards(parsedWetherResponse)
        recentSrchDiv.appendChild(getSrchCard(cityName,parsedWetherResponse))
    }).catch((error)=>{
        stopLoader()
        alert(`E:${error.message}`)
    })
}
