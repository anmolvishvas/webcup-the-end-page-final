import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Crown, Star, Medal, Sparkles } from 'lucide-react';
import { useEndPage } from '../context/EndPageContext';

interface HomePageProps {
  setShowScene: (show: boolean) => void;
}

const HomePage = ({ setShowScene }: HomePageProps) => {
  const { topPages, isLoading } = useEndPage();

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
            Chaque fin mérite <span className="gradient-text">sa propre page</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10">
            Créez une page d'adieu personnalisée lorsque vous quittez un emploi, une relation,
            un projet ou une communauté. Exprimez vos adieux à votre façon.
          </p>
          
          <Link
            to="/create"
            className="inline-flex items-center bg-secondary hover:bg-secondary-light 
                       text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Créer votre page de fin <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">
            Comment direz-vous <span className="gradient-text">au revoir ?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['dramatic', 'ironic', 'absurd'] as const).map((tone) => (
              <div key={tone} className="bg-primary-light p-6 rounded-lg">
                <h3 className="font-serif text-xl mb-3 capitalize">
                  {tone === 'dramatic' && 'Dramatique'}
                  {tone === 'ironic' && 'Ironique'}
                  {tone === 'absurd' && 'Absurde'}
                </h3>
                <p className="text-gray-300 mb-4">
                  {tone === 'dramatic' && 'Embrassez les émotions. Rendez votre départ mémorable avec des mots et des images puissants.'}
                  {tone === 'ironic' && 'Qui a besoin d\'adieux sincères ? Ajoutez une touche d\'humour à votre départ.'}
                  {tone === 'absurd' && 'Brisez toutes les conventions. Créez une expérience d\'adieu surréaliste et inattendue.'}
                </p>
                <Link 
                  to="/create" 
                  className="text-secondary hover:text-secondary-light inline-flex items-center"
                >
                  Essayer ce ton <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
              Les adieux <span className="gradient-text">inoubliables</span>
            </h2>
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-secondary opacity-60" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-secondary opacity-60" />
            <div className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Les pages d'adieu les plus mémorables de notre communauté
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <Link to={`/view/${topPages[1].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-gradient-to-b from-gray-700 to-gray-800 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Medal className="w-12 h-12 text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg">
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative md:-mt-8"
                >
                  <Link to={`/view/${topPages[0].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 160 }}
                      transition={{ duration: 0.8 }}
                      className="bg-gradient-to-b from-yellow-500 to-yellow-700 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <Crown className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-6 animate-pulse" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -left-6 animate-pulse" />
                        </div>
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg border-t-2 border-yellow-500/20">
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative"
                >
                  <Link to={`/view/${topPages[2].uuid}`} className="block">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 80 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="bg-gradient-to-b from-amber-700 to-amber-800 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.3)]" />
                      </div>
                    </motion.div>
                    <div className="bg-primary-light/30 backdrop-blur-sm p-6 rounded-b-lg">
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
 