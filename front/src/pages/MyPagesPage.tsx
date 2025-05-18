import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface EndPage {
  id: number;
  title: string;
  content: string;
  tone: string;
  createdAt: string;
  totalRating: number;
  numberOfVotes: number;
  averageRating: number;
  backgroundValue: string;
  comments?: string[]; // Make comments optional
}

// Mock data based on the API response format
const mockPages: EndPage[] = [
  {
    id: 4,
    title: "My First End Page",
    content: "This is my end page content",
    tone: "ironic",
    createdAt: "2024-03-21T12:00:00+01:00",
    totalRating: 13,
    numberOfVotes: 3,
    averageRating: 4.33,
    backgroundValue: "#FFFFFF"
  },
  {
    id: 7,
    title: "Farewell to Social Media",
    content: "Time to disconnect and find real connections...",
    tone: "absurd",
    createdAt: "2024-03-22T14:30:00+01:00",
    totalRating: 8,
    numberOfVotes: 2,
    averageRating: 4.0,
    backgroundValue: "https://images.unsplash.com/photo-1533941411526-a0cc3d10f516"
  },
  {
    id: 8,
    title: "Goodbye Corporate Life",
    content: "After 10 years, it's time for a new adventure...",
    tone: "dramatic",
    createdAt: "2024-03-23T09:15:00+01:00",
    totalRating: 15,
    numberOfVotes: 4,
    averageRating: 3.75,
    backgroundValue: "https://images.unsplash.com/photo-1497281559858-4ae63e694d04"
  },
  {
    id: 9,
    title: "Au revoir, mon amour",
    content: "Sometimes love means letting go...",
    tone: "touchant",
    createdAt: "2024-03-24T16:45:00+01:00",
    totalRating: 20,
    numberOfVotes: 5,
    averageRating: 4.0,
    backgroundValue: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c"
  },
  {
    id: 10,
    title: "Thanks for Nothing!",
    content: "Well, this has been... interesting.",
    tone: "passive-aggressive",
    createdAt: "2024-03-25T11:20:00+01:00",
    totalRating: 12,
    numberOfVotes: 3,
    averageRating: 4.0,
    backgroundValue: "https://images.unsplash.com/photo-1533289408336-ac92d0dbf036"
  }
];

const getRandomRotation = () => {
  return Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
};

const getRandomColor = (tone: string) => {
  const colors = {
    dramatic: ['bg-red-100', 'text-red-900'],
    ironic: ['bg-purple-100', 'text-purple-900'],
    absurd: ['bg-yellow-100', 'text-yellow-900'],
    honest: ['bg-blue-100', 'text-blue-900'],
    'passive-aggressive': ['bg-orange-100', 'text-orange-900'],
    'ultra-cringe': ['bg-pink-100', 'text-pink-900'],
    classe: ['bg-green-100', 'text-green-900'],
    touchant: ['bg-indigo-100', 'text-indigo-900'],
  };
  return colors[tone as keyof typeof colors] || ['bg-gray-100', 'text-gray-900'];
};

interface MyPagesPageProps {
  setShowScene: (show: boolean) => void;
}

const MyPagesPage = ({ setShowScene }: MyPagesPageProps) => {
  const { t, i18n } = useTranslation();
  const [groupedPages, setGroupedPages] = useState<Record<string, EndPage[]>>({});

  useEffect(() => {
    setShowScene(false);
    
    // Group pages by tone
    const grouped = mockPages.reduce((acc, page) => {
      if (!acc[page.tone]) {
        acc[page.tone] = [];
      }
      acc[page.tone].push(page);
      return acc;
    }, {} as Record<string, EndPage[]>);
    
    setGroupedPages(grouped);
  }, [setShowScene]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900">
          Mes Pages
        </h1>

        <div className="space-y-12">
          {Object.entries(groupedPages).map(([tone, pages]) => (
            <div key={tone} className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold capitalize text-gray-800">
                {t(`tones.${tone}`)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pages.map((page) => {
                  const [bgColor, textColor] = getRandomColor(page.tone);
                  const rotation = getRandomRotation();
                  
                  return (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, rotate: 0 }}
                      style={{ rotate: `${rotation}deg` }}
                      className={`${bgColor} p-6 rounded-lg shadow-lg transform transition-transform duration-200 cursor-pointer relative overflow-hidden`}
                    >
                      {/* Pin decoration */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md" />
                      
                      <h3 className={`${textColor} font-serif font-bold text-xl mb-3 line-clamp-2`}>
                        {page.title}
                      </h3>
                      
                      <p className={`${textColor} opacity-80 text-sm mb-4 line-clamp-3`}>
                        {page.content}
                      </p>
                      
                      <div className={`${textColor} opacity-70 text-xs space-y-1`}>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(page.createdAt), 'PPP', {
                            locale: i18n.language === 'fr' ? fr : enUS
                          })}
                        </div>
                        
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          {page.averageRating.toFixed(1)} ({page.numberOfVotes} votes)
                        </div>
                        
                        {page.comments && (
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {page.comments.length} commentaires
                          </div>
                        )}
                      </div>
                      
                      {/* Tape decoration */}
                      <div className="absolute top-0 right-0 w-12 h-4 bg-yellow-200 opacity-50 transform rotate-45 translate-x-4 -translate-y-2" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPagesPage; 