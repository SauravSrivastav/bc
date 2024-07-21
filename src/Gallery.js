import React, { useState } from 'react';
import { motion } from 'framer-motion';

const restaurantAreas = [
  { name: 'Main Dining Area', description: 'Experience the warmth of our spacious main dining hall, adorned with traditional Lucknowi decor.', image: 'main-dining.jpg' },
  { name: 'Rooftop Terrace', description: 'Enjoy your meal under the stars on our beautifully lit rooftop terrace.', image: 'rooftop.jpg' },
  { name: 'Private Dining Room', description: 'Host intimate gatherings in our luxurious private dining room.', image: 'private-room.jpg' },
  { name: 'Bar Lounge', description: 'Unwind in our stylish bar lounge, offering a wide selection of drinks and appetizers.', image: 'bar-lounge.jpg' },
  { name: 'Open Kitchen', description: 'Watch our chefs in action at our state-of-the-art open kitchen.', image: 'open-kitchen.jpg' },
];

const GalleryItem = ({ area, setActiveItem }) => (
  <motion.div
    className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
    whileHover={{ scale: 1.05 }}
    onClick={() => setActiveItem(area)}
  >
    <img 
      src={process.env.PUBLIC_URL + '/images/' + area.image} 
      alt={area.name}
      className="w-full h-64 object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50">
      <h3 className="text-xl text-white font-bold">{area.name}</h3>
    </div>
  </motion.div>
);

const Gallery = () => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a0e0b] to-[#8B0000] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center text-white mb-12">Experience Baba Chatore's Ambiance</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurantAreas.map((area, index) => (
            <GalleryItem key={index} area={area} setActiveItem={setActiveItem} />
          ))}
        </div>

        {activeItem && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveItem(null)}
          >
            <div className="bg-white rounded-lg p-8 max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <img 
                src={process.env.PUBLIC_URL + '/images/' + activeItem.image} 
                alt={activeItem.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-3xl font-bold mb-2">{activeItem.name}</h2>
              <p className="text-xl">{activeItem.description}</p>
              <button 
                className="mt-4 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setActiveItem(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Our Culinary Haven</h2>
          <p className="text-xl text-white mb-6">
            Step into the world of Baba Chatore, where every corner tells a story of Lucknow's rich culinary heritage. 
            Our restaurant is designed to transport you to the heart of Awadhi culture, combining traditional elegance with modern comfort.
          </p>
          <p className="text-xl text-white">
            From our grand main dining area to the intimate private dining room, every space is crafted to enhance your dining experience. 
            Explore our gallery and imagine yourself savoring the finest Awadhi cuisine in these beautiful surroundings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;