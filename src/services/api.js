import axios from 'axios';

const BASE_URL = 'https://api.tvmaze.com';

export const getPopularShows = async () => {
  const response = await axios.get(`${BASE_URL}/shows`);
  return response.data;
};

export const formatRating = (rating) => {
  return rating?.average ? rating.average.toFixed(1) : 'N/A';
};

export const formatGenres = (genres) => {
  return genres && genres.length > 0 ? genres.join(', ') : 'No Genre';
};

export const stripHtml = (html) => {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
};