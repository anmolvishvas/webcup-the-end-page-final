import { GiphyResponse } from "../types";

const GIPHY_API_URL = "https://api.giphy.com/v1/gifs";
const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Public beta key for testing

export const searchGifs = async (
  query: string,
  limit = 12,
  offset = 0
): Promise<GiphyResponse> => {
  try {
    const response = await fetch(
      `${GIPHY_API_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
        query
      )}&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GIFs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching GIFs:", error);
    return {
      data: [],
      pagination: {
        total_count: 0,
        count: 0,
        offset: 0,
      },
      meta: {
        status: 500,
        msg: "Error",
        response_id: "",
      },
    };
  }
};

export const getTrendingGifs = async (limit = 12): Promise<GiphyResponse> => {
  try {
    const response = await fetch(
      `${GIPHY_API_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending GIFs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
    return {
      data: [],
      pagination: {
        total_count: 0,
        count: 0,
        offset: 0,
      },
      meta: {
        status: 500,
        msg: "Error",
        response_id: "",
      },
    };
  }
};
