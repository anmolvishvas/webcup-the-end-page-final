import { forwardRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { Tone } from "../../types";
import { Music } from "lucide-react";

interface DiaryBookProps {
  title: string;
  content: string;
  tone: Tone;
  medias: Array<{
    "@id": string;
    "@type": string;
    id: number;
    media_type: string;
    url: string;
    full_url: string;
    original_filename: string;
    file_size: number;
    createdAt: string;
  }>;
}

// Single page component
interface PageProps {
  number: number;
  children: React.ReactNode;
  className?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ number, children, className = "" }, ref) => {
    return (
      <div className={`page ${className}`} ref={ref} data-density="hard">
        <div className="page-content">{children}</div>
      </div>
    );
  }
);

Page.displayName = "Page";

const DiaryBook: React.FC<DiaryBookProps> = ({
  title,
  content,
  tone,
  medias
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate book dimensions based on window size
  const getBookDimensions = () => {
    if (windowWidth < 640) {
      return { width: 300, height: 450 };
    } else if (windowWidth < 1024) {
      return { width: 400, height: 600 };
    } else {
      return { width: 500, height: 700 };
    }
  };

  const { width, height } = getBookDimensions();

  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

  // Organize content across pages
  const contentPages = [];

  // First page is title page
  contentPages.push(
    <Page key="title-page" number={1} className={tone}>
      <div className="page-overlay flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-serif font-bold mb-6 text-center">
          {title}
        </h1>
        <p className="italic text-gray-600 text-center">– The End –</p>
      </div>
    </Page>
  );

  // Content pages
  contentPages.push(
    <Page key="content-page" number={2} className={tone}>
      <div className="page-overlay">
        <div className="prose prose-sm max-w-none">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Page>
  );

  // Images and videos page (if there are any media)
  if (medias && medias.length > 0) {
    contentPages.push(
      <Page key="memories-page" number={3} className={tone}>
        <div className="page-overlay">
          <h2 className="text-xl font-serif mb-4 text-gray-800">Memories</h2>
          <div className="grid grid-cols-2 gap-3">
            {medias.map((media, idx) => (
              media.media_type.startsWith('video') ? (
                <div
                  key={`video-${idx}`}
                  className="overflow-hidden rounded-md shadow-md"
                >
                  <video
                    src={media.full_url}
                    className="w-full h-40 object-cover"
                    controls
                  />
                </div>
              ) : (
                <div
                  key={`img-${idx}`}
                  className="overflow-hidden rounded-md shadow-md"
                >
                  <img
                    src={media.full_url}
                    alt={`Memory ${idx + 1}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )
            ))}
          </div>
        </div>
      </Page>
    );
  }

  // Back cover
  contentPages.push(
    <Page key="back-cover" number={contentPages.length + 1} className={tone}>
      <div className="page-overlay flex flex-col justify-center items-center h-full">
        <p className="text-2xl font-serif text-center text-gray-700">The End</p>
      </div>
    </Page>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="book-container relative">
        <HTMLFlipBook
          width={width}
          height={height}
          size="fixed"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={700}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="book"
          style={{ margin: "0 auto" }}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {contentPages}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default DiaryBook;
