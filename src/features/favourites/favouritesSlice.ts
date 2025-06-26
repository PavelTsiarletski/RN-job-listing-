import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllFavouriteIds, addFavourite, removeFavourite } from './favouritesStorage';

interface FavouritesState {
  ids: string[];
  status: 'idle' | 'loading' | 'error';
}

const initialState: FavouritesState = {
  ids: [],
  status: 'idle',
};

export const loadFavouritesAsync = createAsyncThunk('favourites/loadAll', async () => {
  const ids = await getAllFavouriteIds();
  return ids;
});

export const addFavouriteAsync = createAsyncThunk('favourites/add', async (id: string) => {
  await addFavourite(id);
  return id;
});

export const removeFavouriteAsync = createAsyncThunk('favourites/remove', async (id: string) => {
  await removeFavourite(id);
  return id;
});

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavouritesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadFavouritesAsync.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.ids = action.payload;
        state.status = 'idle';
      })
      .addCase(loadFavouritesAsync.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(addFavouriteAsync.fulfilled, (state, action: PayloadAction<string>) => {
        if (!state.ids.includes(action.payload)) {
          state.ids.push(action.payload);
        }
      })
      .addCase(removeFavouriteAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.ids = state.ids.filter(id => id !== action.payload);
      });
  },
});

export default favouritesSlice.reducer; 