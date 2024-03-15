# NanoMoney Widget

## How to Use

First, install the nanomoney-widget package using npm by running the following command in your terminal:

```bash
npm i nanomoney-widget
```

Next, import the NanoMoneyWidget into your project file like so:

```ts
import NanoMoneyWidget from "nanomoney-widget";
```

Then, create an instance of the NanoMoneyWidget and mount it to a specific element in your DOM. Replace "your-client-id" with your actual client ID. You can also customize the widget's style by adjusting its properties, such as width:

```ts
const walletWidget = new NanoMoneyWidget("widget-container", {
  clientId: "your-client-id",
});
walletWidget.mount();
```

Finally, ensure you have an HTML element with the ID that matches the one provided to the NanoMoneyWidget constructor ("widget-container" in this case). This is where the widget will be rendered:

```html
<div id="widget-container" style="position: fixed; right: 0; bottom: 0;" />
```

The full NextJS example can be found in [examples/next](example/next/README.md) directory.

## Options

When initializing the `NanoMoneyWidget`, you can provide several options to customize its behavior and appearance:

- `clientId` (required): Your unique client identifier.
- `url` (optional): The URL to the nanomoney, if you want to use a custom or development environment.
- `style` (optional): Custom styles for the iframe container, such as width and height.
- `onLoad` (optional): A callback function that is called when the widget is fully loaded.
