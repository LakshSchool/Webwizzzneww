import countryTimezones from './timezones.js';
import countryTrivia from './countryTrivia.js';
import { initGlobe } from './globe.js';
import { getCountryScenery } from './countryScenery.js';

let allCountries = [];
let map = null;
let marker = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        allCountries = await response.json();
        
        // Set up event listeners
        setupEventListeners();
        initGlobe(); // Initialize the globe
        
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Add event listener for Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            searchCountry();
        }
    });

    // Add event listener for input changes (suggestions)
    searchInput.addEventListener('input', showSuggestions);

    // Add event listener for search button
    searchButton.addEventListener('click', () => searchCountry());
}

function showSuggestions(e) {
    const input = e.target.value.toLowerCase();
    const suggestionBox = document.getElementById('suggestions');
    suggestionBox.innerHTML = '';

    if (!input) {
        suggestionBox.classList.add('hidden');
        return;
    }

    const matches = allCountries
        .filter(country => country.name.common.toLowerCase().includes(input))
        .slice(0, 8);

    if (matches.length > 0) {
        suggestionBox.classList.remove('hidden');
        matches.forEach(country => {
            const div = document.createElement('div');
            div.textContent = country.name.common;
            div.addEventListener('click', () => {
                document.getElementById('searchInput').value = country.name.common;
                suggestionBox.classList.add('hidden');
                searchCountry();
            });
            suggestionBox.appendChild(div);
        });
    } else {
        suggestionBox.classList.add('hidden');
    }
}

// Add missing functions for favorites
function addToRecent(countryName) {
    const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!recent.includes(countryName)) {
        recent.unshift(countryName);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recentSearches', JSON.stringify(recent));
    }
}

function addFavorite(countryName) {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.includes(countryName)) {
        favs.push(countryName);
        localStorage.setItem('favorites', JSON.stringify(favs));
    }
    updateFavorites();
}

function removeFavorite(countryName) {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favs.indexOf(countryName);
    if (index > -1) {
        favs.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favs));
    }
    updateFavorites();
}

function updateFavorites() {
    const favsDiv = document.getElementById('favorites');
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favs.length > 0) {
        favsDiv.classList.remove('hidden');
        favsDiv.innerHTML = `
            <h3>Favorites</h3>
            <div class="favs-container">
                ${favs.map(country => `
                    <div class="fav-item">
                        <span onclick="searchCountry('${country}')">${country}</span>
                        <button onclick="removeFavorite('${country}')" class="remove-fav">×</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        favsDiv.classList.add('hidden');
    }
}

// Update the searchCountry function to handle both direct input and parameter
async function searchCountry(name) {
    const query = name || document.getElementById('searchInput').value.trim();
    if (!query) return;

    const resultDiv = document.getElementById('result');
    const mapDiv = document.getElementById('map');
    const suggestions = document.getElementById('suggestions');
    
    suggestions.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = 'Loading...';
    mapDiv.classList.add('hidden');

    const country = allCountries.find(c => 
        c.name.common.toLowerCase() === query.toLowerCase()
    );

    if (!country) {
        resultDiv.innerHTML = `<p>No data found for "${query}".</p>`;
        return;
    }

    try {
        const localTime = getLocalTime(country.name.common);
        const capital = country.capital?.[0] || 'N/A';
        const weatherText = await getWeather(capital, country.cca2);

        // Add to recent searches
        addToRecent(country.name.common);

        // Check if country is in favorites
        const favs = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favs.includes(country.name.common);

        resultDiv.innerHTML = `
            <h2>${country.name.common} 
                <span class="country-flag"><img src="${country.flags.png}" alt="Flag of ${country.name.common}"></span>
            </h2>
            <div class="country-info">
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                <p><strong>Local Time:</strong> <span class="local-time">${localTime}</span></p>
                <p><strong>Weather:</strong> ${weatherText}</p>
                <button onclick="addFavorite('${country.name.common}')" class="fav-button ${isFavorite ? 'active' : ''}">
                    ${isFavorite ? '⭐ Added to Favorites' : '⭐ Add to Favorites'}
                </button>
            </div>
        `;

        // Add trivia section
        const trivia = generateTrivia(country);
        if (trivia.length > 0) {
            const triviaSection = document.createElement('div');
            triviaSection.className = 'trivia-section';
            triviaSection.innerHTML = `
                <h3 class="trivia-title">🎯 Interesting Facts</h3>
                <ul class="trivia-list">
                    ${trivia.map(fact => `<li class="trivia-item">${fact}</li>`).join('')}
                </ul>
            `;
            resultDiv.appendChild(triviaSection);
        }

        // Show map
        showMap(country);
        mapDiv.classList.remove('hidden');

        // Add scenery section after map
        const sceneryData = getCountryScenery(country.name.common);
        if (sceneryData && sceneryData.length > 0) {
            const scenerySection = document.createElement('div');
            scenerySection.className = 'scenery-section';
            scenerySection.innerHTML = `
                <h3 class="section-title">🏛️ Scenic Views</h3>
                <div class="scenery-grid">
                    ${sceneryData.map(scene => `
                        <div class="scenery-item">
                            <img src="${scene.url}" alt="${scene.alt}" class="scenery-photo">
                            <div class="scene-info">
                                <span class="scene-location">📍 ${scene.location}</span>
                                <span class="scene-credit">📸 ${scene.credit}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            resultDiv.appendChild(scenerySection);
        }

        resultDiv.classList.add('show');

        // Add flag animation
        setTimeout(() => {
            const flagElement = resultDiv.querySelector('.country-flag');
            if (flagElement) {
                flagElement.classList.add('animate');
            }
        }, 100);

    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `<p>Error loading country data. Please try again.</p>`;
    }
}

