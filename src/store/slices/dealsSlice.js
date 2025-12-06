import { createSelector, createSlice } from "@reduxjs/toolkit";
import { dealsData } from "../../data/dealsData";

const dealsSlice = createSlice({
  name: "deals",
  initialState: {
    deals: dealsData,
    searchTerm: "",
    filterStage: "All",
    filterStatus: "All",
  },
  reducers: {
    addDeal: (state, action) => {
      const deal = action.payload;

      // Handle date formatting
      const formatDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) {
          return date.toISOString().split("T")[0];
        }
        return date;
      };

      const newDeal = {
        id: state.deals.length + 1,
        dealName: deal.dealName || "",
        pipeline: deal.pipeline || "",
        status: deal.status || "New",
        dealValue: deal.dealValue || "0",
        currency: deal.currency || "USD",
        period: deal.period || "One-time",
        periodValue: deal.periodValue || null,
        contact: deal.contact || "",
        project: deal.project || [],
        dueDate: formatDate(deal.dueDate),
        expectedClosingDate: formatDate(deal.expectedClosingDate),
        assignee: deal.assignee || "",
        followUpDate: formatDate(deal.followUpDate),
        source: deal.source || "",
        tags: deal.tags || [],
        priority: deal.priority || "Medium",
        description: deal.description || "",
        createdDate: new Date().toISOString().split("T")[0],
      };

      state.deals.push(newDeal);
    },

    deleteDeal: (state, action) => {
      const id = action.payload;
      state.deals = state.deals.filter((deal) => deal.id !== id);
    },

    updateDeal: (state, action) => {
      const updateDeal = action.payload;
      const index = state.deals.findIndex((deal) => deal.id === updateDeal.id);

      if (index !== -1) {
        // Handle date formatting for updates
        const formatDate = (date) => {
          if (!date) return null;
          if (date instanceof Date) {
            return date.toISOString().split("T")[0];
          }
          return date;
        };

        state.deals[index] = {
          ...state.deals[index],
          ...updateDeal,
          dueDate: formatDate(updateDeal.dueDate) || state.deals[index].dueDate,
          expectedClosingDate:
            formatDate(updateDeal.expectedClosingDate) ||
            state.deals[index].expectedClosingDate,
          followUpDate:
            formatDate(updateDeal.followUpDate) ||
            state.deals[index].followUpDate,
        };
      }
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setFilterStage: (state, action) => {
      state.filterStage = action.payload;
    },

    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  addDeal,
  deleteDeal,
  updateDeal,
  setSearchTerm,
  setFilterStage,
  setFilterStatus,
} = dealsSlice.actions;

// Selectors
export const selectAllDeals = createSelector(
  [
    (state) => state.deals.deals,
    (state) => state.deals.searchTerm,
    (state) => state.deals.filterStage,
    (state) => state.deals.filterStatus,
  ],
  (deals, searchTerm, filterStage, filterStatus) => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.pipeline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.project?.some((p) =>
          p.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        deal.tags?.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStage = filterStage === "All" || deal.status === filterStage;
      const matchesStatus =
        filterStatus === "All" || deal.status === filterStatus;

      return matchesSearch && matchesStage && matchesStatus;
    });
  }
);

export const selectSearchTerm = (state) => state.deals.searchTerm;
export const selectFilterStage = (state) => state.deals.filterStage;
export const selectFilterStatus = (state) => state.deals.filterStatus;

export const selectTotalDeals = createSelector(
  [(state) => state.deals.deals],
  (deals) => ({ total: deals.length })
);

export const selectActiveDeals = createSelector(
  [(state) => state.deals.deals],
  (deals) => ({
    active: deals.filter(
      (d) =>
        d.status !== "Closed Won" &&
        d.status !== "Closed Lost" &&
        d.status !== "Lost"
    ).length,
  })
);

export const selectWonDeals = createSelector(
  [(state) => state.deals.deals],
  (deals) => ({
    won: deals.filter((d) => d.status === "Closed Won" || d.status === "Won")
      .length,
  })
);

export const selectLostDeals = createSelector(
  [(state) => state.deals.deals],
  (deals) => ({
    lost: deals.filter((d) => d.status === "Closed Lost" || d.status === "Lost")
      .length,
  })
);

export const selectTotalValue = createSelector(
  [(state) => state.deals.deals],
  (deals) => {
    const total = deals
      .filter((d) => d.status !== "Closed Lost" && d.status !== "Lost")
      .reduce((sum, deal) => {
        const value = parseInt(deal.dealValue || "0");
        return sum + value;
      }, 0);
    return { value: `$${(total / 1000).toFixed(0)}K` };
  }
);

export const selectDealsByPipeline = createSelector(
  [(state) => state.deals.deals],
  (deals) => {
    const pipelines = {};
    deals.forEach((deal) => {
      const pipeline = deal.pipeline || "Unknown";
      pipelines[pipeline] = (pipelines[pipeline] || 0) + 1;
    });
    return pipelines;
  }
);

export const selectDealsByStatus = createSelector(
  [(state) => state.deals.deals],
  (deals) => {
    const statuses = {};
    deals.forEach((deal) => {
      const status = deal.status || "Unknown";
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return statuses;
  }
);

export default dealsSlice.reducer;
