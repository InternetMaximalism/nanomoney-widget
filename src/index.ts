interface WidgetOptions {
  clientId: string;
  position?: "left" | "right"; // [default: right]
  url?: string;
  style?: { [key: string]: string };
  onLoad?: () => void;
}

const NANO_MONEY_URL = "https://widget.nanomoney.plasmanext.io/";

const initialButtonSize = {
  width: "112px",
  height: "132px",
};

export class NanoMoneyWidget {
  constructor(private containerId: string, private options: WidgetOptions) {}

  mount() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error("Container not found.");
      return;
    }

    if (!this.options.clientId) {
      throw new Error("clientId is required.");
    }

    const iframe = document.createElement("iframe");
    const queryParams = this.buildQueryParams();
    const walletUrl = this.options.url || NANO_MONEY_URL;
    const widgetUrl = walletUrl + (queryParams ? `?${queryParams}` : "");

    this.configureIframe(iframe, widgetUrl, walletUrl);
    this.setupIframeListener(iframe, walletUrl);
    // iframe.id = "iframe-content"
    iframe.onload = () => {
      if (this.options.onLoad) {
        this.options.onLoad();
      }
    };
    container.appendChild(iframe);
  }

  private buildQueryParams(): string {
    const allowedKeys = ["clientId", "position"];
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(this.options)) {
      if (allowedKeys.includes(key) && value) {
        queryParams.append(key, encodeURIComponent(value));
      }
    }
    return queryParams.toString();
  }

  private configureIframe(
    iframe: HTMLIFrameElement,
    widgetUrl: string,
    walletUrl: string
  ): void {
    iframe.setAttribute("src", widgetUrl);
    iframe.setAttribute("allow", `publickey-credentials-get ${walletUrl}`);
    Object.assign(iframe.style, {
      border: this.options.style?.border || "none",
      ...initialButtonSize,
      ...this.options.style,
    });
  }

  private setupIframeListener(iframe: HTMLIFrameElement, walletUrl: string) {
    const onTogglePopup = (event: MessageEvent) => {
      if (event.origin !== new URL(walletUrl).origin) return;
      if (event.data.type === "popupOpen") {
        Object.assign(iframe.style, {
          width: this.options.style?.width || "100vw",
          height: this.options.style?.height || "700px",
        });
      } else if (event.data.type === "popupClose") {
        Object.assign(iframe.style, initialButtonSize);
      }
    };
    window.addEventListener("message", onTogglePopup, false);
  }
}

export default NanoMoneyWidget;
