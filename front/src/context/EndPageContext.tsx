import { createContext, useState, useContext, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { EndPage } from "../types";

interface EndPageContextType {
  pages: EndPage[];
  addPage: (page: Omit<EndPage, "id" | "createdAt" | "comments">) => string;
  getPage: (id: string) => EndPage | undefined;
  addComment: (pageId: string, text: string, author: string) => void;
}

const EndPageContext = createContext<EndPageContextType | undefined>(undefined);

export const EndPageProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<EndPage[]>([
    {
      id: "1",
      title: "My Last Day",
      content:
        "After 5 years, it's time to say goodbye. It's been an incredible journey.",
      tone: "dramatic",
      createdAt: new Date().toISOString(),
      backgroundType: "image",
      backgroundValue:
        "https://images.unsplash.com/photo-1533941411526-a0cc3d10f516",
      images: [],
      gifs: [],
      videos: [],
      comments: [],
    },
    {
      id: "2",
      title: "So Long, and Thanks for All the Fish",
      content:
        "I'd like to say it's been fun. I'd like to, but I can't. Anyway, bye!",
      tone: "ironic",
      createdAt: new Date().toISOString(),
      backgroundType: "image",
      backgroundValue: "https://images.unsplash.com/photo-1533289408336-ac92d0dbf036",
      images: [],
      gifs: [],
      videos: [],
      comments: [],
    },
    {
      id: "3",
      title: "Un dernier au revoir...",
      content:
        "Après tant d'années ensemble, les mots me manquent pour exprimer ma gratitude. Ce n'est pas un adieu, mais un simple au revoir...",
      tone: "touchant",
      createdAt: new Date().toISOString(),
      backgroundType: "image",
      backgroundValue: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c",
      images: [],
      gifs: [],
      videos: [],
      comments: [],
    },
  ]);

  const addPage = (page: Omit<EndPage, "id" | "createdAt" | "comments">) => {
    const id = uuidv4();
    const newPage: EndPage = {
      ...page,
      id,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setPages([...pages, newPage]);
    return id;
  };

  const getPage = (id: string) => {
    return pages.find((page) => page.id === id);
  };

  const addComment = (pageId: string, text: string, author: string) => {
    setPages(
      pages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            comments: [
              ...page.comments,
              {
                id: uuidv4(),
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
    <EndPageContext.Provider value={{ pages, addPage, getPage, addComment }}>
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
