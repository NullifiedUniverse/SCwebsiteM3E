import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Crashing!");
  }
  return <div>Everything is fine!</div>;
};

describe("ErrorBoundary Component Tests", () => {
  test("renders children normally when there is no error", () => {
    render(
      <ErrorBoundary sectionName="TestSection" lang="EN">
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Everything is fine!")).toBeInTheDocument();
  });

  test("renders error UI fallback when a child crashes", () => {
    // Suppress console.error in vitest output for this test since we expect an error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary sectionName="TestSection" lang="EN">
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Error in TestSection")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong while rendering this section. You can try refreshing the section or the page.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry Loading" })).toBeInTheDocument();

    spy.mockRestore();
  });

  test("can recover from error state when retry is clicked", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary sectionName="TestSection" lang="EN">
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Error in TestSection")).toBeInTheDocument();

    // Rerender with a safe component
    rerender(
      <ErrorBoundary sectionName="TestSection" lang="EN">
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Click retry
    const retryBtn = screen.getByRole("button", { name: "Retry Loading" });
    fireEvent.click(retryBtn);

    // Verify it recovers and shows safe children
    expect(screen.getByText("Everything is fine!")).toBeInTheDocument();
    expect(screen.queryByText("Error in TestSection")).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