function generateTrivia(country) {
    const trivia = [];
    if (countryTrivia[country.name.common]) {
        trivia.push(...countryTrivia[country.name.common]);
    }
    
    // Add dynamic trivia
    if (country.area) {
        trivia.push(`Total area is ${country.area.toLocaleString()} square kilometers`);
    }
    if (country.borders?.length) {
        trivia.push(`Shares borders with ${country.borders.length} countries`);
    }
    if (country.timezones?.length > 1) {
        trivia.push(`Spans across ${country.timezones.length} time zones`);
    }
    if (country.capital) {
        trivia.push(`The capital city is ${country.capital[0]}`);
    }
    if (country.currencies) {
        const currencyNames = Object.values(country.currencies).map(c => c.name);
        trivia.push(`Official currency: ${currencyNames.join(', ')}`);
    }

    return trivia;
}

// Helper functions
function getLocalTime(countryName) {
    try {
        const timezone = countryTimezones[countryName];
        if (!timezone) return 'Time not available';
        
        return new Date().toLocaleString('en-US', {
            timeZone: timezone,
            dateStyle: 'full',
            timeStyle: 'long'
        });
    } catch (error) {
        console.error('Error getting time:', error);
        return 'Time not available';
    }
}

async function getWeather(city, countryCode) {
    if (!city || city === 'N/A') return 'Weather data not available';
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=YOUR_API_KEY&units=metric`
        );
        const data = await response.json();
        return `${Math.round(data.main.temp)}°C, ${data.weather[0].description}`;
    } catch (error) {
        return 'Weather data not available';
    }
}

function showMap(country) {
    const mapDiv = document.getElementById('map');
    
    // Clear previous map content
    mapDiv.innerHTML = '';
    
    // Set initial height for the map container
    mapDiv.style.height = '400px';
    mapDiv.classList.remove('hidden');
    
    // Ensure map is removed if it exists
    if (map) {
        map.remove();
        map = null;
    }
    
    // Create new map instance
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Add tile layer with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
    }).addTo(map);

    // Get country coordinates
    const lat = country.latlng[0];
    const lng = country.latlng[1];

    // Add marker with popup
    const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
            <b>${country.name.common}</b><br>
            Capital: ${country.capital?.[0] || 'N/A'}
        `);

    // Set view and zoom level based on country size
    if (country.area > 1000000) {
        map.setView([lat, lng], 4);
    } else if (country.area > 100000) {
        map.setView([lat, lng], 5);
    } else {
        map.setView([lat, lng], 6);
    }

    // Force a resize event after map is added
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function initializeMap(lat, lng) {
    const mapDiv = document.getElementById('map');
    mapDiv.classList.remove('hidden');
    
    // Remove existing map if present
    if (map) {
        map.remove();
    }
    
    // Initialize map with dark theme
    map = L.map('map').setView([lat, lng], 5);
    
    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
    }).addTo(map);
    
    // Add marker
    marker = L.marker([lat, lng]).addTo(map);
    
    // Add click events
    marker.on('click', () => {
        map.setView(marker.getLatLng(), 8);
    });
    
    // Force map to redraw
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function initMap() {
    const defaultLocation = { lat: 20, lng: 0 }; // Default center of the world
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: defaultLocation,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            }
        ]
    });
}

function updateMap(country) {
    if (!map) return;
    
    const position = { 
        lat: country.latlng[0], 
        lng: country.latlng[1] 
    };

    // Update marker
    if (marker) {
        marker.setMap(null);
    }
    
    marker = new google.maps.Marker({
        position: position,
        map: map,
        title: country.name.common
    });

    // Set map center and zoom
    map.setZoom(4);
    map.setCenter(position);

    // Add click listener to marker
    marker.addListener("click", () => {
        map.setZoom(8);
        map.setCenter(marker.getPosition());
    });

    // Add center changed listener
    map.addListener("center_changed", () => {
        window.setTimeout(() => {
            map.panTo(marker.getPosition());
        }, 3000);
    });

    // Show the map
    document.getElementById('map').classList.remove('hidden');
}

async function showCountryInfo(country) {
    // ...existing code...
    
    if (country.latlng && country.latlng.length === 2) {
        initializeMap(country.latlng[0], country.latlng[1]);
    }
    
    // ...existing code...
}

// Expose necessary functions to window
window.searchCountry = searchCountry;
window.addFavorite = addFavorite;
window.removeFavorite = removeFavorite;
window.initMap = initMap;