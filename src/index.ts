import { Storage } from "./storage.js";

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

const MessageType = {
  POPUP_OPEN: "popupOpen",
  POPUP_CLOSE: "popupClose",
  SYNC_STATE_TO_IFRAME: "syncStateToIframe",
  SEND_STATE_TO_PARENT: "sendStateToParent",
};

const NANOMONEY_LOCAL_STORAGE_KEY = "nanomoney-widget.account.store";

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

    this.configureIframe(iframe, widgetUrl);
    this.setupIframeListener(iframe, walletUrl);

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

  private configureIframe(iframe: HTMLIFrameElement, widgetUrl: string): void {
    iframe.setAttribute("src", widgetUrl);
    Object.assign(iframe.style, {
      border: this.options.style?.border || "none",
      ...initialButtonSize,
      ...this.options.style,
    });
  }

  private setupIframeListener(iframe: HTMLIFrameElement, walletUrl: string) {
    const onTogglePopup = (event: MessageEvent) => {
      if (event.origin !== new URL(walletUrl).origin) return;
      if (!event.data.type) return;
      switch (event.data.type) {
        case MessageType.POPUP_OPEN:
          this.adjustIframeStyle(iframe, { width: "100vw", height: "700px" });
          this.syncStateWithIframe(iframe, walletUrl);
          break;
        case MessageType.POPUP_CLOSE:
          this.adjustIframeStyle(iframe, initialButtonSize);
          break;
        case MessageType.SEND_STATE_TO_PARENT:
          this.sendStateToParent(iframe, event.data.state);
          break;
      }
    };

    window.addEventListener("message", onTogglePopup, false);
  }

  private adjustIframeStyle(
    iframe: HTMLIFrameElement,
    { width, height }: { width: string; height: string }
  ) {
    const style = {
      width: this.options.style?.width || width,
      height: this.options.style?.height || height,
    };
    Object.assign(iframe.style, style);
  }

  private syncStateWithIframe(iframe: HTMLIFrameElement, walletUrl: string) {
    if (iframe.contentWindow) {
      const state = Storage.get(NANOMONEY_LOCAL_STORAGE_KEY);
      const message = {
        type: MessageType.SYNC_STATE_TO_IFRAME,
        state,
      };
      iframe.contentWindow.postMessage(message, walletUrl);
    }
  }

  private sendStateToParent(iframe: HTMLIFrameElement, state: any) {
    if (iframe.contentWindow) {
      Storage.set(NANOMONEY_LOCAL_STORAGE_KEY, state);
    }
  }
}

export default NanoMoneyWidget;
