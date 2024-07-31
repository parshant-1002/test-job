import { createSlice } from '@reduxjs/toolkit';

const common = createSlice({
  name: 'common',
  initialState: { token: null, deviceToken: null },
  reducers: {
    updateAuthTokenRedux: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),
    updatDeviceTokenRedux: (state, action) => ({
      ...state,
      deviceToken: action.payload,
    }),
  },
});

export const { updateAuthTokenRedux, updatDeviceTokenRedux } = common.actions;

export default common.reducer;
