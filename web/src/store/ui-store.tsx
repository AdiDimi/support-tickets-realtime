// ui-store.tsx
import React, { createContext, useContext, useReducer } from "react";

/* ---------- Enums ---------- */
export enum TicketStatus {
  All = "All",
  Open = "Open",
  InProgress = "InProgress",
  Resolved = "Resolved",
}

export enum TicketPriority {
  All = "All",
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical",
}

export enum ActionType {
  ToggleSidebar = "toggleSidebar",
  SetStatus = "setStatus",
  SetPriority = "setPriority",
}

/* ---------- State ---------- */
export type Filters = {
  status: TicketStatus;
  priority: TicketPriority;
};

export type UIState = {
  sidebarOpen: boolean;
  filters: Filters;
};

/* ---------- Actions ---------- */
export type Action =
  | { type: ActionType.ToggleSidebar }
  | { type: ActionType.SetStatus; payload: TicketStatus }
  | { type: ActionType.SetPriority; payload: TicketPriority };

/* ---------- Initial State ---------- */
const initial: UIState = {
  sidebarOpen: false,
  filters: { status: TicketStatus.All, priority: TicketPriority.All },
};

/* ---------- Reducer ---------- */
function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case ActionType.ToggleSidebar:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ActionType.SetStatus:
      return {
        ...state,
        filters: { ...state.filters, status: action.payload },
      };
    case ActionType.SetPriority:
      return {
        ...state,
        filters: { ...state.filters, priority: action.payload },
      };
    default:
      return state;
  }
}
