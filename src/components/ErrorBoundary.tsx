import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { LangText } from "./LangText";

interface Props {
  children: ReactNode;
  sectionName?: string;
  lang?: string;
  darkMode?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const sectionLabel = this.props.sectionName || "Section";
      const isZh = this.props.lang === "ZH";

      return (
        <div
          className="p-8 sm:p-12 w-full flex flex-col items-center text-center backdrop-blur-sm shadow-md border"
          style={{
            backgroundColor: "var(--md-surface-container-high)",
            borderColor: "var(--md-error)",
            borderRadius: "var(--md-shape-extra-large)",
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              backgroundColor: "var(--md-error-container)",
              color: "var(--md-on-error-container)",
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h3
            className="md-headline-small font-black mb-3"
            style={{ color: "var(--md-on-surface)" }}
          >
            <LangText
              content={{
                EN: `Error in ${sectionLabel}`,
                ZH: `${isZh ? sectionLabel.replace("Section", "區塊") : sectionLabel}載入錯誤`
              }}
              lang={this.props.lang || "EN"}
              inline
            />
          </h3>

          <p
            className="md-body-medium mb-6 max-w-md opacity-80"
            style={{ color: "var(--md-on-surface-variant)" }}
          >
            <LangText
              content={{
                EN: "Something went wrong while rendering this section. You can try refreshing the section or the page.",
                ZH: "此區塊載入時發生預期外的錯誤。您可以嘗試重新載入此區塊或重新整理網頁。"
              }}
              lang={this.props.lang || "EN"}
              inline
            />
          </p>

          <button
            onClick={this.handleRetry}
            className="cursor-pointer h-10 px-5 rounded-full flex items-center justify-center gap-2 md-label-large font-bold outline-none border transition-colors duration-200"
            style={{
              backgroundColor: "var(--md-primary)",
              color: "var(--md-on-primary)",
              borderColor: "transparent",
            }}
          >
            <RefreshCw size={16} />
            <LangText
              content={{ EN: "Retry Loading", ZH: "重新載入" }}
              lang={this.props.lang || "EN"}
              inline
            />
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
