import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { queryClient } from "../data/queryClient";

export function useTicketRealtime() {
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(base.replace(/\/$/, "") + "/hubs/tickets", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    const refetch = () =>
      queryClient.invalidateQueries({ queryKey: ["tickets"] });

    conn.on("ticketCreated", refetch);
    conn.on("ticketUpdated", refetch);

    conn.start().catch(console.error);

    return () => {
      conn.stop();
    };
  }, []);
}
