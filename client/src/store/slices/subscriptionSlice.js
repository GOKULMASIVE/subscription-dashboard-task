import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/plans");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/my-subscription");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const subscribeToPlan = createAsyncThunk(
  "subscription/subscribe",
  async (planId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/subscribe/${planId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchAllSubscriptions = createAsyncThunk(
  "subscription/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/admin/subscriptions?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    plans: [],
    mySubscription: null,
    allSubscriptions: [],
    pagination: null,
    loading: false,
    subscribeLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSubscriptionMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Plans
    builder.addCase(fetchPlans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // My subscription
    builder.addCase(fetchMySubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMySubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.mySubscription = action.payload;
    });
    builder.addCase(fetchMySubscription.rejected, (state) => {
      state.loading = false;
      state.mySubscription = null;
    });

    // Subscribe
    builder.addCase(subscribeToPlan.pending, (state) => {
      state.subscribeLoading = true;
      state.error = null;
    });
    builder.addCase(subscribeToPlan.fulfilled, (state, action) => {
      state.subscribeLoading = false;
      state.mySubscription = action.payload;
      state.successMessage = "Subscription activated!";
    });
    builder.addCase(subscribeToPlan.rejected, (state, action) => {
      state.subscribeLoading = false;
      state.error = action.payload;
    });

    // All subscriptions
    builder.addCase(fetchAllSubscriptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
      state.loading = false;
      state.allSubscriptions = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAllSubscriptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearSubscriptionMessages } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
