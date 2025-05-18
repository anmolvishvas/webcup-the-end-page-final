import axios from "axios";

const API_URL = "https://localhost:8000/api";

interface CreateEndPageRequest {
  user: string;
  title: string;
  content: string;
  tone: string;
  isPrivate: boolean;
  background_type: string | null;
  background_value: string | null;
  createdAt: string;
  emails: string[];
}

export interface CreateEndPageResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  id: string;
  uuid: string;
  user: string;
  title: string;
  content: string;
  tone: string;
  background_type: string;
  background_value: string;
  createdAt: string;
  totalRating: number;
  numberOfVotes: number;
  medias: Array<{
    url: string;
    type: string;
  }>;
  comments: Array<{
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }>;
  backgroundType: string;
  backgroundValue: string;
  private: boolean;
}

interface RatingResponse {
  endPage: {
    totalRating: number;
    numberOfVotes: number;
    averageRating: number;
  };
}

export const endPageService = {
  createEndPage: async (data: CreateEndPageRequest): Promise<{ success: boolean; data?: CreateEndPageResponse; error?: string }> => {
    try {
      const response = await axios.post<CreateEndPageResponse>(
        `${API_URL}/end_pages`,
        {
          ...data,
          emails: data.emails || []
        },
        {
          headers: {
            "Content-Type": "application/ld+json",
          }
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to create end page",
      };
    }
  },

  uploadFiles: async (pageId: string, files: File[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files[]', file);
      });

      await axios.post(
        `${API_URL}/end_pages/${pageId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to upload files",
      };
    }
  },

  getEndPage: async (uuid: string): Promise<{ success: boolean; data?: CreateEndPageResponse; error?: string }> => {
    try {
      const response = await axios.get<CreateEndPageResponse>(
        `${API_URL}/end_pages/${uuid}`,
        {
          headers: {
            "Content-Type": "application/ld+json",
          }
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to fetch end page",
      };
    }
  },

  addComment: async (uuid: string, comment: { text: string; author: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      await axios.post(
        `${API_URL}/end_pages/${uuid}/comments`,
        comment,
        {
          headers: {
            "Content-Type": "application/ld+json",
          }
        }
      );

      return {
        success: true,
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to add comment",
      };
    }
  },

  addRating: async (uuid: string, rating: number): Promise<{ success: boolean; data?: { totalRating: number; numberOfVotes: number; averageRating: number }; error?: string }> => {
    try {
      const response = await axios.put<RatingResponse>(
        `${API_URL}/end_pages/${uuid}/rating`,
        { rating },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      return {
        success: true,
        data: response.data.endPage
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to add rating",
      };
    }
  }
}; 