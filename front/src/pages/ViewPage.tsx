import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share, MessageSquare, Send, ArrowLeft, BookOpen } from "lucide-react";
import { endPageService } from "../services/endPageService";
import { useTranslation } from "react-i18next";
import DiaryBook from "../components/diary/DiaryBook";
import type { CreateEndPageResponse } from "../services/endPageService";
import type { Tone } from "../types";
import RatingModal from "../components/RatingModal";

interface ViewPageProps {
  setShowScene: (show: boolean) => void;
}

const ViewPage = ({ setShowScene }: ViewPageProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [page, setPage] = useState<CreateEndPageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "diary">("standard");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isRatingComplete, setIsRatingComplete] = useState(false);

  const getEmojisForTone = (tone: string) => {
    const emojis = {
      dramatic: ["😭", "💔", "😢", "💫"],
      ironic: ["🙄", "😏", "😒", "🤪"],
      absurd: ["🤡", "🎪", "🌈", "✨"],
      honest: ["💝", "💫", "✨", "💖"],
      "passive-aggressive": ["😊", "🙃", "💅", "✨"],
      "ultra-cringe": ["😳", "🤦", "💀", "🗿"],
      classe: ["🎩", "✨", "💫", "⭐"],
      touchant: ["💔", "🥺", "💫", "✨"]
    };
    return emojis[tone as keyof typeof emojis] || [];
  };

  useEffect(() => {
    setShowScene(false);
  }, [setShowScene]);

  const fetchEndPage = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const result = await endPageService.getEndPage(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch end page");
      }
      setPage(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEndPage();
  }, [fetchEndPage]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !commentAuthor || !id) return;

    try {
      const result = await endPageService.addComment(id, {
        text: commentText,
        author: commentAuthor
      });
      
      if (!result.success) {
        throw new Error(result.error || "Failed to add comment");
      }

      setCommentText("");
      setCommentAuthor("");
      fetchEndPage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: page?.title || "My End Page",
          text: "Check out my goodbye message",
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "standard" ? "diary" : "standard");
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRatingModal(true);
  };

  const handleRate = async (rating: number) => {
    if (!id) return;
    
    try {
      const result = await endPageService.addRating(id, rating);
      if (!result.success) {
        throw new Error(result.error || "Failed to submit rating");
      }
      
      // Refresh the page data to show updated rating
      await fetchEndPage();
      setIsRatingComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    }
  };

  const handleModalClose = () => {
    setShowRatingModal(false);
    setIsRatingComplete(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-red-400">{error || "End page not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
          >
            {t("common.backToHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {viewMode === "standard" && page && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {getEmojisForTone(page.tone).map((emoji, index) => (
            <div
              key={index}
              className="floating-emoji"
              style={{
                top: `${15 + index * 20}%`,
                left: "50%",
                transform: "translateX(-50%)"
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
      <div
        className={`min-h-screen py-12 px-6 ${
          viewMode === "standard" ? page?.tone : ""
        }`}
        style={
          viewMode === "standard"
            ? {
                backgroundImage: `url(${page.backgroundValue})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }
            : {}
        }
      >
        <div className="max-w-4xl mx-auto relative">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/"
              onClick={handleBack}
              className="text-white/80 hover:text-white flex items-center text-sm"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>

            <button
              onClick={toggleViewMode}
              className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-sm"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {viewMode === "standard" ? "View as Diary" : "Standard View"}
            </button>
          </div>

          {viewMode === "standard" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/30 backdrop-blur-sm p-8 rounded-xl shadow-xl drift-animation"
              >
                <h1 className="text-4xl font-serif font-bold mb-6">
                  {page.title}
                </h1>

                <div className="whitespace-pre-wrap mb-8 text-lg">
                  {page.content}
                </div>

                {page.medias && page.medias.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {page.medias.map((media, idx) => (
                      media.media_type.startsWith('video') ? (
                        <video
                          key={`video-${idx}`}
                          src={media.full_url}
                          className="w-full rounded-md shadow-lg"
                          controls
                        />
                      ) : (
                        <img
                          key={`img-${idx}`}
                          src={media.full_url}
                          alt={`Media ${idx + 1}`}
                          className="w-full rounded-md shadow-lg"
                        />
                      )
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-white/70">
                  <span>
                    Created on {new Date(page.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center hover:text-white"
                    >
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {page.comments.length} Comments
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center hover:text-white"
                    >
                      <Share className="mr-1 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>

              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 bg-black/50 backdrop-blur-sm p-6 rounded-xl"
                >
                  <h2 className="text-xl font-serif mb-4">Comments</h2>

                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <input
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Your name"
                        className="md:col-span-1 p-2 bg-primary-light rounded-md border border-gray-700"
                        required
                      />
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Leave a comment..."
                        className="md:col-span-3 p-2 bg-primary-light rounded-md border border-gray-700"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center bg-secondary hover:bg-secondary-light px-4 py-2 rounded-md text-sm"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Post Comment
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {page.comments.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No comments yet. Be the first to share your thoughts.
                      </p>
                    ) : (
                      page.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-800/50 p-4 rounded-md"
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-200">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <DiaryBook
                title={page.title}
                content={page.content}
                tone={page.tone as Tone}
                medias={page.medias}
              />
            </div>
          )}
        </div>
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={handleModalClose}
        onRate={handleRate}
        isRatingComplete={isRatingComplete}
      />
    </div>
  );
};

export default ViewPage;
