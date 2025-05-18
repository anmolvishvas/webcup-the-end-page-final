import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  Image,
  Music,
  X,
  BookOpen,
  Search,
  Lock,
  Globe,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useEndPage } from "../context/EndPageContext";
import { useAuth } from "../context/AuthContext";
import { Tone, BackgroundType } from "../types";
import { endPageService } from "../services/endPageService";
import { userService } from "../services/userService";
import DiaryBook from "../components/diary/DiaryBook";
import GifSelector from "../components/gif/GifSelector";
import ContentWarning from "../components/ContentWarning";
import { checkContent } from "../services/contentModerationService";
import type { ContentWarning as ContentWarningType } from "../services/contentModerationService";
import AttemptsWarningModal from "../components/AttemptsWarningModal";

interface CreatePageProps {
  setShowScene: (show: boolean) => void;
}

const TONES = [
  "dramatic",
  "ironic",
  "absurd",
  "honest",
  "passive-aggressive",
  "ultra-cringe",
  "classe",
  "touchant",
] as const;

const CreatePage = ({ setShowScene }: CreatePageProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addPage } = useEndPage();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState<Tone>("dramatic");
  const [backgroundType, setBackgroundType] = useState<BackgroundType | null>(
    "image"
  );
  const [backgroundValue, setBackgroundValue] = useState<string>(
    "https://images.unsplash.com/photo-1533941411526-a0cc3d10f516"
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [gifs, setGifs] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [music, setMusic] = useState<string | undefined>(undefined);
  const [isPreviewMode, setIsPreviewMode] = useState<
    "standard" | "diary" | false
  >(false);
  const [isGifSelectorOpen, setIsGifSelectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contentWarnings, setContentWarnings] = useState<ContentWarningType[]>(
    []
  );
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showAttemptsWarning, setShowAttemptsWarning] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    setShowScene(!isPreviewMode);
  }, [isPreviewMode, setShowScene]);

  useEffect(() => {
    if (isPreviewMode === "diary") {
      setBackgroundType(null);
      setBackgroundValue("");
    }
  }, [isPreviewMode]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      currentEmail &&
      currentEmail.includes("@") &&
      !emails.includes(currentEmail)
    ) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  // Remove email from list
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 5,
  });

  const onMusicDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setMusic(reader.result as string);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getMusicRootProps, getInputProps: getMusicInputProps } =
    useDropzone({
      onDrop: onMusicDrop,
      accept: {
        "audio/*": [],
      },
      maxFiles: 1,
    });

  const onVideoDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setVideos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      onDrop: onVideoDrop,
      accept: {
        "video/*": [],
      },
      maxFiles: 3,
      maxSize: 10000000, // 10MB limit
    });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeMusic = () => {
    setMusic(undefined);
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const submitEndPage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await endPageService.createEndPage({
        user: `/api/users/${currentUser!.id}`,
        title,
        content,
        tone,
        isPrivate,
        background_type: backgroundType,
        background_value: backgroundValue,
        createdAt: new Date().toISOString(),
        emails: emails,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to create end page");
      }

      // Upload files if any
      if (images.length > 0) {
        const uploadResult = await endPageService.uploadFiles(
          result.data.id,
          images
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload files");
        }
      }

      // Navigate to the view page
      navigate(`/view/${result.data.uuid}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !currentUser) return;

    // If there are content warnings, handle attempts first
    if (contentWarnings.length > 0) {
      const result = await userService.decrementAttempts(currentUser.id);
      if (!result.success) {
        setError(result.error || "Failed to update attempts");
        return;
      }

      // If user has no attempts left, prevent submission
      if (!result.hasAttempts) {
        setError("You have no attempts left. Please contact support.");
        return;
      }

      // Show attempts warning modal and set timer for submission
      setRemainingAttempts(result.attemptsLeft || 0);
      setShowAttemptsWarning(true);
      
      // Wait 6 seconds then submit
      setTimeout(() => {
        setShowAttemptsWarning(false);
        submitEndPage();
      }, 6000);
      
      return;
    }

    // If no content warnings, submit directly
    await submitEndPage();
  };

  const handleGifSelect = (gifUrl: string) => {
    // Toggle selection
    if (gifs.includes(gifUrl)) {
      setGifs(gifs.filter((url) => url !== gifUrl));
    } else {
      // Limit to 4 GIFs
      if (gifs.length < 4) {
        setGifs([...gifs, gifUrl]);
      }
    }
  };

  const removeGif = (index: number) => {
    setGifs((prev) => prev.filter((_, i) => i !== index));
  };

  // Update content and check for warnings
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Check for inappropriate content
    const warnings = checkContent(newContent);
    setContentWarnings(warnings);
  };

  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-serif font-bold mb-8">
            {t("createPage.title")}{" "}
            <span className="gradient-text">End Page</span>
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block mb-2 font-medium">
                  {t("createPage.titleLabel")}
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder={t("createPage.titlePlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="content" className="block mb-2 font-medium">
                  {t("createPage.messageLabel")}
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  className={`w-full p-3 bg-primary-light rounded-md border focus:outline-none h-40 ${
                    contentWarnings.length > 0
                      ? "border-red-500"
                      : "border-gray-700 focus:border-secondary"
                  }`}
                  placeholder={t("createPage.messagePlaceholder")}
                />
                <ContentWarning warnings={contentWarnings} />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  {t("createPage.toneLabel")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TONES.map((toneType) => (
                    <button
                      key={toneType}
                      onClick={() => setTone(toneType)}
                      className={`p-2 rounded-md capitalize text-sm transition-colors ${
                        tone === toneType
                          ? "bg-secondary"
                          : "bg-primary-light hover:bg-gray-700"
                      }`}
                    >
                      {t(`tones.${toneType}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Privacy Setting
                </label>
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary-light hover:bg-gray-700 transition-colors"
                >
                  {isPrivate ? (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Public</span>
                    </>
                  )}
                </button>
              </div>

              {isPrivate && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium">
                    Share with Others
                  </label>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 p-2 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </form>

                  {emails.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2 bg-primary-light rounded-md"
                        >
                          <span className="text-sm truncate">{email}</span>
                          <button
                            onClick={() => removeEmail(email)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block mb-2 font-medium">
                  Background Image
                </label>
                <select
                  value={backgroundValue || ""}
                  onChange={(e) => setBackgroundValue(e.target.value)}
                  className="w-full p-3 bg-primary-light rounded-md border border-gray-700"
                >
                  <option value="https://images.unsplash.com/photo-1533941411526-a0cc3d10f516">
                    {t("createPage.backgrounds.dramaticStorm")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1533289408336-ac92d0dbf036">
                    {t("createPage.backgrounds.airportTerminal")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1497281559858-4ae63e694d04">
                    {t("createPage.backgrounds.farewellHug")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1598316560463-0083295ca902">
                    {t("createPage.backgrounds.distantFigure")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1481956806014-1eae8e1c579a">
                    {t("createPage.backgrounds.mistyMountains")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1525384198871-f77a5293fdab">
                    {t("createPage.backgrounds.goldenField")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7">
                    {t("createPage.backgrounds.cringeMoment")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1507915135761-41a0a222c709">
                    {t("createPage.backgrounds.elegantScene")}
                  </option>
                  <option value="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c">
                    {t("createPage.backgrounds.touchingMemory")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  {t("createPage.mediaLabel")}
                </label>
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? "active" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <Image className="h-6 w-6 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {t("createPage.dropzoneImages")}
                    </p>
                  </div>

                  <div {...getVideoRootProps()} className="dropzone">
                    <input {...getVideoInputProps()} />
                    <svg
                      className="h-6 w-6 mb-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">
                      {t("createPage.dropzoneVideos")}
                    </p>
                  </div>
                </div>

                {(images.length > 0 || videos.length > 0) && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Uploaded ${idx}`}
                          className="h-20 w-full object-cover rounded-md"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {videos.map((video, idx) => (
                      <div key={`video-${idx}`} className="relative">
                        <video
                          src={video}
                          className="h-20 w-full object-cover rounded-md"
                          controls
                        />
                        <button
                          onClick={() => removeVideo(idx)}
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium">
                    {t("createPage.gifLabel")}
                  </label>
                  <button
                    onClick={() => setIsGifSelectorOpen(!isGifSelectorOpen)}
                    className="text-xs text-secondary hover:text-secondary-light flex items-center"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    {isGifSelectorOpen
                      ? t("createPage.closeGifs")
                      : t("createPage.searchGifs")}
                  </button>
                </div>

                {isGifSelectorOpen && (
                  <GifSelector
                    onGifSelect={handleGifSelect}
                    selectedGifs={gifs}
                  />
                )}

                {gifs.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {gifs.map((gif, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={gif}
                          alt={`GIF ${idx}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          onClick={() => removeGif(idx)}
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  {t("createPage.musicLabel")}
                </label>
                {!music ? (
                  <div {...getMusicRootProps()} className="dropzone">
                    <input {...getMusicInputProps()} />
                    <Music className="h-6 w-6 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {t("createPage.dropzoneMusic")}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-3 bg-primary-light rounded-md">
                    <div className="flex items-center">
                      <Music className="h-5 w-5 mr-2 text-secondary" />
                      <span className="text-sm truncate">
                        {t("createPage.musicAdded")}
                      </span>
                    </div>
                    <button
                      onClick={removeMusic}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    setIsPreviewMode(isPreviewMode ? false : "diary")
                  }
                  className="px-5 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors flex items-center"
                  disabled={isLoading}
                >
                  {isPreviewMode ? (
                    t("createPage.edit")
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />{" "}
                      {t("createPage.previewAsDiary")}
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!title || !content || isLoading}
                  className="px-5 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save & Publish
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-primary-light/50 backdrop-blur-sm p-6 rounded-lg flex items-center justify-center">
              {isPreviewMode ? (
                <DiaryBook
                  title={title || t("createPage.titlePreview")}
                  content={content || t("createPage.contentPreview")}
                  tone={tone}
                  medias={[
                    ...images.map((img) => ({
                      url: URL.createObjectURL(img),
                      type: "image",
                    })),
                    ...videos.map((video) => ({
                      url: video,
                      type: "video",
                    })),
                    ...gifs.map((gif) => ({
                      url: gif,
                      type: "image",
                    })),
                  ]}
                />
              ) : (
                <div className="w-full">
                  <h2 className="text-xl font-serif font-bold mb-4">
                    {t("createPage.livePreview")}
                  </h2>

                  <div
                    className={`p-6 rounded-lg ${tone} min-h-[400px] overflow-auto flex flex-col relative`}
                  >
                    <div
                      className="absolute inset-0 opacity-40 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${backgroundValue})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="relative z-10">
                      <h3 className="text-2xl font-serif mb-4">
                        {title || t("createPage.titlePreview")}
                      </h3>

                      <div className="whitespace-pre-wrap mb-6">
                        {content || t("createPage.contentPreview")}
                      </div>

                      {(images.length > 0 ||
                        gifs.length > 0 ||
                        videos.length > 0) && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {images.map((img) => (
                            <img
                              key={img.name}
                              src={URL.createObjectURL(img)}
                              alt={`User uploaded ${img.name}`}
                              className="w-full rounded-md"
                            />
                          ))}
                          {gifs.map((gif, idx) => (
                            <img
                              key={`gif-${idx}`}
                              src={gif}
                              alt={`GIF ${idx}`}
                              className="w-full rounded-md"
                            />
                          ))}
                          {videos.map((video, idx) => (
                            <video
                              key={`video-${idx}`}
                              src={video}
                              className="w-full rounded-md"
                              controls
                            />
                          ))}
                        </div>
                      )}

                      {music && (
                        <div className="mt-auto pt-4">
                          <audio controls className="w-full">
                            <source src={music} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AttemptsWarningModal
        isOpen={showAttemptsWarning}
        onClose={() => {}}
        attemptsLeft={remainingAttempts || 0}
      />
    </div>
  );
};

export default CreatePage;
