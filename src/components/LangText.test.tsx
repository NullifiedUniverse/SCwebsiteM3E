import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LangText } from "./LangText";

describe("LangText Component Tests", () => {
  const content = {
    EN: "Student Council",
    ZH: "學生會"
  };

  test("correctly renders English translation", () => {
    render(<LangText content={content} lang="EN" />);
    expect(screen.getByText("Student Council")).toBeInTheDocument();
  });

  test("correctly renders Chinese translation", () => {
    render(<LangText content={content} lang="ZH" />);
    expect(screen.getByText("學生會")).toBeInTheDocument();
  });

  test("renders plain string content directly", () => {
    render(<LangText content="Hello World" lang="EN" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("applies inline-block styling if inline is true", () => {
    render(<LangText content={content} lang="EN" inline />);
    const span = screen.getByText("Student Council");
    expect(span).toHaveStyle({ display: "inline-block" });
  });

  test("applies block styling if inline is false", () => {
    render(<LangText content={content} lang="EN" inline={false} />);
    const span = screen.getByText("Student Council");
    expect(span).toHaveStyle({ display: "block" });
  });

  test("applies custom class names and inline styles", () => {
    render(
      <LangText
        content={content}
        lang="EN"
        className="test-class-xyz"
        style={{ color: "rgb(255, 0, 0)" }}
      />
    );
    const span = screen.getByText("Student Council");
    expect(span).toHaveClass("test-class-xyz");
    expect(span).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });
});
