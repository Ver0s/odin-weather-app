// https://www.youtube.com/watch?v=1Okmw8ggD1Q
// https://dribbble.com/shots/17998271-Cuacane-Weather-App
async function getWeatherData(city) {
	try {
		const response = await fetch(
			`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=cce9db1d405101b4af215855e6397835&units=metric`
		);
		if (!response.ok) {
			throw new Error(response.status);
		}
		const weatherData = await response.json();
		console.log(weatherData);
		showWeatherData(weatherData);
	} catch (error) {
		if (error.message === '404') {
			showError('No matching location found!');
		} else {
			showError(error);
		}
	}
}

// stackoverflow.com/questions/62376115/how-to-obtain-open-weather-api-date-time-from-city-being-fetched
// FORMAT DATE https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
function getCityTime(offset) {
	const options = {
		weekday: 'short',
		hour: 'numeric',
		minute: 'numeric',
	};
	d = new Date();
	localTime = d.getTime();
	// convert to miliseconds
	localOffset = d.getTimezoneOffset() * 60000;
	utc = localTime + localOffset;
	const time = utc + 1000 * offset;
	nd = new Date(time);
	return nd.toLocaleDateString('en-US', options);
}

function showWeatherData(data) {
	const container = document.querySelector('.container');
	if (container.lastElementChild.className === 'weather-data-output') {
		container.removeChild(container.lastElementChild);
	}
	const dataOutput = document.createElement('div');
	dataOutput.setAttribute('class', 'weather-data-output');
	dataOutput.innerHTML = `
		<div class="weather-header">
			<img src="./images/map-pin.svg" alt="map pin" />
			<h3>${data.name}, ${data.sys.country}</h3>
			<span class="current-date">${getCityTime(data.timezone)}</span>
		</div>
		<div class="weather-main">
			<span class="weather-data-temperature">${data.main.temp.toFixed()}°</span>
			<span class="weather-data-description">${data.weather[0].description}</span>
		</div>
		<div class="weather-details">
			<div class="weather-data-pressure">
				<img src="./images/tornado.svg" alt="pressure" />
				<span>${data.main.pressure}hpa</span>
			</div>
			<div class="weather-data-humidity">
				<img src="./images/droplet.svg" alt="humidity" />
				<span>${data.main.humidity}%</span>
			</div>
			<div class="weather-data-wind">
				<img src="./images/wind.svg" alt="wind" />
				<span>${data.wind.speed}km/h</span>
			</div>
		</div>
	</div>
	`;
	// <img src='http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'>
	container.appendChild(dataOutput);
}

function showError(message) {
	const error = document.querySelector('.error');
	error.textContent = message;
	setTimeout(() => {
		error.textContent = '';
	}, 2000);
}

const searchForm = document.querySelector('#search-location-form');
searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const location = document.querySelector('#location').value;
	if (location === '') {
		showError('This field cannot be empty');
	} else {
		getWeatherData(location);
	}
});
