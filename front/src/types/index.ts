export interface EndPage {
  id: string;
  title: string;
  content: string;
  tone: Tone;
  createdAt: string;
  backgroundType: BackgroundType;
  backgroundValue: string;
  music?: string;
  images: string[];
  gifs: string[];
  videos: string[];
  comments: Comment[];
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
