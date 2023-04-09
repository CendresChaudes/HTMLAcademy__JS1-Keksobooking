const advertisementCardTemplate = document.querySelector('#card').content.querySelector('.popup');

const getPriceInfo = (price) => price ? `${price} <span>₽/ночь</span>` : '';

const getTypeInfo = (type) => {
  switch (type) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    case 'bungalow':
      return 'Бунгало';
    case 'hotel':
      return 'Отель';
    default:
      return '';
  }
};

const getCapacityInfo = (rooms, guests) => {
  if (rooms !== 'undefined' && guests !== 'undefined') {
    return `${rooms} комнаты для ${guests} гостей`;
  }

  return '';
};

const getCheckinCheckoutInfo = (checkin, checkout) => {
  if (checkin !== 'undefined' && checkout !== 'undefined') {
    return `Заезд после ${checkin}, выезд до ${checkout}`;
  }

  return '';
};

const renderFeatures = (element, features) => {
  if (!features) {
    return;
  }

  const featuresList = element.querySelectorAll('.popup__feature');
  featuresList.forEach((item) => {
    const hasFeature = features.some((feature) => item.classList.contains(`popup__feature--${feature}`));
    if (!hasFeature) {
      item.remove();
    }
  });
};

const renderPhotos = (element, photos) => {
  const popupPhotoTemplate = element.querySelector('.popup__photo').cloneNode(true);
  const photosContainer = element.querySelector('.popup__photos');
  photosContainer.innerHTML = '';

  if (!photos) {
    photosContainer.append('');
    return;
  }

  photos.forEach((photo) => {
    const popupPhoto = popupPhotoTemplate.cloneNode(true);
    popupPhoto.src = photo;
    photosContainer.append(popupPhoto);
  });
};

const createAdvertisementCard = ({author, offer}) => {
  const advertisementCard = advertisementCardTemplate.cloneNode(true);
  advertisementCard.querySelector('.popup__avatar').src = author.avatar ?? '';
  advertisementCard.querySelector('.popup__title').textContent = offer.title ?? '';
  advertisementCard.querySelector('.popup__text--address').textContent = offer.address ?? '';
  advertisementCard.querySelector('.popup__text--price').innerHTML = getPriceInfo(offer.price);
  advertisementCard.querySelector('.popup__type').textContent = getTypeInfo(offer.type);
  advertisementCard.querySelector('.popup__text--capacity').textContent = getCapacityInfo(offer.rooms, offer.guests);
  advertisementCard.querySelector('.popup__text--time').textContent = getCheckinCheckoutInfo(offer.checkin, offer.checkout);
  advertisementCard.querySelector('.popup__description').textContent = offer.description ?? '';
  renderFeatures(advertisementCard, offer.features);
  renderPhotos(advertisementCard, offer.photos);

  return advertisementCard;
};

export { createAdvertisementCard };
