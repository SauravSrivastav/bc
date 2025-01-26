import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import MenuDocument from './components/MenuPDF';
import { Users, Cake, Utensils, GraduationCap, X, ImageOff } from 'lucide-react';

// Image component with fallback handling
const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
      {error && loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
          <ImageOff className="w-12 h-12 text-primary/50 mb-2" />
          <p className="text-sm text-primary/50">Image not available</p>
        </div>
      )}
    </div>
  );
};

const services = [
  {
    id: 1,
    title: 'Birthday Celebrations',
    description: 'Make your special day unforgettable with our exclusive birthday celebration packages. We create magical moments with customized decorations, special menus, and personalized service.',
    icon: Cake,
    image: `${process.env.PUBLIC_URL}/images/birthday.jpeg`,
    fallbackImage: `${process.env.PUBLIC_URL}/images/1520146564108.jpeg`,
    category: 'celebrations',
    tags: ['Custom Theme', 'Live Music', 'Photo Booth'],
    features: [
      'Customized cake arrangements',
      'Themed decorations',
      'Special group menus',
      'Professional event coordination'
    ],
    pricing: {
      starting: 999,
      packages: [
        { name: 'Basic', price: 999 },
        { name: 'Premium', price: 1999 }
      ]
    },
    availability: {
      daysInAdvance: 7,
      maxGuests: 200
    },
    gallery: [
      `${process.env.PUBLIC_URL}/images/birthday.jpeg`,
      `${process.env.PUBLIC_URL}/images/indoor-1.jpeg`,
      `${process.env.PUBLIC_URL}/images/about.png`,
      `${process.env.PUBLIC_URL}/images/chaat.jpg`,
      `${process.env.PUBLIC_URL}/images/dosa.jpg`,
      `${process.env.PUBLIC_URL}/images/pizza.jpg`
    ]
  },
  {
    id: 2,
    title: 'Kitty Parties',
    description: 'Host the perfect kitty party with our specially curated menus and elegant ambiance. We ensure your gathering is both sophisticated and enjoyable.',
    icon: Users,
    image: `${process.env.PUBLIC_URL}/images/indoor-1.jpeg`,
    fallbackImage: `${process.env.PUBLIC_URL}/images/about.png`,
    category: 'celebrations',
    tags: ['Exclusive Area', 'Custom Menu', 'Entertainment'],
    features: [
      'Exclusive party area',
      'Special group menus',
      'Customized decorations',
      'Entertainment options',
      'Flexible timing slots',
      'Complimentary mocktails'
    ],
    pricing: {
      starting: 799,
      packages: [
        { name: 'Basic', price: 799 },
        { name: 'Premium', price: 1499 }
      ]
    },
    availability: {
      daysInAdvance: 5,
      maxGuests: 50
    },
    gallery: [
      `${process.env.PUBLIC_URL}/images/indoor-1.jpeg`,
      `${process.env.PUBLIC_URL}/images/about.png`,
      `${process.env.PUBLIC_URL}/images/Lucknow.jpg`,
      `${process.env.PUBLIC_URL}/images/juice.png`,
      `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`,
      `${process.env.PUBLIC_URL}/images/chaat.jpg`
    ]
  },
  {
    id: 3,
    title: 'Catering Services',
    description: 'From intimate gatherings to grand events, our catering service brings the authentic taste of Lucknow to your doorstep.',
    icon: Utensils,
    image: `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`,
    fallbackImage: `${process.env.PUBLIC_URL}/images/chaat.jpg`,
    category: 'catering',
    tags: ['Custom Menu', 'Professional Staff', 'Setup Included'],
    features: [
      'Customized menus',
      'Professional staff',
      'Complete setup and service',
      'Quality assurance'
    ],
    pricing: {
      starting: 299,
      packages: [
        { name: 'Basic', price: 299 },
        { name: 'Premium', price: 599 }
      ]
    },
    availability: {
      daysInAdvance: 3,
      maxGuests: 1000
    },
    gallery: [
      `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`,
      `${process.env.PUBLIC_URL}/images/chaat.jpg`,
      `${process.env.PUBLIC_URL}/images/pizza.jpg`,
      `${process.env.PUBLIC_URL}/images/dosa.jpg`,
      `${process.env.PUBLIC_URL}/images/juice.png`,
      `${process.env.PUBLIC_URL}/images/indoor-1.jpeg`
    ]
  },
  {
    id: 4,
    title: 'College/School Catering',
    description: 'Special catering services designed for educational institutions. We offer nutritious and delicious meals perfect for large groups.',
    icon: GraduationCap,
    image: `${process.env.PUBLIC_URL}/images/juice.png`,
    fallbackImage: `${process.env.PUBLIC_URL}/images/dosa.jpg`,
    category: 'corporate',
    tags: ['Bulk Orders', 'Nutritious', 'Quick Service'],
    features: [
      'Bulk order capacity',
      'Nutritious meal plans',
      'Quick service system',
      'Special student packages',
      'Regular menu rotation',
      'Hygiene certified'
    ],
    pricing: {
      starting: 199,
      packages: [
        { name: 'Basic', price: 199 },
        { name: 'Premium', price: 399 }
      ]
    },
    availability: {
      daysInAdvance: 2,
      maxGuests: 2000
    },
    gallery: [
      `${process.env.PUBLIC_URL}/images/juice.png`,
      `${process.env.PUBLIC_URL}/images/dosa.jpg`,
      `${process.env.PUBLIC_URL}/images/chaat.jpg`,
      `${process.env.PUBLIC_URL}/images/pizza.jpg`,
      `${process.env.PUBLIC_URL}/images/tunday-kebab.jpg`,
      `${process.env.PUBLIC_URL}/images/indoor-1.jpeg`
    ]
  }
];

// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 30, density: { enable: true, value_area: 800 } },
          color: { value: "#64748b" },
          shape: { type: "circle" },
          opacity: { value: 0.05, random: true },
          size: { value: 2, random: true },
          line_linked: { enable: true, distance: 150, color: "#64748b", opacity: 0.05, width: 1 },
          move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "none" }, onclick: { enable: false }, resize: true },
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
    <div className="loading-spinner"></div>
  </div>
);

// Header Component
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['Home', 'About', 'Services', 'Menu', 'Gallery', 'Locate'];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-bold text-accent font-display">Baba Chatore</Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="text-primary/80 hover:text-accent transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border"
          >
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="block px-4 py-3 text-primary/80 hover:text-accent hover:bg-background-light transition-colors duration-200"
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
      
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]"></div>
      
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-accent">
            BABA CHATORE
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary">
            Lucknow's Renowned Cuisine
          </h2>
          <p className="text-lg sm:text-xl text-primary/90 space-y-2">
            <span className="block">Open 24 Hours</span>
            <span className="block">We Deliver Anywhere in Lucknow</span>
            <span className="block">Order Now: +91 7838231467</span>
          </p>
          <div className="pt-4">
            <Link 
              to="/menu" 
              className="bg-accent hover:bg-accent-600 text-background px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Explore Menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent backdrop-blur-sm">
        <div className="container mx-auto flex justify-center space-x-12">
          {[
            { icon: '🕒', text: 'Open 24/7', desc: 'Always at your service' },
            { icon: '🚚', text: 'Free Delivery', desc: 'Within Lucknow city' },
            { icon: '💻', text: 'Online Booking', desc: 'Quick & easy reservations' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <div className="text-4xl mb-2" aria-hidden="true">{item.icon}</div>
              <div className="text-accent font-medium">{item.text}</div>
              <div className="text-primary/70 text-sm">{item.desc}</div>
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">About Baba Chatore</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            A legacy of authentic flavors, crafted with passion and tradition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-primary mb-4">Our Journey</h3>
              <p className="text-primary/80">
                For over 40 years, Baba Chatore has been the heart of Lucknow's culinary scene, serving authentic Awadhi cuisine with a modern twist.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-primary mb-4">Our Philosophy</h3>
              <p className="text-primary/80">
                Our journey began in the narrow lanes of old Lucknow, and today we continue to delight food lovers with our signature dishes and warm hospitality.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { title: 'Authentic Recipes', icon: '👨‍🍳', desc: 'Traditional preparation methods' },
              { title: 'Fresh Ingredients', icon: '🌿', desc: 'Locally sourced produce' },
              { title: 'Expert Chefs', icon: '🏆', desc: 'Masters of Awadhi cuisine' },
              { title: 'Modern Ambiance', icon: '✨', desc: 'Contemporary dining experience' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg border border-border hover:border-accent/20 transition-colors duration-200"
              >
                <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                <h4 className="text-lg font-semibold text-primary mb-2">{item.title}</h4>
                <p className="text-primary/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 bg-accent/10 hover:bg-accent/20 text-accent px-6 py-3 rounded-full transition-colors duration-200"
          >
            <span>Learn More About Us</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
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
    { year: 1980, event: "Baba Chatore ki shuruaat", icon: "🏠", description: "Our journey began in the heart of Lucknow" },
    { year: 1990, event: "Pehla expansion: Hazratganj mein naya outlet", icon: "🏙️", description: "First expansion into Hazratganj" },
    { year: 2000, event: "Lucknow Food Festival mein 'Best Kebab' award", icon: "🏆", description: "Recognition for our culinary excellence" },
    { year: 2010, event: "Online delivery service ki shuruaat", icon: "🚚", description: "Embracing modern convenience" },
    { year: 2020, event: "40 saal pure, naye fusion menu ka launch", icon: "🎉", description: "Celebrating 40 years with innovation" }
  ];

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            Baba Chatore Ki Kahani
          </h1>
          <p className="text-primary/80 max-w-2xl mx-auto">
            A legacy of authentic flavors, crafted with passion and tradition since 1980
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
              <p className="text-lg text-primary/90">
                1980 se lekar aaj tak, Baba Chatore Lucknow ke dil mein Awadhi cuisine ka ek behtareen namuna raha hai. Humari journey purane Lucknow ki galiyon se shuru hui, jahan Tunday Kebab aur Lucknowi Biryani ki khushbu hawa mein tairti thi.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
              <p className="text-lg text-primary/90">
                Aaj, 40+ saal baad, hum wohi purani recipes aur techniques ke saath naye experiments bhi karte hain, taaki har customer ko ek unique dining experience mile.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  delayChildren: 0.3,
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate={controls}
          >
            {timelineEvents.map((event) => (
              <motion.div
                key={event.year}
                className={`bg-white/5 backdrop-blur-sm rounded-lg border transition-all duration-200 ${
                  activeSection === event.year 
                    ? 'border-accent shadow-lg' 
                    : 'border-border hover:border-accent/50'
                }`}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <button
                  onClick={() => setActiveSection(event.year)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-2xl">
                      {event.icon}
                    </div>
                    <div>
                      <span className="text-accent font-bold">{event.year}</span>
                      <p className="text-primary/90 font-medium">{event.event}</p>
                      {activeSection === event.year && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-primary/70 mt-2"
                        >
                          {event.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold text-primary mb-8">Humari Specialties</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Tunday Kebab', icon: '🍖' },
              { name: 'Lucknowi Biryani', icon: '🍚' },
              { name: 'Galawati Kebab', icon: '🥘' },
              { name: 'Kakori Kebab', icon: '🍗' },
              { name: 'Sheermal', icon: '🥖' }
            ].map((dish) => (
              <motion.div
                key={dish.name}
                className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-border hover:border-accent/50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2" aria-hidden="true">{dish.icon}</span>
                <span className="text-primary/90">{dish.name}</span>
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
    <motion.div
      className="w-72 h-96 perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full backface-hidden bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">{dish.name}</h3>
          <p className="text-primary/80">{dish.description}</p>
        </div>
        <div 
          className="absolute w-full h-full backface-hidden bg-secondary/10 backdrop-blur-sm rounded-lg shadow-lg p-6" 
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h3 className="text-xl font-semibold text-primary mb-4">Ingredients</h3>
          <ul className="text-primary/80 space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Today's Specials Component
function TodaysSpecials() {
  const specials = [
    {
      name: 'Awadhi Biryani',
      description: 'Fragrant basmati rice layered with tender meat and aromatic spices, slow-cooked to perfection.',
      ingredients: ['Basmati Rice', 'Tender Meat', 'Saffron', 'Whole Spices', 'Ghee', 'Caramelized Onions']
    },
    {
      name: 'Galawati Kebab',
      description: 'Melt-in-your-mouth kebabs made with minced meat and secret blend of spices.',
      ingredients: ['Minced Meat', 'Traditional Spices', 'Raw Papaya', 'Caramelized Onions', 'Ghee']
    },
    {
      name: 'Shahi Tukda',
      description: 'Royal dessert made with bread soaked in saffron-infused milk and garnished with nuts.',
      ingredients: ['Bread', 'Milk', 'Saffron', 'Cardamom', 'Nuts', 'Sugar']
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-30">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Today's Specials</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Experience our chef's carefully curated selection of authentic Lucknowi delicacies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {specials.map((special, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full max-w-sm"
            >
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-accent/20 transition-colors duration-300 shadow-lg hover:shadow-xl p-6">
                <h3 className="text-2xl font-bold text-primary mb-3">{special.name}</h3>
                <p className="text-primary/80 mb-6">{special.description}</p>

                <div className="mb-4">
                  <h4 className="text-primary font-semibold mb-3">Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {special.ingredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-accent/10 text-accent"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary/5 hover:bg-primary/10 text-primary px-6 py-3 rounded-full transition-colors duration-200 group"
          >
            <span>View Full Menu</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-primary/5 backdrop-blur-sm border-t border-primary/10">
      <div className="relative overflow-hidden">
        {/* Animated accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_60s_linear_infinite]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-accent/20"
                style={{
                  width: `${50 + i * 20}%`,
                  height: `${50 + i * 20}%`,
                  top: '25%',
                  left: '25%',
                  borderRadius: '42% 38% 62% 49%',
                  transform: `rotate(${i * 60}deg)`,
                  animationDelay: `${-i * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Baba Chatore
              </h3>
              <p className="text-primary/70">Authentic Lucknowi Cuisine</p>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: 'fb' },
                  { name: 'Instagram', icon: 'ig' },
                  { name: 'Twitter', icon: 'tw' }
                ].map((item) => (
                  <motion.a
                    key={item.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://${item.name.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/60 hover:text-accent transition-colors duration-200"
                    aria-label={`Follow us on ${item.name}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
                      {item.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-primary">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Services', 'Menu', 'Gallery', 'Locate'].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      className="text-primary/70 hover:text-accent transition-colors duration-200 flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-primary">Contact Us</h4>
              <address className="not-italic text-primary/70 space-y-2">
                <p>AIROOMS Girls Hostel, Plot No-37/38,</p>
                <p>Hasemau Near, Left Lane from Petrol Pump,</p>
                <p>4, Amity University Rd, Uttar Pradesh 226010</p>
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className="text-accent hover:text-accent/90 transition-colors duration-200"
                >
                  <a href="tel:+917838231467">+91 7838231467</a>
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className="text-accent hover:text-accent/90 transition-colors duration-200"
                >
                  <a href="mailto:info@babachatore.com">info@babachatore.com</a>
                </motion.p>
              </address>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-primary">Opening Hours</h4>
              <div className="text-primary/70 space-y-2">
                <p>Monday - Sunday</p>
                <p className="font-medium text-accent">24 Hours</p>
                <p className="mt-4">Delivery Hours:</p>
                <p className="font-medium text-accent">11:00 AM - 11:00 PM</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-primary/10"
          >
            <div className="text-center text-primary/60">
              <p>&copy; {new Date().getFullYear()} Baba Chatore. All Rights Reserved.</p>
            </div>
          </motion.div>
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
    <section className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Culinary Gallery</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Explore our restaurant's ambiance and signature dishes through our visual journey
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-8 space-x-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                activeCategory === category
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-secondary/5 text-primary/70 hover:bg-secondary/10'
              }`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-3 rounded-full z-10 text-primary transition-colors duration-200"
            onClick={() => scroll(-300)}
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 py-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                className="flex-none w-72 h-96 relative rounded-lg overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleClick(image, index)}
              >
                <ImageWithFallback
                  src={image.src}
                  fallbackSrc={image.fallbackImage}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent group-hover:from-background/90 transition-colors duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-primary text-lg font-semibold">{image.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-3 rounded-full z-10 text-primary transition-colors duration-200"
            onClick={() => scroll(300)}
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-5xl w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
              >
                <p className="text-primary text-xl font-semibold bg-background/80 backdrop-blur-sm inline-block px-6 py-2 rounded-full">
                  {selectedImage.alt}
                </p>
              </motion.div>
              
              <div className="absolute top-4 right-4 space-x-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-background/80 hover:bg-background/90 backdrop-blur-sm text-primary p-2 rounded-full transition-colors duration-200"
                  aria-label="Close gallery"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none">
                <button
                  onClick={handlePrev}
                  className="bg-background/80 hover:bg-background/90 backdrop-blur-sm text-primary p-3 rounded-full transition-colors duration-200 pointer-events-auto"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="bg-background/80 hover:bg-background/90 backdrop-blur-sm text-primary p-3 rounded-full transition-colors duration-200 pointer-events-auto"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Menu Component
function Menu() {
  const [isLoading, setIsLoading] = useState(true);
  const iframeHeight = '800px';

  return (
    <section id="menu" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-accent mb-4">
            Our Menu
          </h2>
          <p className="text-primary/80 text-lg max-w-3xl mx-auto">
            Discover our carefully curated selection of authentic Awadhi dishes
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full bg-background/40 backdrop-blur-sm rounded-xl p-1"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src="https://online.anyflip.com/tdviq/yqig/index.html"
            width="100%"
            height={iframeHeight}
            style={{
              border: 'none',
              borderRadius: '12px',
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
    </section>
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
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-12">Find Baba Chatore in Lucknow</h1>
        
        <div className="flex flex-col lg:flex-row mb-12 items-start">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <p className="text-primary/90 text-lg mb-6">Experience the heart of Lucknowi cuisine at Baba Chatore. Our restaurant is nestled in the bustling streets of Aminabad, where tradition meets culinary excellence.</p>
            <div className="flex justify-center space-x-8 mb-6">
              {[
                { icon: '🍽️', text: 'Authentic Flavors' },
                { icon: '🏛️', text: 'Historic Location' },
                { icon: '🌟', text: 'Unforgettable Experience' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2" aria-hidden="true">{item.icon}</div>
                  <div className="text-primary/80">{item.text}</div>
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
                <p className="text-primary/90 bg-background/50 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
                  Click the globe to reveal our location!
                </p>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {showInfo ? (
              <motion.div
                className="w-full lg:w-1/2 lg:pl-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Our Location</h2>
                  <p className="text-primary/90 mb-4">{address}</p>
                  <p className="text-primary/90 mb-6">Open 24/7 | Phone: +91 7838231467</p>
                  <motion.button
                    onClick={handleDirectionsClick}
                    className="bg-secondary text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-secondary/90 transition duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Discover Our Location</h2>
                  <p className="text-primary/90 mb-6">Click on the globe to reveal our exact location and get directions to culinary bliss!</p>
                  <ul className="text-primary/80 list-disc list-inside">
                    <li>Central location in Aminabad</li>
                    <li>Easy access from major landmarks</li>
                    <li>Ample parking available nearby</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary pt-6">Find Us on the Map</h2>
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

// Animated Background Pattern Component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M0 32V0h32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/[0.05] animate-[dash 30s linear infinite]"
                strokeDasharray="2,4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(14,165,233,0.1),transparent)]" />
      </div>
      <div className="absolute inset-0 animate-[pulse_10s_ease-in-out_infinite]">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob"
            style={{
              backgroundColor: i === 0 ? '#0ea5e9' : i === 1 ? '#64748b' : '#1f2937',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${300 + Math.random() * 200}px`,
              height: `${300 + Math.random() * 200}px`,
              animationDelay: `${i * 2}s`,
              transform: `translate(-50%, -50%) scale(${0.5 + Math.random() * 0.5})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Quick Booking Form Component
const BookingForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    date: '',
    guests: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Booking submitted:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">Date</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10"
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Number of Guests</label>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10"
          value={formData.guests}
          onChange={e => setFormData({...formData, guests: e.target.value})}
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Your Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Phone Number</label>
        <input
          type="tel"
          className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          required
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors"
      >
        Book Now
      </button>
    </form>
  );
};

// Service Modal Component
const ServiceModal = ({ service, onClose, activeTab, setActiveTab }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? service.gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === service.gallery.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeTab === 'gallery') {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'Escape') setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-white/10">
            <service.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white">{service.title}</h3>
        </div>

        <div className="flex space-x-4 mb-6">
          {['overview', 'gallery', 'booking'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-white/80 text-lg">{service.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Pricing</h4>
                  <div className="space-y-2">
                    {service.pricing.packages.map((pkg, index) => (
                      <div key={index} className="flex justify-between items-center text-white/80">
                        <span>{pkg.name}</span>
                        <span>₹{pkg.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {service.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={service.gallery[selectedImageIndex]}
                  fallbackSrc={service.fallbackImage}
                  alt={`${service.title} ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {service.gallery.map((image, index) => (
                  <motion.button
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-accent' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageWithFallback
                      src={image}
                      fallbackSrc={service.fallbackImage}
                      alt={`${service.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-accent/20" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <BookingForm service={service} onClose={onClose} />
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-7xl w-full h-full p-4">
              <ImageWithFallback
                src={service.gallery[selectedImageIndex]}
                fallbackSrc={service.fallbackImage}
                alt={`${service.title} ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Services Component
const ServicesComponent = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  return (
    <section className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Experience excellence in every aspect of our service offerings
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {['all', 'celebrations', 'catering', 'corporate'].map(filter => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group relative cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-accent/20 transition-all duration-300"
                onClick={() => {
                  setSelectedService(service);
                  setActiveTab('overview');
                }}
              >
                <div className="relative h-80 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    fallbackSrc={service.fallbackImage}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-white/10">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-white/80 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Main App Component
function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="font-sans bg-background text-primary min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedBackground />
          <ParticleBackground />
          <div className="relative z-10">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<DetailedAboutUs />} />
              <Route path="/gallery" element={<InteractiveGallery />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/services" element={<ServicesComponent />} />
              <Route path="/locate" element={<Locate />} />
              <Route path="*" element={<Navigate to="/services" replace />} />
            </Routes>
            <Footer />
          </div>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
