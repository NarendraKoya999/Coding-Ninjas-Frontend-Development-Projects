document.getElementById('location-form').addEventListener('submit', getWeather);

async function getWeather(event) {
    event.preventDefault();
    const location = document.getElementById('location-input').value;
    const apiKey = '979f84fe0966ec3c22878ab2a6ae203f';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '404') {
            document.getElementById('weather-data').innerHTML = `<div id="error">Error: City not found</div>`;
        } else {
            document.getElementById('weather-data').innerHTML = `
                <p><i class="fas fa-map-marker-alt"></i><strong>City:</strong> ${data.name}</p>
                <p><i class="fas fa-thermometer-half"></i><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><i class="fas fa-cloud-sun"></i><strong>Weather:</strong> ${data.weather[0].description}</p>
            `;
        }

        // Clear the input field
        document.getElementById('location-input').value = '';
    } catch (error) {
        document.getElementById('weather-data').innerHTML = `<div id="error">Error fetching weather data</div>`;
    }
}
