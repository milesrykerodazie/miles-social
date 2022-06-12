import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../authApi";

//login action
export const login = createAsyncThunk(
  "auth/login",
  async ({ loginFromValues, router }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(loginFromValues);
      router.push("/");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// register action
export const register = createAsyncThunk(
  "auth/register",
  async ({ registerFromValues, router }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(registerFromValues);
      router.push("/");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: "",
    usersOnline: [],
    conversations: [],
  },

  reducers: {
    setLogOut: (state, action) => {
      state.user = null;
    },
    setUsersOnline: (state, action) => {
      state.usersOnline = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
  extraReducers: {
    //login pending
    [login.pending]: (state, action) => {
      state.isLoading = true;
      state.error = "";
    },
    //login resolve
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    //login reject
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
    //register pending
    [register.pending]: (state, action) => {
      state.isLoading = true;
    },
    //register resolve
    [register.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    //register reject
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
  },
});

export const { setLogOut, setUsersOnline, setConversations } =
  authSlice.actions;
export default authSlice.reducer;
