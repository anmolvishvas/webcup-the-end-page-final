import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      loginPage: {
        title: 'Connexion',
        subtitle: 'Connectez-vous à votre compte',
        emailLabel: 'Email',
        emailPlaceholder: 'vous@exemple.com',
        passwordLabel: 'Mot de passe',
        passwordPlaceholder: '••••••••',
        loginButton: 'Se connecter',
        noAccount: 'Vous n\'avez pas de compte ?',
        registerLink: 'S\'inscrire',
        errors: {
          emptyFields: 'Veuillez remplir tous les champs',
          invalidCredentials: 'Email ou mot de passe invalide',
          loginFailed: 'Échec de la connexion'
        }
      },
      createPage: {
        title: 'Créez Votre',
        titleLabel: 'Titre de votre au revoir',
        titlePlaceholder: 'Mon dernier chapitre...',
        messageLabel: 'Votre message',
        messagePlaceholder: 'Partagez vos pensées, sentiments ou derniers mots...',
        toneLabel: 'Choisissez votre ton',
        mediaLabel: 'Ajouter des images et vidéos',
        dropzoneImages: 'Glissez des images ici ou cliquez pour télécharger',
        dropzoneVideos: 'Glissez des vidéos ici ou cliquez pour télécharger (max 10MB)',
        gifLabel: 'Ajouter des GIFs',
        closeGifs: 'Fermer',
        searchGifs: 'Rechercher des GIFs',
        musicLabel: 'Ajouter de la musique (Optionnel)',
        dropzoneMusic: 'Glissez un fichier audio ici ou cliquez pour télécharger',
        musicAdded: 'Musique de fond ajoutée',
        edit: 'Modifier',
        previewAsDiary: 'Aperçu comme journal',
        titlePreview: 'Votre titre apparaîtra ici',
        contentPreview: 'Votre contenu apparaîtra ici...',
        livePreview: 'Aperçu en direct',
        backgrounds: {
          dramaticStorm: 'Tempête dramatique',
          airportTerminal: 'Terminal d\'aéroport',
          farewellHug: 'Câlin d\'adieu',
          distantFigure: 'Figure lointaine',
          mistyMountains: 'Montagnes brumeuses',
          goldenField: 'Champ doré',
          cringeMoment: 'Moment gênant',
          elegantScene: 'Scène élégante',
          touchingMemory: 'Souvenir touchant'
        }
      },
      tones: {
        dramatic: 'Dramatique',
        ironic: 'Ironique',
        absurd: 'Absurde',
        honest: 'Honnête',
        'passive-aggressive': 'Passif-agressif',
        'ultra-cringe': 'Ultra-gênant',
        classe: 'Classe',
        touchant: 'Touchant'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 