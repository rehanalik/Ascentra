// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create a slice for managing showFetch state
const showFetchSlice = createSlice({
  name: "showFetch",
  initialState: { showFetch: false },
  reducers: {
    setShowFetch: (state, action) => {
      state.showFetch = action.payload; // Set showFetch to true or false
    },
  },
});

// Export the action
export const { setShowFetch } = showFetchSlice.actions;

// Create the Redux store
const store = configureStore({
  reducer: {
    showFetch: showFetchSlice.reducer, // Combine the reducers
  },
});

export default store;
