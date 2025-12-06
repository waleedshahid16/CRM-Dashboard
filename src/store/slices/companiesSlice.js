import { createSelector, createSlice } from "@reduxjs/toolkit";
import { companiesData } from "../../data/companiesData";

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    companies: companiesData,
    searchTerm: "",
    filterIndustry: "All",
  },
  reducers: {
    addCompany: (state, action) => {
      const company = action.payload;
      const newCompany = {
        id: state.companies.length + 1,
        ...company,
      };
      state.companies.push(newCompany);
    },
    deleteCompany: (state, action) => {
      const id = action.payload;
      state.companies = state.companies.filter((company) => company.id !== id);
    },
    updateCompany: (state, action) => {
      const updateCompany = action.payload;
      const index = state.companies.findIndex(
        (company) => company.id === updateCompany.id
      );
      if (index !== -1) {
        state.companies[index] = {
          ...state.companies[index],
          ...updateCompany,
        };
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterIndustry: (state, action) => {
      state.filterIndustry = action.payload;
    },
  },
});
export const {
  addCompany,
  deleteCompany,
  updateCompany,
  setSearchTerm,
  setFilterIndustry,
} = companiesSlice.actions;

// Selector

export const selectAllCompanies = createSelector(
  [
    (state) => state.companies.companies,
    (state) => state.companies.searchTerm,
    (state) => state.companies.filterIndustry,
  ],
  (companies, searchTerm, filterIndustry) => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterIndustry === "All" || company.industry === filterIndustry;
      return matchesSearch && matchesFilter;
    });
  }
);

export const selectSearchTerm = (state) => state.companies.searchTerm;
export const selectFilterIndustry = (state) => state.companies.filterIndustry;

export const selectIndustries = createSelector(
  [(state) => state.companies.companies],
  (companies) => ["All", ...new Set(companies.map((c) => c.industry))]
);
export const selectActiveCompanies = createSelector(
  [(state) => state.companies.companies],
  (companies) => ({
    active: companies.filter((c) => c.status === "Active").length,
  })
);
export default companiesSlice.reducer;
