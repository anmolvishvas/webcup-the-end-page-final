export interface EndPage {
  id: number;
  uuid: string;
  title: string;
  content: string;
  tone: string;
  createdAt: string;
  backgroundType: string;
  backgroundValue: string;
  background_type: string;
  background_value: string;
  totalRating?: number;
  numberOfVotes?: number;
  averageRating?: number;
  isPrivate?: boolean;
  comments?: Array<{
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }>;
  medias?: Array<{
    id: number;
    media_type: string;
    url: string;
    full_url: string;
    original_filename: string;
    file_size: number;
    createdAt: string;
  }>;
  images?: string[];
  videos?: string[];
  gifs?: string[];
  music?: string;
}

export interface EndPagesCollection {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: EndPage[];
}

export type Tone =
  | "dramatic"
  | "ironic"
  | "absurd"
  | "honest"
  | "passive-aggressive"
  | "ultra-cringe"
  | "classe"
  | "touchant";

export type BackgroundType = "image";

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface GiphyResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export interface GiphyGif {
  id: string;
  url: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
      width: string;
      height: string;
    };
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  userType: 'writer' | 'reader';
}
