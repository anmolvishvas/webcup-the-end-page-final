import  { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { GiphyGif } from '../../types';
import { searchGifs, getTrendingGifs } from '../../services/giphyService';

interface GifSelectorProps {
  onGifSelect: (gifUrl: string) => void;
  selectedGifs: string[];
}

const GifSelector: React.FC<GifSelectorProps> = ({ onGifSelect, selectedGifs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load trending GIFs initially
  useEffect(() => {
    const loadTrendingGifs = async () => {
      setLoading(true);
      try {
        const response = await getTrendingGifs();
        setGifs(response.data);
      } catch (error) {
        console.error('Error loading trending GIFs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingGifs();
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchGifsHandler(query);
      } else {
        // If empty query, load trending GIFs
        getTrendingGifs().then(response => {
          setGifs(response.data);
        });
      }
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const searchGifsHandler = async (query: string) => {
    setLoading(true);
    try {
      const response = await searchGifs(query);
      setGifs(response.data);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGifClick = (gif: GiphyGif) => {
    onGifSelect(gif.images.fixed_height.url);
  };

  const isGifSelected = (gifUrl: string) => {
    return selectedGifs.includes(gifUrl);
  };

  return (
    <div className="gif-search-container w-full">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for GIFs..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 pl-8 pr-4 rounded-md bg-white border border-gray-300 text-gray-800 focus:border-secondary focus:outline-none"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="gif-grid">
          {gifs.map((gif) => (
            <div
              key={gif.id}
              className={`gif-item ${isGifSelected(gif.images.fixed_height.url) ? 'selected' : ''}`}
              onClick={() => handleGifClick(gif)}
            >
              <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
            </div>
          ))}
          {gifs.length === 0 && !loading && (
            <div className="col-span-3 text-center py-8 text-gray-800">
              No GIFs found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GifSelector;
 