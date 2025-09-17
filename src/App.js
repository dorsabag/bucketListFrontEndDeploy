import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Label } from './components/ui/label';
import { toast } from 'sonner';
import { Calendar, CheckCircle, Clock, Star, Plus, Trash2, Edit, X, BookOpen, Film, Music, Utensils, Globe, Tv, Headphones, PlayCircle, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

  // Specific performer/artist images for better representation
  const performerImages = [
    "https://images.unsplash.com/photo-1524201862652-0d3d485d6d07?w=400&h=250&fit=crop&crop=entropy", // Concert performer on stage
    "https://images.unsplash.com/photo-1575426220089-9e2ef7b0c9f4?w=400&h=250&fit=crop&crop=entropy", // Performer in white on stage
    "https://images.unsplash.com/photo-1664101055972-63f92747bb4b?w=400&h=250&fit=crop&crop=entropy", // Traditional musician
    "https://images.unsplash.com/photo-1598176456779-603dd04c9668?w=400&h=250&fit=crop&crop=entropy", // Violinist portrait
    "https://images.unsplash.com/photo-1579200301048-20b886b6dcae?w=400&h=250&fit=crop&crop=entropy", // Stage performer with effects
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&crop=entropy", // Musician with guitar
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=250&fit=crop&crop=entropy", // Band performer
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=entropy", // Singer on stage
  ];

  const restaurantImages = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop&crop=entropy", // Fine dining
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=250&fit=crop&crop=entropy", // Social dining
    "https://images.unsplash.com/photo-1604467744966-5557120dbe61?w=400&h=250&fit=crop&crop=entropy", // Restaurant interior
    "https://images.unsplash.com/photo-1732206048727-81dd4e6e9124?w=400&h=250&fit=crop&crop=entropy", // French gastronomy
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop&crop=entropy", // Bar atmosphere
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop&crop=entropy", // Restaurant setting
  ];

  // Default images for different categories
  const defaultImages = {
    live_shows: performerImages,
    dining_out: restaurantImages,
    movies: [
      "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&h=250&fit=crop&crop=entropy", // Cinema theater
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=250&fit=crop&crop=entropy", // Movie projector
      "https://images.unsplash.com/photo-1623475329493-889804e377f8?w=400&h=250&fit=crop&crop=entropy", // Film strip
      "https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?w=400&h=250&fit=crop&crop=entropy", // Cinema experience
    ],
    books: [
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=400&h=250&fit=crop&crop=entropy", // Bookstore
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=250&fit=crop&crop=entropy", // Book market
      "https://images.unsplash.com/photo-1525715843408-5c6ec44503b1?w=400&h=250&fit=crop&crop=entropy", // Reading
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&crop=entropy", // Book selection
    ],
    around_world: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop&crop=entropy", // Travel
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=250&fit=crop&crop=entropy", // World travel
    ],
    tv_shows: [
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop&crop=entropy", // TV/streaming
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop&crop=entropy", // Entertainment
    ],
    episodes: [
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop&crop=entropy", // TV content
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop&crop=entropy", // Series
    ],
    podcasts: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=250&fit=crop&crop=entropy", // Podcast recording
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop&crop=entropy", // Audio content
    ]
  };

  // Function to get a consistent image for an item based on its ID and title
  const getItemImage = (item, category) => {
    // This function is now only used as fallback when getItemImageForDisplay doesn't find an existing image
    const title = item.properties.Title || item.properties.Name || item.properties.title || item.properties.name || '';
    
    // Use a combination of item ID and title hash for consistent but varied assignment
    const combinedHash = (item.id + title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Get images for this category
    const images = defaultImages[category] || defaultImages.live_shows;
    const imageIndex = combinedHash % images.length;
    
    return images[imageIndex];
  };

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('live_shows');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState({}); // Track which shows have episodes expanded
  const [episodesData, setEpisodesData] = useState({}); // Store episodes data for each show
  const [showCities, setShowCities] = useState({}); // Track which locations have cities expanded
  const [citiesData, setCitiesData] = useState({}); // Store cities data for each location
  const [wsConnection, setWsConnection] = useState(null); // WebSocket connection

  // Form state - now dynamic based on category
  const [formData, setFormData] = useState({
    title: '',
    notes: ''
  });

  // Dynamic form fields based on category
  const getCategoryFields = (category) => {
    const baseFields = ['title', 'notes', 'image_url'];
    
    switch (category) {
      case 'live_shows':
        return [...baseFields, 'location', 'date', 'with_whom'];
      case 'dining_out':
        return [...baseFields, 'rating', 'cuisine'];
      case 'around_world':
        return [...baseFields, 'dates', 'country'];
      case 'tv_shows':
        return [...baseFields, 'rating', 'network', 'airing_years', 'imdb_link'];
      case 'podcasts':
        return [...baseFields, 'speakers', 'network'];
      case 'books':
        return [...baseFields, 'author', 'genre', 'pages'];
      case 'movies':
        return [...baseFields, 'director', 'genre', 'release_year', 'runtime'];
      default:
        return baseFields;
    }
  };

  // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Handle different date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Helper function to render star rating
  const renderStars = (rating) => {
    const numStars = parseInt(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < numStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Helper function to get category-specific subtitle
  const getCategorySubtitle = (item, category) => {
    const props = item.properties;
    
    switch (category) {
      case 'live_shows':
        const location = props.מקום || props.location || props.Location || '';
        return location ? (
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            {location}
            <MapPin className="w-4 h-4" />
          </div>
        ) : null;
      
      case 'dining_out':
        const rating = props.Rating || props.rating || props.ציון || '';
        return rating ? (
          <div className="text-lg">{rating}</div>
        ) : null;
      
      case 'around_world':
        // Get all date fields from Notion properties (there are 3) - show as subtitle
        const allDates = [];
        if (props.תאריך) allDates.push(formatDate(props.תאריך));
        if (props['תאריך 2']) allDates.push(formatDate(props['תאריך 2']));
        if (props['תאריך 3']) allDates.push(formatDate(props['תאריך 3']));
        
        return allDates.length > 0 ? (
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <span>{allDates.join(' • ')}</span>
            <Calendar className="w-4 h-4" />
          </div>
        ) : null;
      
      case 'tv_shows':
        const tvRating = props.Rating || props.rating || '';
        return tvRating ? (
          <div className="text-lg">{tvRating}</div>
        ) : null;
      
      case 'podcasts':
        const speakers = props['דובר/ים'] || props.speakers || props.Speakers || '';
        return speakers ? (
          <div className="text-sm text-gray-600">{speakers}</div>
        ) : null;
      
      default:
        return null;
    }
  };

  // Helper function to get additional category info
  const getCategoryAdditionalInfo = (item, category) => {
    const props = item.properties;
    
    switch (category) {
      case 'live_shows':
        const date = props.תאריך || props.date || props.Date || '';
        const withWhom = props['עם מי הלכתי'] || props.with_whom || '';
        return (
          <div className="space-y-1 text-center">
            {date && (
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                {formatDate(date)}
                <Calendar className="w-4 h-4" />
              </div>
            )}
            {withWhom && (
              <div className="text-sm text-gray-600">
                עם מי הלכתי: {Array.isArray(withWhom) ? withWhom.join(', ') : withWhom}
              </div>
            )}
          </div>
        );
      
      case 'around_world':
        // Dates are now handled in getCategorySubtitle, no additional info needed
        return null;
      
      case 'tv_shows':
        const network = props.Network || props.network || '';
        const airingYears = props['Airing Years'] || props.airing_years || '';
        const imdbLink = props['IMDb Link'] || props.imdb_link || '';
        return (
          <div className="space-y-1 text-center">
            {network && (
              <div className="text-sm text-gray-600">{network}</div>
            )}
            {airingYears && (
              <div className="text-sm text-gray-600">{airingYears}</div>
            )}
            {imdbLink && (
              <div className="flex justify-center">
                <a 
                  href={imdbLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  IMDb Link
                </a>
              </div>
            )}
          </div>
        );
      
      case 'podcasts':
        const podcastNetwork = props.Network || props.network || '';
        return podcastNetwork ? (
          <div className="text-sm text-gray-600 text-center">{podcastNetwork}</div>
        ) : null;
      
      default:
        return null;
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = BACKEND_URL.replace('http', 'ws') + '/ws';
        console.log('🔌 Attempting WebSocket connection to:', wsUrl);
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('✅ Connected to real-time updates');
          setWsConnection(ws);
          toast.success('Connected to real-time updates!', { duration: 2000 });
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📡 Received update:', data);
            
            if (data.type === 'notion_update') {
              // Show notification about the update
              toast.info(`${data.message} - Refreshing data...`, { duration: 3000 });
              
              // Refresh data for the affected category
              if (data.category === selectedCategory) {
                setTimeout(() => {
                  fetchItems(selectedCategory);
                }, 1000); // Small delay to ensure Notion has propagated the change
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onclose = (event) => {
          console.log('❌ WebSocket connection closed:', event.code, event.reason);
          setWsConnection(null);
          
          // Only auto-reconnect if it wasn't a manual close
          if (event.code !== 1000) {
            console.log('🔄 Attempting to reconnect in 5 seconds...');
            setTimeout(connectWebSocket, 5000);
          }
        };
        
        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          // Don't break the app if WebSocket fails
          setWsConnection(null);
        };
        
      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        // Don't break the app if WebSocket creation fails
        setWsConnection(null);
      }
    };
    
    // Only attempt WebSocket connection if backend URL is available
    if (BACKEND_URL) {
      connectWebSocket();
    }
    
    // Cleanup on unmount
    return () => {
      if (wsConnection) {
        wsConnection.close(1000, 'Component unmounting');
      }
    };
  }, []); // Only run once on mount

  // Specific image mapping for known items (this would come from image search API)
  const specificImages = {
    // Israeli performers/artists
    'רביד פלוטניק': 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/a77ec1207126705.6717b01161c4b.jpg',
    'Ravid Plotnik': 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/a77ec1207126705.6717b01161c4b.jpg',
    // More specific mappings would be added here from API searches
  };

  // Function to get image for an item - first check Notion, then specific mapping, then search-based placeholder
  const getItemImageForDisplay = (item, category) => {
    // Check if item has an existing image from Notion (including image link as requested by user)
    const existingImage = item.properties.Image || 
                         item.properties.image || 
                         item.properties.תמונה ||
                         item.properties.Cover ||
                         item.properties.cover;
    
    if (existingImage) {
      // If this is a Notion-hosted image, proxy it through our backend to handle authentication
      if (existingImage.startsWith('https://www.notion.so/image/')) {
        return `${BACKEND_URL}/api/proxy-image?url=${encodeURIComponent(existingImage)}`;
      }
      return existingImage;
    }

    // Get the specific item title
    const title = item.properties.Title || item.properties.Name || item.properties.title || item.properties.name || '';
    
    // Check if we have a specific image for this item
    if (specificImages[title]) {
      return specificImages[title];
    }
    
    // Use default category-based image assignment
    return getItemImage(item, category);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchTVShowEpisodes = async (showId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/categories/tv_shows/items/${showId}/episodes`);
      if (response.data.success) {
        setEpisodesData(prev => ({
          ...prev,
          [showId]: response.data.episodes
        }));
        setShowEpisodes(prev => ({
          ...prev,
          [showId]: true
        }));
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast.error('Failed to load episodes');
    }
  };

  const toggleEpisodes = (showId) => {
    if (showEpisodes[showId]) {
      // Hide episodes
      setShowEpisodes(prev => ({
        ...prev,
        [showId]: false
      }));
    } else {
      // Show episodes - fetch if not already loaded
      if (!episodesData[showId]) {
        fetchTVShowEpisodes(showId);
      } else {
        setShowEpisodes(prev => ({
          ...prev,
          [showId]: true
        }));
      }
    }
  };

  // Helper function to toggle cities (similar to episodes)
  const toggleCities = async (itemId) => {
    if (showCities[itemId]) {
      setShowCities(prev => ({ ...prev, [itemId]: false }));
    } else {
      setShowCities(prev => ({ ...prev, [itemId]: true }));
      
      // If we don't have cities data, fetch it from the backend
      if (!citiesData[itemId]) {
        try {
          // Fetch actual cities/sub-items for this around_world country
          const response = await axios.get(`${BACKEND_URL}/api/categories/around_world/items/${itemId}/cities`);
          if (response.data.success) {
            setCitiesData(prev => ({ ...prev, [itemId]: response.data.cities }));
          } else {
            console.error('Failed to fetch cities:', response.data.error);
            setCitiesData(prev => ({ ...prev, [itemId]: [] }));
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          setCitiesData(prev => ({ ...prev, [itemId]: [] }));
        }
      }
    }
  };

  const fetchItems = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/categories/${category}/items`);
      let items = response.data.items || [];
      
      // Sort by date descending (latest first) - simple and safe
      items.sort((a, b) => {
        const dateA = a.properties?.תאריך || a.properties?.date || a.properties?.Date || '';
        const dateB = b.properties?.תאריך || b.properties?.date || b.properties?.Date || '';
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        // Simple string comparison for ISO dates works fine
        return dateB.localeCompare(dateA);
      });
      
      setItems(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );

      const response = await axios.post(`${BACKEND_URL}/api/categories/${selectedCategory}/items`, cleanedData);
      if (response.data.success) {
        toast.success('Item added successfully!');
        setIsAddDialogOpen(false);
        resetForm();
        fetchItems(selectedCategory);
      } else {
        toast.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(error.response?.data?.detail || 'Failed to add item');
    }
  };

  const handleEditItem = async () => {
    try {
      if (!editingItem || !editingItem.id) {
        toast.error('No item selected for editing or missing item ID');
        return;
      }
      
      if (!formData.title || formData.title.trim() === '') {
        toast.error('Title is required');
        return;
      }

      // Only include fields that have values
      const cleanedData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanedData[key] = value;
        }
      });

      const response = await axios.put(
        `${BACKEND_URL}/api/categories/${selectedCategory}/items/${editingItem.id}`,
        cleanedData
      );
      
      if (response.data.success) {
        toast.success('Item updated successfully!');
        setIsEditDialogOpen(false);
        setEditingItem(null);
        resetForm();
        fetchItems(selectedCategory);
      } else {
        toast.error('Failed to update item: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(error.response?.data?.detail || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/categories/${selectedCategory}/items/${itemId}`);
      if (response.data.success) {
        toast.success('Item deleted successfully!');
        fetchItems(selectedCategory);
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const resetForm = () => {
    const baseForm = {
      title: '',
      notes: '',
      image_url: ''
    };
    
    // Add category-specific fields
    const categoryFields = getCategoryFields(selectedCategory);
    const formFields = {};
    
    categoryFields.forEach(field => {
      formFields[field] = '';
    });
    
    setFormData({...baseForm, ...formFields});
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    const props = item.properties;
    
    // Get title from different possible property names
    const title = props.Title || props.Name || props.title || props.name || '';
    
    // Base form data
    const baseFormData = {
      title: title,
      notes: props.Notes || props.הערות || '',
      image_url: props.Image || props.image || props.תמונה || props.Cover || props.cover || ''
    };
    
    // Add category-specific fields
    switch (selectedCategory) {
      case 'live_shows':
        baseFormData.location = props.מקום || props.location || props.Location || '';
        baseFormData.date = props.תאריך || props.date || props.Date || '';
        const withWhomValue = props['עם מי הלכתי'] || props.with_whom || '';
        baseFormData.with_whom = Array.isArray(withWhomValue) ? withWhomValue.join(', ') : withWhomValue;
        break;
      
      case 'dining_out':
        baseFormData.rating = props.Rating || props.rating || props.ציון || '';
        const cuisineValue = props.Cuisine || props.cuisine || '';
        baseFormData.cuisine = Array.isArray(cuisineValue) ? cuisineValue.join(', ') : cuisineValue;
        break;
      
      case 'around_world':
        baseFormData.dates = props.תאריך || props.dates || props.Dates || '';
        baseFormData.country = props.Country || props.country || '';
        break;
      
      case 'tv_shows':
        baseFormData.rating = props.Rating || props.rating || '';
        baseFormData.network = props.Network || props.network || '';
        baseFormData.airing_years = props['Airing Years'] || props.airing_years || '';
        baseFormData.imdb_link = props['IMDb Link'] || props.imdb_link || '';
        break;
      
      case 'podcasts':
        baseFormData.speakers = props['דובר/ים'] || props.speakers || props.Speakers || '';
        baseFormData.network = props.Network || props.network || '';
        break;
      
      case 'books':
        baseFormData.author = props.Author || props.author || '';
        baseFormData.genre = props.Genre || props.genre || '';
        baseFormData.pages = props.Pages || props.pages || '';
        break;
      
      case 'movies':
        baseFormData.director = props.Director || props.director || '';
        baseFormData.genre = props.Genre || props.genre || '';
        baseFormData.release_year = props['Release Year'] || props.release_year || '';
        baseFormData.runtime = props.Runtime || props.runtime || '';
        break;
    }
    
    setFormData(baseFormData);
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'live_shows': return <Music className="w-5 h-5" />;
      case 'dining_out': return <Utensils className="w-5 h-5" />;
      case 'around_world': return <Globe className="w-5 h-5" />;
      case 'tv_shows': return <Tv className="w-5 h-5" />;
      case 'podcasts': return <Headphones className="w-5 h-5" />;
      case 'books': return <BookOpen className="w-5 h-5" />;
      case 'movies': return <Film className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const renderCategorySpecificFields = () => {
    switch (selectedCategory) {
      case 'live_shows':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Concert venue or location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="with_whom">With Whom</Label>
              <Input
                id="with_whom"
                value={formData.with_whom || ''}
                onChange={(e) => setFormData({...formData, with_whom: e.target.value})}
                placeholder="Who did you go with?"
              />
            </div>
          </>
        );
      
      case 'dining_out':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={formData.rating || ''} onValueChange={(value) => setFormData({...formData, rating: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate this restaurant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="⭐">⭐</SelectItem>
                  <SelectItem value="⭐⭐">⭐⭐</SelectItem>
                  <SelectItem value="⭐⭐⭐">⭐⭐⭐</SelectItem>
                  <SelectItem value="⭐⭐⭐⭐">⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                value={formData.cuisine || ''}
                onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                placeholder="Type of cuisine"
              />
            </div>
          </>
        );

      case 'around_world':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dates">Dates</Label>
              <Input
                id="dates"
                value={formData.dates || ''}
                onChange={(e) => setFormData({...formData, dates: e.target.value})}
                placeholder="Travel dates"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Country visited"
              />
            </div>
          </>
        );

      case 'tv_shows':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={formData.rating || ''} onValueChange={(value) => setFormData({...formData, rating: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate this show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="★">★</SelectItem>
                  <SelectItem value="★★">★★</SelectItem>
                  <SelectItem value="★★★">★★★</SelectItem>
                  <SelectItem value="★★★★">★★★★</SelectItem>
                  <SelectItem value="★★★★★">★★★★★</SelectItem>
                  <SelectItem value="★★★★★★">★★★★★★</SelectItem>
                  <SelectItem value="★★★★★★★">★★★★★★★</SelectItem>
                  <SelectItem value="★★★★★★★★">★★★★★★★★</SelectItem>
                  <SelectItem value="★★★★★★★★★">★★★★★★★★★</SelectItem>
                  <SelectItem value="★★★★★★★★★★">★★★★★★★★★★</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Input
                id="network"
                value={formData.network || ''}
                onChange={(e) => setFormData({...formData, network: e.target.value})}
                placeholder="TV network or streaming service"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airing_years">Airing Years</Label>
              <Input
                id="airing_years"
                value={formData.airing_years || ''}
                onChange={(e) => setFormData({...formData, airing_years: e.target.value})}
                placeholder="e.g., 2020-2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imdb_link">IMDb Link</Label>
              <Input
                id="imdb_link"
                value={formData.imdb_link || ''}
                onChange={(e) => setFormData({...formData, imdb_link: e.target.value})}
                placeholder="https://www.imdb.com/title/..."
              />
            </div>
          </>
        );

      case 'podcasts':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="speakers">Speakers</Label>
              <Input
                id="speakers"
                value={formData.speakers || ''}
                onChange={(e) => setFormData({...formData, speakers: e.target.value})}
                placeholder="Podcast hosts or speakers"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Input
                id="network"
                value={formData.network || ''}
                onChange={(e) => setFormData({...formData, network: e.target.value})}
                placeholder="Podcast network or platform"
              />
            </div>
          </>
        );

      case 'books':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre || ''}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                placeholder="Book genre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                value={formData.pages || ''}
                onChange={(e) => setFormData({...formData, pages: e.target.value})}
                placeholder="Number of pages"
              />
            </div>
          </>
        );
        
      case 'movies':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                value={formData.director || ''}
                onChange={(e) => setFormData({...formData, director: e.target.value})}
                placeholder="Director name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre || ''}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                placeholder="Movie genre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_year">Release Year</Label>
              <Input
                id="release_year"
                type="number"
                value={formData.release_year || ''}
                onChange={(e) => setFormData({...formData, release_year: e.target.value})}
                placeholder="e.g., 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="runtime">Runtime (minutes)</Label>
              <Input
                id="runtime"
                type="number"
                value={formData.runtime || ''}
                onChange={(e) => setFormData({...formData, runtime: e.target.value})}
                placeholder="120"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderItemDetails = (item) => {
    const props = item.properties;    
    return (
      <div className="text-center space-y-3 flex-1">
        {/* Category-specific subtitle */}
        <div className="flex justify-center">
          {getCategorySubtitle(item, selectedCategory)}
        </div>

        {/* Additional category-specific info */}
        <div className="space-y-2">
          {getCategoryAdditionalInfo(item, selectedCategory)}
        </div>

        {/* Special buttons for TV Shows and Around the World */}
        {selectedCategory === 'tv_shows' && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleEpisodes(item.id)}
              className="text-xs"
            >
              {showEpisodes[item.id] ? (
                <span className="flex items-center">
                  Hide Episodes <ChevronUp className="w-3 h-3 ml-1" />
                </span>
              ) : (
                <span className="flex items-center">
                  Episodes List <ChevronDown className="w-3 h-3 ml-1" />
                </span>
              )}
            </Button>
          </div>
        )}

        {selectedCategory === 'around_world' && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleCities(item.id)}
              className="text-xs"
            >
              {showCities[item.id] ? (
                <span className="flex items-center">
                  Hide Cities <ChevronUp className="w-3 h-3 ml-1" />
                </span>
              ) : (
                <span className="flex items-center">
                  Cities <ChevronDown className="w-3 h-3 ml-1" />
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Episodes/Cities list */}
        {selectedCategory === 'tv_shows' && showEpisodes[item.id] && episodesData[item.id] && (
          <div className="mt-3 space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Episodes:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {episodesData[item.id].map((episode, index) => {
                const episodeTitle = episode.properties.Title || episode.properties.Name || `Episode ${index + 1}`;
                return (
                  <div key={episode.id} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{episodeTitle}</p>
                    {episode.properties.Season && episode.properties.Episode && (
                      <p className="text-gray-500">S{episode.properties.Season}E{episode.properties.Episode}</p>
                    )}
                  </div>
                );
              })}
            </div>
            {episodesData[item.id].length === 0 && (
              <p className="text-xs text-gray-500 italic">No episodes found for this show</p>
            )}
          </div>
        )}

        {selectedCategory === 'around_world' && showCities[item.id] && citiesData[item.id] && (
          <div className="mt-3 space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Cities:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {citiesData[item.id].map((city, index) => {
                const cityTitle = city.properties.Title || city.properties.Name || `City ${index + 1}`;
                return (
                  <div key={city.id} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{cityTitle}</p>
                    {city.properties.Date && (
                      <p className="text-gray-500">{city.properties.Date}</p>
                    )}
                  </div>
                );
              })}
            </div>
            {citiesData[item.id].length === 0 && (
              <p className="text-xs text-gray-500 italic">No cities found for this location</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Bucket List
          </h1>
          <p className="text-gray-600 text-lg">Track your life experiences across different categories</p>
          
          {/* Live Sync Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${wsConnection ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-500">
              {wsConnection ? 'Live Sync' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Category Navigation with improved spacing */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-7 gap-1 p-1 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
              {Object.entries(categories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex flex-col items-center gap-1 px-3 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <span className="text-xl">{category.icon}</span>
                  {/* <span className="text-xs font-medium">{category.name}</span> */}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Category Content with improved spacing */}
          {Object.entries(categories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              {/* Category Header with proper spacing from navigation */}
              <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-16">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New {category.name} Item</DialogTitle>
                        <DialogDescription>
                          Add a new item to your {category.name.toLowerCase()} bucket list.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Enter title"
                            required
                          />
                        </div>

                        {renderCategorySpecificFields()}

                        <div className="space-y-2">
                          <Label htmlFor="image_url">Image URL (Optional)</Label>
                          <Input
                            id="image_url"
                            value={formData.image_url || ''}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className="text-xs text-gray-500">
                            Add a custom image URL for this item
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            placeholder="Add any notes or thoughts..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleAddItem} className="flex-1">
                            Add Item
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddDialogOpen(false);
                              resetForm();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>

              {/* Items Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => {
                    const title = item.properties.Title || item.properties.Name || item.properties.title || item.properties.name || 'Untitled';
                    const itemImage = getItemImageForDisplay(item, selectedCategory);
                    
                    return (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                        {/* Image Section */}
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={itemImage}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to a solid color background if image fails
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback background */}
                          <div 
                            className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-lg"
                            style={{ display: 'none' }}
                          >
                            <div className="text-4xl">{categories[selectedCategory]?.icon}</div>
                          </div>
                        </div>
                        
                        {/* Card Content - Centered */}
                        <div className="flex flex-col flex-1 p-4 text-center">
                          {/* Title - shown only once */}
                          <CardTitle className="text-lg font-bold mb-2 line-clamp-2">{title}</CardTitle>
                          
                          {/* Category-specific content */}
                          <div className="flex-1">
                            {renderItemDetails(item)}
                          </div>
                          
                          {/* Edit and Delete buttons at bottom */}
                          <div className="flex gap-2 justify-center mt-4 pt-4 border-t border-gray-100">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {category.name.toLowerCase()} items yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start building your {category.name.toLowerCase()} bucket list!
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update your bucket list item details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter title"
                  required
                />
              </div>

              {renderCategorySpecificFields()}

              <div className="space-y-2">
                <Label htmlFor="edit_image_url">Image URL (Optional)</Label>
                <Input
                  id="edit_image_url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Add a custom image URL for this item
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any notes or thoughts..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEditItem} className="flex-1">
                  Update Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
