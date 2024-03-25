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

If you are using NextJS, please refer to [examples/next](examples/next/README.md) directory.
If you are using Framer, please refer to [examples/plain](examples/plain/index.html) directory on how to write script tags.

## Options

When initializing the `NanoMoneyWidget`, you can provide several options to customize its behavior and appearance:

- `clientId` (required): Your unique client identifier.
- `position` (optional): The position of the widget on the screen, such as "left" or "right". Default is "right".
- `url` (optional): The URL to the nanomoney, if you want to use a custom or development environment.
- `style` (optional): Custom styles for the iframe container, such as width and height.
- `onLoad` (optional): A callback function that is called when the widget is fully loaded.
