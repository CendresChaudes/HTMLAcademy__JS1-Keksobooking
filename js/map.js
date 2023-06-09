import { getData } from './data.js';
import { activateForms } from './forms.js';
import { createAdvertisementCard } from './similar-advertisements.js';
import { createErrorMessage } from './map-message.js';
import { initFilters } from './map-filters.js';

const MAP_DEFAULT_SETUP = {
  lat: 35.67240,
  lng: 139.75266,
  scale: 13
};

const COORDINATES_PRECISION = 5;
const GET_DATA_URL = 'https://27.javascript.pages.academy/keksobooking/data';
const DATA_RANGE_START = 0;
const DATA_RANGE_END = 10;

const MarkerSetups = {
  MAIN: {
    size: 52,
    url: 'img/main-pin.svg',
    isDraggable: true,
    type: 'MAIN'
  },
  SIMILAR: {
    size: 40,
    url: 'img/pin.svg',
    isDraggable: false,
    type: 'SIMILAR'
  }
};

const addressInput = document.querySelector('#address');

const map = L.map('map-canvas');
const markerGroup = L.layerGroup().addTo(map);
const mainMarker = createMarker(MAP_DEFAULT_SETUP.lat, MAP_DEFAULT_SETUP.lng, MarkerSetups.MAIN.url, MarkerSetups.MAIN.isDraggable, MarkerSetups.MAIN.type);

const resetMap = () => {
  mainMarker.setLatLng({
    lat: MAP_DEFAULT_SETUP.lat,
    lng: MAP_DEFAULT_SETUP.lng,
  });

  map.setView({
    lat: MAP_DEFAULT_SETUP.lat,
    lng: MAP_DEFAULT_SETUP.lng,
  }, MAP_DEFAULT_SETUP.scale);

  map.closePopup();
};

function createPin (url, type) {
  const pin = L.icon({
    iconUrl: url,
    iconSize: [MarkerSetups[type].size, MarkerSetups[type].size],
    iconAnchor: [MarkerSetups[type].size / 2, MarkerSetups[type].size],
  });

  return pin;
}

function createMarker (lat, lng, url, isDraggable, type, item = null) {
  const marker = L.marker(
    {
      lat,
      lng
    },
    {
      draggable: isDraggable,
      icon: createPin(url, type),
    },
  );

  if (type === MarkerSetups.MAIN.type) {
    marker.on('moveend', (evt) => {
      addressInput.value = `${evt.target.getLatLng().lat.toFixed(COORDINATES_PRECISION)}, ${evt.target.getLatLng().lng.toFixed(COORDINATES_PRECISION)}`;
    });
  }

  if (type === MarkerSetups.SIMILAR.type) {
    marker.bindPopup(createAdvertisementCard(item));
  }

  return marker;
}

const renderMainMarker = () => mainMarker.addTo(map);

const renderSimilarAdvertisementMarkers = (data) => {
  data.forEach((item) => createMarker(item.location.lat, item.location.lng, MarkerSetups.SIMILAR.url, MarkerSetups.SIMILAR.isDraggable, MarkerSetups.SIMILAR.type, item)
    .addTo(markerGroup));
};

const clearSimilarAdvertisementMarkers = () => markerGroup.clearLayers();

const initMapModule = (data) => {
  map.on('load', activateForms)
    .setView({
      lat: MAP_DEFAULT_SETUP.lat,
      lng: MAP_DEFAULT_SETUP.lng,
    }, MAP_DEFAULT_SETUP.scale);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors |
      Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>`,
    },
  ).addTo(map);

  renderMainMarker(map);
  renderSimilarAdvertisementMarkers(data.slice(DATA_RANGE_START, DATA_RANGE_END));
};

const onGetDataSuccess = (data) => {
  initMapModule(data);
  initFilters(data);
};

const onGetDataFail = () => {
  createErrorMessage();
};

const getAdvertisementsData = () => getData(GET_DATA_URL, onGetDataSuccess, onGetDataFail);

export { getAdvertisementsData, resetMap, renderSimilarAdvertisementMarkers, clearSimilarAdvertisementMarkers };
