import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { EndPage } from "../types";
import { endPageService } from "../services/endPageService";

interface EndPageContextType {
  pages: EndPage[];
  topPages: EndPage[];
  isLoading: boolean;
  error: string | null;
  addPage: (page: Omit<EndPage, "id" | "uuid" | "createdAt" | "comments">) => void;
  getPage: (uuid: string) => EndPage | undefined;
  addComment: (pageId: string, text: string, author: string) => void;
  refreshPages: () => Promise<void>;
}

const EndPageContext = createContext<EndPageContextType | undefined>(undefined);

export const EndPageProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<EndPage[]>([]);
  const [topPages, setTopPages] = useState<EndPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEndPages = useCallback(async () => {
    try {
      const result = await endPageService.getAllEndPages();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch end pages");
      }

      // Filter out private pages and sort by average rating
      const publicPages = result.data.filter(page => !page.isPrivate);
      const sortedPages = [...publicPages].sort((a, b) => {
        const ratingA = a.averageRating || 0;
        const ratingB = b.averageRating || 0;
        return ratingB - ratingA;
      });

      setPages(result.data);
      setTopPages(sortedPages.slice(0, 3));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndPages();
  }, [fetchEndPages]);

  const addPage = (page: Omit<EndPage, "id" | "uuid" | "createdAt" | "comments">) => {
    const newPage: EndPage = {
      ...page,
      id: pages.length + 1,
      uuid: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setPages([...pages, newPage]);
  };

  const getPage = (uuid: string) => {
    return pages.find((page) => page.uuid === uuid);
  };

  const addComment = (pageId: string, text: string, author: string) => {
    setPages(
      pages.map((page) => {
        if (page.uuid === pageId) {
          return {
            ...page,
            comments: [
              ...(page.comments || []),
              {
                id: crypto.randomUUID(),
                text,
                author,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return page;
      })
    );
  };

  return (
    <EndPageContext.Provider value={{ 
      pages, 
      topPages, 
      isLoading, 
      error, 
      addPage, 
      getPage, 
      addComment,
      refreshPages: fetchEndPages 
    }}>
      {children}
    </EndPageContext.Provider>
  );
};

export const useEndPage = () => {
  const context = useContext(EndPageContext);
  if (!context) {
    throw new Error("useEndPage must be used within an EndPageProvider");
  }
  return context;
};
