import { createSelector, createSlice } from "@reduxjs/toolkit";
import { initialUsers } from "../../data/dummyData";

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    clients: initialUsers,
    searchTerm: "",
    filterStatus: "All",
  },
  reducers: {
    addClient: (state, action) => {
      const user = action.payload;
      const newClient = {
        id: state.clients.length + 1,
        ...user,
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: "Just now",
      };
      state.clients.push(newClient);
    },
    deleteClient: (state, action) => {
      const id = action.payload;
      state.clients = state.clients.filter((client) => client.id !== id);
    },
    updateClient: (state, action) => {
      const updateClient = action.payload;
      const index = state.clients.findIndex(
        (client) => client.id === updateClient.id
      );
      if (index !== -1) {
        state.clients[index] = { ...state.clients[index], ...updateClient };
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});
export const {
  addClient,
  deleteClient,
  updateClient,
  setSearchTerm,
  setFilterStatus,
} = clientsSlice.actions;

// Selector
export const selectedAllClients = createSelector(
  [
    (state) => state.clients.clients,
    (state) => state.clients.searchTerm,
    (state) => state.clients.filterStatus,
  ],
  (clients, searchTerm, filterStatus) => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "All" || client.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }
);
export const selectedSearchTerm = (state) => state.clients.searchTerm;
export const selectedFilterStatus = (state) => state.clients.filterStatus;

export const selectTotalClients = createSelector(
    [(state) => state.clients.clients],
    (clients) => ({total: clients.length})
)
export const selectActiveClients = createSelector(
  [(state) => state.clients.clients],
  (clients) => ({ active: clients.filter((c) => c.status === "Active").length })
);

export const selectInactiveClients = createSelector(
  [(state) => state.clients.clients],
  (clients) => ({ inactive: clients.filter((c) => c.status === "Inactive").length })
);

export default clientsSlice.reducer;
