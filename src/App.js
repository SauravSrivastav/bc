import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
          opacity: { value: 0.1, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.1, width: 1 },
          move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    }
  }, []);

  return <div id="particles-js" className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true"></div>;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen" aria-label="Loading">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
  </div>
);

// Header Component
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 bg-opacity-90">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-bold text-yellow-500">Baba Chatore</Link>
          <div className="hidden md:flex space-x-4">
            {['Home', 'About', 'Menu', 'Gallery', 'Locate'].map((item) => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white hover:text-yellow-500 transition">
                {item}
              </Link>
            ))}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 bg-opacity-90"
          >
            {['Home', 'About', 'Menu', 'Gallery', 'Locate'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="block px-4 py-2 text-white hover:bg-gray-800 transition"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Hero Component
function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    `${process.env.PUBLIC_URL}/images/Lucknow.jpg`,
    `${process.env.PUBLIC_URL}/images/1520146564108.jpeg`,
    `${process.env.PUBLIC_URL}/images/juice.png`,
    `${process.env.PUBLIC_URL}/images/about.png`,
    `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {backgroundImages.map((img, index) => (
        <motion.div
          key={img}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
          transition={{ duration: 1 }}
          style={{ backgroundImage: `url(${img})` }}
          aria-hidden={index !== currentImageIndex}
        />
      ))}
      
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-20 max-w-3xl mx-auto text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white"
        >
          BABA CHATORE
        </motion.h1>
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 text-yellow-400"
        >
          Lucknow's Renowned Cuisine
        </motion.h2>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg sm:text-xl mb-8 text-white"
        >
          Open 24 Hours<br />We Deliver Anywhere in Lucknow<br />Order Now: +91 7838231467
        </motion.p>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/menu" className="bg-yellow-500 text-white px-8 py-3 rounded-full text-lg hover:bg-yellow-600 transition duration-300 inline-block">
            Explore Menu
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto flex justify-center space-x-8">
          {['Open 24/7', 'Free Delivery', 'Online Booking'].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <div className="text-yellow-400 text-2xl mb-1" aria-hidden="true">
                {index === 0 ? '🕒' : index === 1 ? '🚚' : '💻'}
              </div>
              <div className="text-white text-sm">{item}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Us Component
function AboutUs() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">About Baba Chatore</h2>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 sm:p-8">
          <p className="text-base sm:text-lg mb-4">
            For over 40 years, Baba Chatore has been the heart of Lucknow's culinary scene, serving authentic Awadhi cuisine with a modern twist.
          </p>
          <p className="text-base sm:text-lg mb-4">
            Our journey began in the narrow lanes of old Lucknow, and today we continue to delight food lovers with our signature dishes and warm hospitality.
          </p>
          <div className="text-center mt-6">
            <Link to="/about" className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
// Detailed About Us Component
function DetailedAboutUs() {
  const [activeSection, setActiveSection] = useState(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  const timelineEvents = [
    { year: 1980, event: "Baba Chatore ki shuruaat", icon: "🏠" },
    { year: 1990, event: "Pehla expansion: Hazratganj mein naya outlet", icon: "🏙️" },
    { year: 2000, event: "Lucknow Food Festival mein 'Best Kebab' award", icon: "🏆" },
    { year: 2010, event: "Online delivery service ki shuruaat", icon: "🚚" },
    { year: 2020, event: "40 saal pure, naye fusion menu ka launch", icon: "🎉" }
  ];

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-[#4a0e0b] to-[#8B0000]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Baba Chatore Ki Kahani
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg mb-6 text-white">
              1980 se lekar aaj tak, Baba Chatore Lucknow ke dil mein Awadhi cuisine ka ek behtareen namuna raha hai. Humari journey purane Lucknow ki galiyon se shuru hui, jahan Tunday Kebab aur Lucknowi Biryani ki khushbu hawa mein tairti thi.
            </p>
            <p className="text-lg mb-6 text-white">
              Aaj, 40+ saal baad, hum wohi purani recipes aur techniques ke saath naye experiments bhi karte hain, taaki har customer ko ek unique dining experience mile.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  delayChildren: 0.3,
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate={controls}
          >
            <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Humari Journey</h3>
            <div className="space-y-4">
              {timelineEvents.map((event) => (
                <motion.div
                  key={event.year}
                  className={`flex items-center cursor-pointer p-2 rounded-lg transition-all duration-300 ${activeSection === event.year ? 'bg-yellow-500 bg-opacity-20' : ''}`}
                  onClick={() => setActiveSection(event.year)}
                  whileHover={{ scale: 1.05 }}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1
                    }
                  }}
                >
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mr-4 text-2xl" aria-hidden="true">
                    {event.icon}
                  </div>
                  <div>
                    <span className="font-bold text-yellow-400">{event.year}</span>
                    <p className="text-white">{event.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {activeSection && (
          <motion.div 
            className="mb-16 bg-white bg-opacity-20 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">{activeSection}</h3>
            <p className="text-lg text-white">{timelineEvents.find(e => e.year === activeSection).event}</p>
          </motion.div>
        )}

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Humari Specialties</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Tunday Kebab', 'Lucknowi Biryani', 'Galawati Kebab', 'Kakori Kebab', 'Sheermal'].map((dish) => (
              <motion.div
                key={dish}
                className="bg-white bg-opacity-10 px-4 py-2 rounded-full text-white"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {dish}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Animated Recipe Card Component
function AnimatedRecipeCard({ dish, ingredients }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-64 h-80 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div 
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-4">
          <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded-lg mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">{dish.name}</h3>
          <p className="text-gray-600">{dish.description}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-yellow-400 rounded-lg shadow-lg p-4" style={{ transform: 'rotateY(180deg)' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
          <ul className="text-gray-700">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// Today's Specials Component
function TodaysSpecials() {
  const specials = [
    {
      dish: {
        name: 'Dosa',
        description: 'Crispy South Indian crepe made from fermented rice and lentil batter.',
        image: `${process.env.PUBLIC_URL}/images/dosa.jpg`
      },
      ingredients: ['Rice', 'Lentils', 'Fenugreek Seeds', 'Salt']
    },
    {
      dish: {
        name: 'Chaat',
        description: 'A savory snack originating from India, typically served as a hors d\'oeuvre.',
        image: `${process.env.PUBLIC_URL}/images/chaat.jpg`
      },
      ingredients: ['Chickpeas', 'Potatoes', 'Onions', 'Tamarind Chutney', 'Yogurt']
    },
    {
      dish: {
        name: 'Pizza',
        description: 'Our signature pizza with a blend of Indian and Italian flavors.',
        image: `${process.env.PUBLIC_URL}/images/pizza.jpg`
      },
      ingredients: ['Naan Bread', 'Tomato Sauce', 'Mozzarella', 'Tandoori Chicken', 'Bell Peppers']
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#4a0e0b] to-[#8B0000]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Today's Specials</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {specials.map((special, index) => (
            <AnimatedRecipeCard key={index} dish={special.dish} ingredients={special.ingredients} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-yellow-500">Baba Chatore</h3>
            <p className="text-gray-400">Global Cuisine Experience</p>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-500">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Menu', 'Gallery', 'Locate'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-yellow-500 transition">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-500">Contact Us</h4>
            <p className="text-gray-400">AIROOMS Girls Hostel, Plot No-37/38,</p>
            <p className="text-gray-400">Hasemau Near, Left Lane from Petrol Pump,</p>
            <p className="text-gray-400">4, Amity University Rd, Uttar Pradesh 226010, India</p>
            <p className="text-gray-400">Phone: +91 7838231467</p>
            <p className="text-gray-400">Email: info@babachatore.com</p>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-500">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                { name: 'Facebook', url: 'https://facebook.com' },
                { name: 'Instagram', url: 'https://instagram.com' },
                { name: 'Twitter', url: 'https://twitter.com' }
              ].map((item) => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-yellow-500 transition">
                  {item.name.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 Baba Chatore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}


// Interactive Gallery Component
function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Indoor');
  const scrollRef = useRef(null);

  const galleryImages = [
    { src: `${process.env.PUBLIC_URL}/images/1520146564108.jpeg`, alt: 'Baba Chatore Ambiance', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/about.png`, alt: 'About Baba Chatore', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/chaat.jpg`, alt: 'Delicious Chaat', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/dosa.jpg`, alt: 'Crispy Dosa', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/juice.png`, alt: 'Fresh Juices', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/Lucknow.jpg`, alt: 'Lucknow City', category: 'Outdoor' },
    { src: `${process.env.PUBLIC_URL}/images/pizza.jpg`, alt: 'Fusion Pizza', category: 'Indoor' },
    { src: `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`, alt: 'Famous Tunday Kebab', category: 'Indoor' },
  ];

  const categories = ['Indoor', 'Outdoor'];

  const filteredImages = galleryImages.filter(img => img.category === activeCategory);

  const handleClick = (image, index) => {
    setCurrentIndex(index);
    setSelectedImage(image);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImage) {
        if (event.key === 'ArrowRight') {
          handleNext();
        } else if (event.key === 'ArrowLeft') {
          handlePrev();
        } else if (event.key === 'Escape') {
          setSelectedImage(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, currentIndex]);

  return (
    <section className="py-20 bg-gradient-to-b from-[#4a0e0b] to-[#8B0000] min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center text-white-400">Culinary Gallery</h2>
        
        <div className="flex justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 mx-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10 text-white"
            onClick={() => scroll(-300)}
            aria-label="Scroll left"
          >
            &#9664;
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 py-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                className="flex-none w-72 h-96 relative rounded-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleClick(image, index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                  <p className="text-white text-lg font-semibold">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10 text-white"
            onClick={() => scroll(300)}
            aria-label="Scroll right"
          >
            &#9654;
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.p
              className="absolute bottom-4 left-0 right-0 text-center text-white text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              {selectedImage.alt}
            </motion.p>
            <button onClick={handlePrev} className="absolute left-4 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full" aria-label="Previous image">&lt;</button>
            <button onClick={handleNext} className="absolute right-4 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full" aria-label="Next image">&gt;</button>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full" aria-label="Close gallery">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Welcome Modal Component
function WelcomeModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-[#4a0e0b] to-[#8B0000] p-8 rounded-lg max-w-md w-full text-center shadow-2xl"
      >
        <motion.h2
          animate={{ 
            scale: [1, 1.05, 1],
            color: ['#FFA500', '#FFD700', '#FFA500']
          }}
          transition={{ 
            scale: { repeat: Infinity, duration: 2 },
            color: { repeat: Infinity, duration: 3 }
          }}
          className="text-4xl font-bold mb-4"
        >
          Welcome to Baba Chatore
        </motion.h2>
        <p className="text-white text-lg mb-6">Embark on a futuristic culinary journey like no other!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 text-lg font-semibold"
        >
          Let's Explore
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Locate Component
function Locate() {
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const address = "AIROOMS Girls Hostel, Plot No-37/38, Hasemau Near, Left Lane from Petrol Pump, 4, Amity University Rd, Uttar Pradesh 226010, India";
  const mapCenter = [26.8467, 80.9462]; // Lucknow coordinates

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGlobeClick = () => {
    setShowInfo(!showInfo);
  };

  const handleDirectionsClick = () => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a0e0b] to-[#8B0000] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-black bg-opacity-70 p-8 rounded-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">Find Baba Chatore in Lucknow</h1>
        
        <div className="flex flex-col lg:flex-row mb-12 items-start">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <p className="text-white text-lg mb-6">Experience the heart of Lucknowi cuisine at Baba Chatore. Our restaurant is nestled in the bustling streets of Aminabad, where tradition meets culinary excellence.</p>
            <div className="flex justify-center space-x-8 mb-6">
              {[
                { icon: '🍽️', text: 'Authentic Flavors' },
                { icon: '🏛️', text: 'Historic Location' },
                { icon: '🌟', text: 'Unforgettable Experience' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2" aria-hidden="true">{item.icon}</div>
                  <div className="text-white">{item.text}</div>
                </div>
              ))}
            </div>
            <div className="h-64 sm:h-96 relative">
            {isMobile ? (
              <Globe2D onClick={handleGlobeClick} />
            ) : (
              <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Globe onClick={handleGlobeClick} />
                <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
                <Stars />
              </Canvas>
            )}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
                Click the globe to reveal our location!
              </p>
            </div>
          </div>
          </div>
          
          <AnimatePresence>
            {showInfo ? (
              <motion.div
                className="w-full lg:w-1/2 lg:pl-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="bg-black bg-opacity-50 rounded-lg p-6">
                  <h2 className="text-3xl font-bold mb-6 text-yellow-500">Our Location</h2>
                  <p className="text-white mb-4">{address}</p>
                  <p className="text-white mb-6">Open 24/7 | Phone: +91 7838231467</p>
                  <motion.button
                    onClick={handleDirectionsClick}
                    className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-400 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Directions
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="w-full lg:w-1/2 lg:pl-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-black bg-opacity-50 rounded-lg p-6">
                  <h2 className="text-3xl font-bold mb-6 text-yellow-500">Discover Our Location</h2>
                  <p className="text-white mb-6">Click on the globe to reveal our exact location and get directions to culinary bliss!</p>
                  <ul className="text-white list-disc list-inside">
                    <li>Central location in Aminabad</li>
                    <li>Easy access from major landmarks</li>
                    <li>Ample parking available nearby</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-500 pt-6">Find Us on the Map</h2>
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCenter}>
                <Popup>
                  Baba Chatore<br />
                  {address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Menu Component
function Menu() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState('80vh');

  useEffect(() => {
    const updateIframeSize = () => {
      const height = window.innerHeight * 0.8;
      setIframeHeight(`${height}px`);
    };

    window.addEventListener('resize', updateIframeSize);
    updateIframeSize();

    return () => window.removeEventListener('resize', updateIframeSize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0505] to-[#4a0e0b] flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Menu
      </motion.h1>
      
      {isLoading && (
        <motion.div 
          className="text-white text-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading our delicious menu...
        </motion.div>
      )}

      <motion.div 
        className="w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <iframe
          src="https://online.anyflip.com/tdviq/yqig/index.html"
          width="100%"
          height={iframeHeight}
          style={{
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
          title="Baba Chatore Menu"
          seamless="seamless"
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          onLoad={() => setIsLoading(false)}
        />
      </motion.div>
    </div>
  );
}

// Globe Component
const Globe = ({ onClick }) => {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/images/earth.jpg`);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} onClick={onClick}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

//Globe Component
// const Globe = ({ onClick }) => {
//   const meshRef = useRef();
//   const [texture, setTexture] = useState(null);

//   useEffect(() => {
//     const loader = new TextureLoader();
//     loader.load(`${process.env.PUBLIC_URL}/images/earth.jpg`, 
//       (loadedTexture) => {
//         setTexture(loadedTexture);
//       }, 
//       undefined, 
//       (error) => {
//         console.error('An error occurred while loading the texture:', error);
//       }
//     );
//   }, []);

//   useFrame((state) => {
//     if (meshRef.current) {
//       const t = state.clock.getElapsedTime();
//       meshRef.current.rotation.y = t * 0.2;
//     }
//   });

//   if (!texture) {
//     return (
//       <mesh ref={meshRef} onClick={onClick}>
//         <sphereGeometry args={[1.5, 64, 64]} />
//         <meshStandardMaterial color="blue" /> {/* Fallback color */}
//       </mesh>
//     );
//   }

//   return (
//     <mesh ref={meshRef} onClick={onClick}>
//       <sphereGeometry args={[1.5, 64, 64]} />
//       <meshStandardMaterial map={texture} />
//     </mesh>
//   );
// };

function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
      <TodaysSpecials />
    </>
  );
}

const Globe2D = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="w-48 h-48 rounded-full bg-blue-500 cursor-pointer mx-auto"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/earth.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  />
);

// Main App Component
function App() {
  const [showModal, setShowModal] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setShowModal(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="font-sans bg-gradient-to-br from-[#4a0e0b] to-[#8B0000] text-white min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <ParticleBackground />
          <div className="relative z-10">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<DetailedAboutUs />} />
              <Route path="/gallery" element={<InteractiveGallery />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/locate" element={<Locate />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <AnimatePresence>
              {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
          </div>
        </Suspense>
      </div>
    </Router>
  );
}


export default App;