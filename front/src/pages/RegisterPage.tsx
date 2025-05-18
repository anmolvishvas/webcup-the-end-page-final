import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface RegisterPageProps {
  setShowScene: (show: boolean) => void;
}

const RegisterPage = ({ setShowScene }: RegisterPageProps) => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowScene(true);

    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, setShowScene]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstname || !lastname || !username || !email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(firstname, lastname, username, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === "Email already exists"
            ? "Cet email existe déjà"
            : err.message
          : "Échec de l'inscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-76px)] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-primary-light/50 backdrop-blur-sm p-8 rounded-lg shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-400">
            Rejoignez notre communauté et commencez à partager
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block mb-2 text-sm font-medium">
                Prénom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="block w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder="Jean"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastname" className="block mb-2 text-sm font-medium">
                Nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="block w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder="Dupont"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                placeholder="jeandupont"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-secondary hover:bg-secondary-light rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="loader-sm" />
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Créer le compte
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-400">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-secondary hover:text-secondary-light"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
