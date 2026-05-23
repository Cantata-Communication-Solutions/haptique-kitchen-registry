# Logical Device UI Contract

The core Logical Device UI is owned by Haptique OS.

Kitchen drivers declare:

- device class
- capabilities
- commands
- state model
- config schema
- UI hints

Haptique OS renders:

- layout
- navigation
- control styling
- responsive behavior
- loading states
- errors
- safety confirmations

Drivers may provide:

- labels
- icons
- primary control order
- default layout hint
- optional widgets or advanced control panels

Drivers must not:

- replace core navigation
- replace the default Logical Device page
- hide OS state/errors
- bypass permissions
- create unreviewed background services

