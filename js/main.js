const time = document.querySelector('.time');
const currentDay = document.querySelector('.date');
const greetingField = document.querySelector('.greeting');
const nameField = document.querySelector('.name');
const body = document.querySelector('body');
const prevSlide = document.querySelector('.slide-prev');
const nextSlide = document.querySelector('.slide-next');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const playButton = document.querySelector('.play');
const playWrapper = document.querySelector('.play-list');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playList = [
    {      
        title: 'Aqua Caelestis',
        src: 'assets/sounds/Aqua Caelestis.mp3',
        duration: '00:58'
      },  
      {      
        title: 'River Flows In You',
        src: 'assets/sounds/River Flows In You.mp3',
        duration: '03:50'
      },
      {      
        title: 'Ennio Morricone',
        src: 'assets/sounds/Ennio Morricone.mp3',
        duration: '01:37'
      },
      {      
        title: 'Summer Wind',
        src: 'assets/sounds/Summer Wind.mp3',
        duration: '01:50'
      }
]



let randomNum;
let isPlay = false;
let trackNum = 0;
let clickCounter = 0;

function showTime () {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime,1000);
} 
showTime();

function showDate () {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-En', options);
    currentDay.textContent = currentDate;
}

function getTimeOfDay () {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 12){
        return 'morning';
    } else if (hours >= 12 && hours < 18){
        return 'afternoon';
    } else if (hours >= 18 && hours < 24){
        return 'evening';
    } else if (hours >= 0 && hours < 6){
        return 'night';
    }
}

function showGreeting() {
    greetingField.textContent = `Good ${getTimeOfDay()}`
}

function setLocalStorage () {
    localStorage.setItem('name', nameField.value)
    localStorage.setItem('city', city.value)
}

function getLocalStorage() {
    if (localStorage.getItem('name') || localStorage.getItem('city')){
        nameField.value = localStorage.getItem('name')
        city.value = localStorage.getItem('city')
    }
}

window.addEventListener('beforeunload', setLocalStorage)
window.addEventListener('load', getLocalStorage)

function getRandomNum(){
    randomNum = Math.trunc(Math.random() * 20 + 1)
}

function setBg () {
    getRandomNum();
    const timeOfDay = getTimeOfDay();
    let bgNum = randomNum;
    bgNum = bgNum.toString().padStart(2, '0');
    let img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`
    }     
}

function getSlideNext() {
    if(randomNum <= 20){
        randomNum ++
    } else {
        randomNum = 1
    }
    setTimeout(setBg, 1000)
}

function getSlidePrev() {
    if(randomNum >= 1){
        randomNum --
    } else {
        randomNum = 20
    }
    setTimeout(setBg, 1000)
}

window.onload = () => {
    setBg();
    getQuotes();
}

prevSlide.addEventListener('click', getSlidePrev)
nextSlide.addEventListener('click', getSlideNext)

async function getWeather() {
    try{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=17d832c548eef53e8e86309992c2bda7&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)} %`
    } catch(err) {
        alert('Incorrect city name')
    }
    
}
getWeather();

city.addEventListener('change', getWeather);

async function getQuotes() {
    const quotes = 'https://favqs.com/api/qotd';
    const res = await fetch(quotes);
    const data = await res.json();
    author.textContent = data.quote.author;
    quote.textContent = data.quote.body;
}

changeQuote.addEventListener('click', getQuotes);

const audio = new Audio();

function playAudio() {
    audio.src = playList[trackNum].src;
    audio.currentTime = 0;
    audio.play();
    changeActiveItem();
}

function pauseAudio () {
    audio.pause();
}

function toggleBtn() {
    playButton.classList.toggle('pause');
}

playButton.addEventListener('click', toggleBtn);

playList.forEach((el,index) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[index].title;
    playWrapper.append(li)
})

playButton.addEventListener('click', (e) => {

    clickCounter ++;
    if(clickCounter % 2 == 0){
        pauseAudio();
    } 
    else {
        playAudio()
    }
})

function prevSong() {
    pauseAudio();
    if (trackNum === 0){
        trackNum = 3
        playAudio()
    } else {
        trackNum -= 1;
        playAudio();
    }
    changeActiveItem();
}

function nextSong() {
    pauseAudio();
    if (trackNum === 3){
        trackNum = 0
        playAudio()
    } else {
        trackNum += 1;
        playAudio();
    }
    changeActiveItem();
}

playPrev.addEventListener('click', prevSong)
playNext.addEventListener('click', nextSong)

function changeActiveItem () {
    for (let i = 0; i < playWrapper.childElementCount; i++){
        playWrapper.children[i].classList.remove('item-active');
    }
    playWrapper.children[trackNum].classList.add('item-active');
}
































