// Get listing data safely from data-* attributes
const listingCard = document.getElementById('listing-card');
const listingData = {
  title: listingCard.dataset.title,
  city: listingCard.dataset.city,
  country: listingCard.dataset.country
};

async function initMap() {
  const { title, city, country } = listingData;

  if (!city || !country) {
    console.error("City or country is missing");
    return;
  }

  try {
    // Geocode city + country using OpenStreetMap Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ' ' + country)}`
    );
    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("Location not found");
      return;
    }

    const { lat, lon } = data[0];

    // Initialize Leaflet map
    const map = L.map("map").setView([lat, lon], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add a marker with a popup
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${city}, ${country}`)
      .openPopup();

  } catch (err) {
    console.error("Error loading map:", err);
  }
}

// Run the map
initMap();

