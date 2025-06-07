import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Crown, Star, Medal, Sparkles } from 'lucide-react';
import { useEndPage } from '../context/EndPageContext';
import { useTranslation } from 'react-i18next';

interface HomePageProps {
  setShowScene: (show: boolean) => void;
}

const HomePage = ({ setShowScene }: HomePageProps) => {
  const { topPages, isLoading } = useEndPage();
  const { t } = useTranslation();

  useEffect(() => {
    setShowScene(true);
  }, [setShowScene]);

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 flex-grow flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t('homePage.title.part1')} <span className="gradient-text">{t('homePage.title.part2')}</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10">
            {t('homePage.description')}
          </p>
          
          <Link
            to="/create"
            className="inline-flex items-center bg-secondary hover:bg-secondary-light 
                       text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            {t('homePage.createButton')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">
            {t('homePage.toneSection.title.part1')} <span className="gradient-text">{t('homePage.toneSection.title.part2')}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['dramatic', 'ironic', 'absurd'] as const).map((tone) => (
              <div 
                key={tone} 
                className="bg-primary-light p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-secondary/20"
              >
                <h3 className="font-serif text-xl mb-3 capitalize flex items-center gap-2">
                  <span className="text-3xl transition-transform duration-300 hover:scale-110 inline-block">
                    {tone === 'dramatic' && '🎭'}
                    {tone === 'ironic' && '😏'}
                    {tone === 'absurd' && '🤪'}
                  </span>
                  {t(`tones.${tone}`)}
                </h3>
                <p className="text-gray-300 mb-4">
                  {t(`homePage.toneSection.descriptions.${tone}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Pages Section */}
      <section className="py-16 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24 relative">
            <h2 className="text-4xl md:text-5xl font-serif font-bold relative z-10 inline-block">
              {t('homePage.topPages.title.part1')} <span className="gradient-text">{t('homePage.topPages.title.part2')}</span>
            </h2>
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-secondary opacity-60" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-secondary opacity-60" />
            <div className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              {t('homePage.topPages.subtitle')}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="inline-block h-8 w-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Second Place */}
              {topPages[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -8, 0],
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2,
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative group"
                >
                  <Link to={`/view/${topPages[1].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-gradient-to-b from-gray-700 to-gray-800 w-full rounded-t-lg relative overflow-hidden group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Medal className="w-12 h-12 text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg group-hover:bg-primary-light/40 transition-all duration-300">
                      <h3 className="font-serif text-xl mb-2 line-clamp-1">{topPages[1].title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{topPages[1].content}</p>
                      <div className="mt-4 flex items-center text-secondary">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{topPages[1].averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* First Place */}
              {topPages[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -12, 0],
                  }}
                  transition={{ 
                    duration: 0.5,
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative md:-mt-8 group"
                >
                  <Link to={`/view/${topPages[0].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 160 }}
                      transition={{ duration: 0.8 }}
                      className="bg-gradient-to-b from-yellow-500 to-yellow-700 w-full rounded-t-lg relative overflow-hidden group-hover:from-yellow-400 group-hover:to-yellow-600 transition-all duration-300"
                    >
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <Crown className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-transform duration-300" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-6 animate-pulse" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -left-6 animate-pulse" />
                        </div>
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg border-t-2 border-yellow-500/20 group-hover:bg-primary-light/40 group-hover:border-yellow-400/30 transition-all duration-300">
                      <h3 className="font-serif text-xl mb-2 line-clamp-1">{topPages[0].title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{topPages[0].content}</p>
                      <div className="mt-4 flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{topPages[0].averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Third Place */}
              {topPages[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -6, 0],
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4,
                    y: {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative group"
                >
                  <Link to={`/view/${topPages[2].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 80 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="bg-gradient-to-b from-amber-700 to-amber-800 w-full rounded-t-lg relative overflow-hidden group-hover:from-amber-600 group-hover:to-amber-700 transition-all duration-300"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.3)] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg group-hover:bg-primary-light/40 transition-all duration-300">
                      <h3 className="font-serif text-xl mb-2 line-clamp-1">{topPages[2].title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{topPages[2].content}</p>
                      <div className="mt-4 flex items-center text-amber-600">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{topPages[2].averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
 