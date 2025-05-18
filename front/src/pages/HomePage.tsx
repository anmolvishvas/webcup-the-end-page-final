import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Crown, Star, Medal, Sparkles } from 'lucide-react';
import { useEndPage } from '../context/EndPageContext';

interface HomePageProps {
  setShowScene: (show: boolean) => void;
}

const HomePage = ({ setShowScene }: HomePageProps) => {
  const { pages } = useEndPage();
  const [exampleIndex, setExampleIndex] = useState(0);
  
  // Sort pages by some criteria (e.g., creation date) to get top 3
  const topPages = [...pages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  useEffect(() => {
    setShowScene(true);
    
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % pages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pages.length, setShowScene]);

  const featuredPage = pages[exampleIndex];

  return (
    <div className="w-full min-h-[calc(100vh-76px)] flex flex-col">
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

      {featuredPage && (
        <>
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold">
                  Adieux <span className="gradient-text">en vedette</span>
                </h2>
                <Link 
                  to={`/view/${featuredPage.id}`}
                  className="text-secondary hover:text-secondary-light"
                >
                  Voir cette page
                </Link>
              </div>
              
              <div 
                className={`p-8 rounded-xl ${featuredPage.tone} animate-fade-in`}
                key={featuredPage.id}
              >
                <h3 className="text-2xl font-serif mb-4">{featuredPage.title}</h3>
                <p className="text-gray-200 mb-6">{featuredPage.content.substring(0, 120)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Créé le {new Date(featuredPage.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                    <BookOpen className="mr-1 h-3 w-3" /> 
                    {featuredPage.tone === 'dramatic' ? 'Dramatique' :
                     featuredPage.tone === 'ironic' ? 'Ironique' :
                     featuredPage.tone === 'absurd' ? 'Absurde' :
                     featuredPage.tone === 'honest' ? 'Honnête' :
                     'Passif-agressif'}
                  </span>
                </div>
              </div>
            </div>
          </section>

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

              <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-8 md:gap-4 relative min-h-[400px] md:h-[400px] md:mt-8">
                {/* Second Place */}
                {topPages[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center w-full md:w-1/4 max-w-[300px] order-2 md:order-none"
                  >
                    <Link to={`/view/${topPages[1].id}`} className="w-full">
                      <div className={`w-full aspect-square mb-4 rounded-lg overflow-hidden ${topPages[1].tone} shadow-lg transform hover:scale-105 transition-transform`}>
                        <div className="w-full h-full p-4 bg-black/40 backdrop-blur-sm flex flex-col items-center">
                          <h3 className="text-lg font-serif text-center mb-2 line-clamp-2">{topPages[1].title}</h3>
                          <div className="flex-grow overflow-y-auto scrollbar-hide w-full">
                            <p className="text-sm text-gray-300 text-center">
                              {topPages[1].content.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-gradient-to-b from-gray-700 to-gray-800 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.2),_transparent_70%)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Medal className="w-12 h-12 text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                      </div>
                      {/* Mirror Reflection */}
                      <div className="absolute -bottom-[120px] left-0 right-0 h-[120px] overflow-hidden opacity-50">
                        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 transform rotate-180 scale-y-[-1] blur-[1px]">
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center transform scale-y-[-1]">
                            <Medal className="w-12 h-12 text-gray-200/50" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* First Place */}
                {topPages[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center w-full md:w-1/3 max-w-[360px] order-1 md:order-none"
                  >
                    <Link to={`/view/${topPages[0].id}`} className="w-full">
                      <div className={`w-full aspect-square mb-4 rounded-lg overflow-hidden ${topPages[0].tone} shadow-lg transform hover:scale-105 transition-transform`}>
                        <div className="w-full h-full p-4 bg-black/40 backdrop-blur-sm flex flex-col items-center">
                          <h3 className="text-xl font-serif text-center mb-2 line-clamp-2">{topPages[0].title}</h3>
                          <div className="flex-grow overflow-y-auto scrollbar-hide w-full">
                            <p className="text-sm text-gray-300 text-center">
                              {topPages[0].content.substring(0, 80)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 160 }}
                      transition={{ duration: 0.8 }}
                      className="bg-gradient-to-b from-yellow-500 to-yellow-700 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.3),_transparent_70%)]" />
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <Crown className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-6 animate-pulse" />
                          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -left-6 animate-pulse" />
                        </div>
                      </div>
                      {/* Mirror Reflection */}
                      <div className="absolute -bottom-[160px] left-0 right-0 h-[160px] overflow-hidden opacity-50">
                        <div className="w-full h-full bg-gradient-to-b from-yellow-500 to-yellow-700 transform rotate-180 scale-y-[-1] blur-[1px]">
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center transform scale-y-[-1]">
                            <Crown className="w-16 h-16 text-yellow-400/50" />
                            <Sparkles className="w-8 h-8 text-yellow-300/30 absolute -top-2 -right-6" />
                            <Sparkles className="w-8 h-8 text-yellow-300/30 absolute -top-2 -left-6" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Third Place */}
                {topPages[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col items-center w-full md:w-1/4 max-w-[300px] order-3 md:order-none"
                  >
                    <Link to={`/view/${topPages[2].id}`} className="w-full">
                      <div className={`w-full aspect-square mb-4 rounded-lg overflow-hidden ${topPages[2].tone} shadow-lg transform hover:scale-105 transition-transform`}>
                        <div className="w-full h-full p-4 bg-black/40 backdrop-blur-sm flex flex-col items-center">
                          <h3 className="text-lg font-serif text-center mb-2 line-clamp-2">{topPages[2].title}</h3>
                          <div className="flex-grow overflow-y-auto scrollbar-hide w-full">
                            <p className="text-sm text-gray-300 text-center">
                              {topPages[2].content.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 80 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="bg-gradient-to-b from-amber-700 to-amber-800 w-full rounded-t-lg relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.2),_transparent_70%)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.3)]" />
                      </div>
                      {/* Mirror Reflection */}
                      <div className="absolute -bottom-[80px] left-0 right-0 h-[80px] overflow-hidden opacity-50">
                        <div className="w-full h-full bg-gradient-to-b from-amber-700 to-amber-800 transform rotate-180 scale-y-[-1] blur-[1px]">
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center transform scale-y-[-1]">
                            <Trophy className="w-12 h-12 text-amber-600/50" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Confetti effect */}
                <div className="absolute -top-20 left-0 right-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{
                        x: "50%",
                        y: 0,
                        scale: 0
                      }}
                      animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 400}px`,
                        scale: Math.random() * 0.5 + 0.5,
                        rotate: Math.random() * 360
                      }}
                      transition={{
                        duration: Math.random() * 2 + 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    >
                      <div className={`w-4 h-4 ${
                        i % 3 === 0 ? "bg-yellow-300" :
                        i % 3 === 1 ? "bg-gray-400" :
                        "bg-amber-700"
                      } rounded-full opacity-50`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
 