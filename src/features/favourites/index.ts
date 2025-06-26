// Re-export everything from the new favourites slice with async thunks
export { default } from './favouritesSlice';
export { 
  loadFavouritesAsync, 
  addFavouriteAsync, 
  removeFavouriteAsync 
} from './favouritesSlice'; 