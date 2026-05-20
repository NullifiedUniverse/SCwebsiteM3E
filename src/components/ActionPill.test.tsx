import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionPill } from "./ActionPill";

describe("ActionPill Component Tests", () => {
  test("initializes with submit text and light active container styling", () => {
    render(<ActionPill lang="EN" />);
    
    const button = screen.getByRole("button", { name: /Submit a proposal/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveStyle({
      backgroundColor: "var(--md-primary-container)"
    });
    
    expect(screen.getByText("Submit Proposal")).toBeInTheDocument();
  });

  test("toggles state and text on click and updates accessibility attributes", () => {
    render(<ActionPill lang="EN" />);
    
    const button = screen.getByRole("button", { name: /Submit a proposal/i });
    
    // Click button to activate
    fireEvent.click(button);
    
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("aria-label", "Proposal submitted");
    expect(button).toHaveStyle({
      backgroundColor: "var(--md-primary)"
    });
    expect(screen.getByText("✓ Confirmed")).toBeInTheDocument();
    
    // Click again to deactivate
    fireEvent.click(button);
    
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("aria-label", "Submit a proposal");
    expect(button).toHaveStyle({
      backgroundColor: "var(--md-primary-container)"
    });
    expect(screen.getByText("Submit Proposal")).toBeInTheDocument();
  });

  test("renders text perfectly in Chinese mode", () => {
    render(<ActionPill lang="ZH" />);
    
    const button = screen.getByRole("button");
    expect(screen.getByText("提交提案")).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByText("✓ 已確認")).toBeInTheDocument();
  });
});
