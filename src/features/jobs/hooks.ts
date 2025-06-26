import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../shared/store';
import { addFavouriteAsync, removeFavouriteAsync } from '../favourites/favouritesSlice';

export const useIsFavourite = (jobId: string) => {
  return useSelector((state: RootState) => 
    state.favourites.ids.includes(jobId)
  );
};

export const useFavouriteToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  return async (jobId: string, isFavourite: boolean) => {
    if (isFavourite) {
      dispatch(removeFavouriteAsync(jobId));
    } else {
      dispatch(addFavouriteAsync(jobId));
    }
  };
}; 