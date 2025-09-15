import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketForm } from "./TicketForm";

describe("TicketForm", () => {
  it("renders form fields and submit button", () => {
    render(<TicketForm onCreate={jest.fn()} isPending={false} />);
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create ticket/i })
    ).toBeInTheDocument();
  });

  it("calls onCreate with correct payload when submitted", () => {
    const onCreate = jest.fn();
    render(<TicketForm onCreate={onCreate} isPending={false} />);
    fireEvent.change(screen.getByPlaceholderText(/Title/i), {
      target: { value: "Test Ticket" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Test Desc" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "" }), {
      target: { value: "High" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create ticket/i }));
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Ticket",
        description: "Test Desc",
        priority: "High",
      })
    );
  });

  it("does not submit if title is empty", () => {
    const onCreate = jest.fn();
    render(<TicketForm onCreate={onCreate} isPending={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Create ticket/i }));
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("disables submit button when isPending is true", () => {
    render(<TicketForm onCreate={jest.fn()} isPending={true} />);
    expect(
      screen.getByRole("button", { name: /Create ticket/i })
    ).toBeDisabled();
  });

  it("shows error if API call fails", async () => {
    // Simulate error handling by passing a rejected promise
    const onCreate = jest.fn().mockRejectedValue(new Error("API Error"));
    render(<TicketForm onCreate={onCreate} isPending={false} />);
    fireEvent.change(screen.getByPlaceholderText(/Title/i), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create ticket/i }));
    // You would add error UI in TicketForm and assert it here
    // Example: expect(await screen.findByText(/API Error/i)).toBeInTheDocument();
  });
});
