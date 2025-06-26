import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../shared/store';
import { 
  loadFavouritesAsync,
  addFavouriteAsync,
  removeFavouriteAsync
} from './favouritesSlice';
import { initFavoritesTable } from './favouritesStorage';

export const useFavouritesInit = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initFavourites = async () => {
      try {
        // Initialize the database table first
        await initFavoritesTable();
        // Then load favourites from database using async thunk
        dispatch(loadFavouritesAsync());
      } catch (error) {
        console.error('Error initializing favourites:', error);
      }
    };

    initFavourites();
  }, [dispatch]);
};

export const useFavouritesSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ids: favouriteIds, status } = useSelector((state: RootState) => state.favourites);

  const syncToDatabase = async (id: string, isFavourite: boolean) => {
    try {
      if (isFavourite) {
        dispatch(addFavouriteAsync(id));
      } else {
        dispatch(removeFavouriteAsync(id));
      }
    } catch (error) {
      console.error('Error syncing to database:', error);
    }
  };

  return { favouriteIds, status, syncToDatabase };
}; 