# VENDING MACHINE 3000

This project simulates (to some extents) an incomplete vending machine.
The machine won't work by itself. The different components do not have a shared logic, some of them communicate with internal messages, but most of the logic to handle the user flow is missing.

The objective is to make the machine work using the available APIs, without modifying the vending machine HTML/js code.

The usage of internal APIs is prohibited

## Messaging API

The API works via _messages_.
The messages follow this schema:

```ts
type Message = { channel: "vending-machine"; type: TYPE; data: DATA };
```

The vending machine will emit the following messages through [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage):

### Messages

#### Print to display

Type: `print`
Parameters (1): A string.

Will display the string to the LCD display.

#### Drop an item

Type: `drop-item`
Parameters (1): The item's code in string form (eg. "01")

Will prompt the vending machine to drop an item. Will throw an error if the item is out of stock.

#### Drop a coin

Type: `drop-coin`
Parameters (1): The value of the coin to drop (eg. "200","100","10","2"...etc)

Will prompt the vending machine to drop an item. Will throw an error if the coin is out of stock.

#### Emit a receipt

Type: `emit-receipt`
Parameters (1): The due refund amount (eg. 200 means 2€)

The vending machine will emit the receipt, which will include the due amount in its content.

#### Get the amount of available coins of each type

Type: `get-available-coins`
Parameters (NONE)

Will prompt the vending machine to send a message containing the current amount of coins for each type of currency.
The vending machine will send a message of type `available-coins`, the `data` field contains a JSON string, more details below.
An event handler must be set in place to handle this response.

#### Get information about the displayed item

Type: `get-item-details`
Parameters (1): The item's code (eg. "00")

Will prompt the vending machine to send a message containing info about the selected item.
An event handler must be set in place to handle this response.

More details below.

### Emitted messages

The following messages will be sent by the vending machine, and you'll be able to handle them.

#### The user clicks on a button

type: `input`
data (1): The user input (eg. "0","1","REFUND","CANC")

#### The user inserts a coin

type: `coin-inserted`
data (1): The inserted coin value (eg. "10","100","200")

#### Handle `get-available-coins` response

Type: `available-coins`
data (1): A JSON string containing data about currencies availability
Example:

```json
{ "1": 1, "2": 4, "5": 8, "10": 5, "20": 6, "50": 1, "100": 6, "200": 3 }
```

#### Handle `get-item-details` response

Type: `item-coins`
data (1): A JSON string containing data about the item
Example:

```json
{ "name": "7UP", "price": 165, "stock": 7 }
```
