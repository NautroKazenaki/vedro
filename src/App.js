import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import photoToPreview1 from './photos/vedro1/CLR_1.jpg';
import photoToPreview2 from './photos/vedro2/CLR_1.jpg';
import photoToPreview3 from './photos/vedro3/CLR_1.jpg';
import photoToPreview4 from './photos/vedro4/CLR_1.jpg';
import photoToPreview5 from './photos/vedro5/CLR_1.jpg';
import photoToPreview6 from './photos/vedro6/CLR_1.jpg';
import photoToPreview7 from './photos/vedro7/CLR_1.jpg';
import photoToPreview8 from './photos/vedro8/CLR_1.jpg';
import photoToPreview9 from './photos/vedro9/CLR_1.jpg';
import photoToPreview10 from './photos/vedro10/CLR_1.jpg';


// Настройки для главного слайдера коллекций
const settingsMainSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 10,
  slidesToScroll: 1,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 8,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
};

// Настройки для слайдера коллекции фотографий
const settingsPhotoSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

function App() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Задаем 10 фотографий, по одной для каждой коллекции (на слайдер выбора коллекций)
  const mainPhotos = [
    photoToPreview1,
    photoToPreview2,
    photoToPreview3,
    photoToPreview4,
    photoToPreview5,
    photoToPreview6,
    photoToPreview7,
    photoToPreview8,
    photoToPreview9,
    photoToPreview10
  ];

  // Функция для загрузки фотографий коллекции
  const loadPhotos = (folder) => {
    const loadedPhotos = [];
    let i = 1;
    while (true) {
      try {
        const photoPath = require(`./photos/${folder}/CLR_${i}.jpg`);
        loadedPhotos.push(photoPath);
        i++;
      } catch (e) {
        break; // Когда больше фотографий нет, выходим из цикла
      }
    }
    return loadedPhotos;
  };

  // Когда пользователь кликает на коллекцию, загружаем соответствующие фотографии
  const handleCollectionClick = (index) => {
    const folder = `vedro${index + 1}`;
    const loadedPhotos = loadPhotos(folder);
    setSelectedCollection(folder);
    setPhotos(loadedPhotos);
  };

  return (
    <div className="AppContainer">
      {/* Первый блок: бесконечный текст */}
      <div className="TitleBar">
        <ul style={{ '--time': '48s', '--quantity': 16 }}>
          {[...Array(16)].map((_, i) => (
            <li key={i} style={{ '--index': i + 1 }}>Лёша Ведро</li>
          ))}
        </ul>
      </div>

      {/* Второй блок: слайдер для выбора коллекции */}
      <div className="CollectionSlider">
        <Slider {...settingsMainSlider}>
          {mainPhotos.map((photo, index) => (
            <div key={index} className="PhotoItem" onClick={() => handleCollectionClick(index)}>
              <img src={photo} alt={`Коллекция ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Третий блок: слайдер для отображения фотографий выбранной коллекции */}
      <div className="PhotoSlider">
        {photos.length > 0 ? (
          <Slider {...settingsPhotoSlider}>
            {photos.map((photo, index) => (
              <div key={index} className='mainPhotos'>
                <img src={photo} alt={`Фото ${index + 1}`} className="responsive-image" />
              </div>
            ))}
          </Slider>
        ) : (
          <p>Выберите коллекцию для отображения фотографий</p>
        )}
      </div>
    </div>
  );
}

export default App;
