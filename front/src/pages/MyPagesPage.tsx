import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Calendar, MessageSquare, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { endPageService } from '../services/endPageService';
import type { EndPage } from '../types';

interface MyPagesPageProps {
  setShowScene: (show: boolean) => void;
}

const getRandomRotation = () => {
  return Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
};

const getToneEmoji = (tone: string): string => {
  const emojis: Record<string, string> = {
    dramatic: '😭',
    ironic: '😏',
    absurd: '🤪',
    honest: '😊',
    'passive-aggressive': '😒',
    'ultra-cringe': '😬',
    classe: '😎',
    touchant: '🥺'
  };
  return emojis[tone] || '📝';
};

const getRandomColor = (tone: string) => {
  const colors = {
    dramatic: ['bg-red-200', 'text-red-950', 'shadow-red-400/50'],
    ironic: ['bg-purple-200', 'text-purple-950', 'shadow-purple-400/50'],
    absurd: ['bg-yellow-200', 'text-yellow-950', 'shadow-yellow-400/50'],
    honest: ['bg-blue-200', 'text-blue-950', 'shadow-blue-400/50'],
    'passive-aggressive': ['bg-orange-200', 'text-orange-950', 'shadow-orange-400/50'],
    'ultra-cringe': ['bg-pink-200', 'text-pink-950', 'shadow-pink-400/50'],
    classe: ['bg-green-200', 'text-green-950', 'shadow-green-400/50'],
    touchant: ['bg-indigo-200', 'text-indigo-950', 'shadow-indigo-400/50'],
  };
  return colors[tone as keyof typeof colors] || ['bg-gray-200', 'text-gray-950', 'shadow-gray-400/50'];
};

const MyPagesPage = ({ setShowScene }: MyPagesPageProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groupedPages, setGroupedPages] = useState<Record<string, EndPage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setShowScene(false);
    
    const fetchUserPages = async () => {
      if (!currentUser?.id) return;
      
      try {
        const result = await endPageService.getUserEndPages(currentUser.id);
        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to fetch end pages");
        }

        // Group pages by tone
        const grouped = result.data.reduce((acc, page) => {
          if (!acc[page.tone]) {
            acc[page.tone] = [];
          }
          acc[page.tone].push(page);
          return acc;
        }, {} as Record<string, EndPage[]>);
        
        setGroupedPages(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPages();
  }, [setShowScene, currentUser]);

  const handleViewPage = (uuid: string) => {
    navigate(`/view/${uuid}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="inline-block h-8 w-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-primary">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12 px-4" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a2e, #16213e)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8 text-white text-center">
          {t('header.myPages')}
        </h1>

        {Object.keys(groupedPages).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {t('myPages.noPages')}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedPages).map(([tone, pages]) => (
              <div key={tone} className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold capitalize text-white/90 pl-4 flex items-center gap-2">
                  {getToneEmoji(tone)} {t(`tones.${tone}`)}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pages.map((page) => {
                    const [bgColor, textColor, shadowColor] = getRandomColor(page.tone);
                    const rotation = getRandomRotation();
                    
                    return (
                      <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ 
                          scale: 1.05, 
                          rotate: 0,
                          boxShadow: '0 0 25px rgba(255,255,255,0.3)'
                        }}
                        onClick={() => handleViewPage(page.uuid)}
                        style={{ rotate: `${rotation}deg` }}
                        className={`${bgColor} p-6 rounded-lg shadow-lg transform transition-all duration-300 cursor-pointer relative overflow-hidden backdrop-blur-sm hover:backdrop-blur-none ${shadowColor} group`}
                      >
                        {/* Pin emoji decoration */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-2xl">
                          📌
                        </div>
                        
                        {/* View icon */}
                        <div className="absolute top-2 right-2 text-gray-600/0 group-hover:text-gray-600/80 transition-all duration-300">
                          <Eye className="w-5 h-5" />
                        </div>
                        
                        <h3 className={`${textColor} font-serif font-bold text-xl mb-3 line-clamp-2 mt-4`}>
                          {page.title}
                        </h3>
                        
                        <p className={`${textColor} opacity-90 text-sm mb-4 line-clamp-3`}>
                          {page.content}
                        </p>
                        
                        <div className={`flex flex-col space-y-2 text-sm ${textColor} opacity-80`}>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(page.createdAt), 'PPP', {
                              locale: i18n.language === 'fr' ? fr : enUS
                            })}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {page.averageRating?.toFixed(1) || '0.0'} ({page.numberOfVotes || 0} votes)
                          </div>
                          
                          {page.comments && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {page.comments.length} commentaires
                            </div>
                          )}
                        </div>
                        
                        {/* Glowing effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPagesPage;