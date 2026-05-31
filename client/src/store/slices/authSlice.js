import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ── Thunks ──────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" },
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData);
      const { data } = await api.post("/auth/login", formData);
      console.log(data);
      return data.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (_) {}
  },
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ── Helpers ─────────────────────────────────────────────
const setTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ── Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      console.log("Pending....");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log("FullFilled");
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      setTokens(action.payload);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log("Rejected......");
      state.loading = false;
      console.log(action.payload, "-----");
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearTokens();
    });

    // Fetch me
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchMe.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearTokens();
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
