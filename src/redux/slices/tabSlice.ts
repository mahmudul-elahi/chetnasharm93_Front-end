import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
  activeTab: number;
  lastVisitedPage: string | null;
}

const initialState: TabState = {
  activeTab: 0,
  lastVisitedPage: null,
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
      // Optional: Save to localStorage for persistence across refreshes
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeTab', action.payload.toString());
      }
    },
    restoreTabFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab !== null) {
          state.activeTab = parseInt(savedTab);
        }
      }
    },
    setLastVisitedPage: (state, action: PayloadAction<string>) => {
      state.lastVisitedPage = action.payload;
    },
  },
});

export const { setActiveTab, restoreTabFromStorage, setLastVisitedPage } = tabSlice.actions;
export default tabSlice.reducer;