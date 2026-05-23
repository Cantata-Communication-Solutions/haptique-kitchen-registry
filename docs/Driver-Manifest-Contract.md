# Driver Manifest Contract

Drivers are capability providers. They should not own the full Haptique OS device page.

Required Kitchen listing fields:

```json
{
  "id": "com.example.denon-avr",
  "name": "Denon AVR Control",
  "type": "driver",
  "version": "0.1.0",
  "summary": "Adds local Denon AVR control to Haptique OS.",
  "author": "Example",
  "trustLevel": "community",
  "deviceClass": "av_receiver",
  "capabilities": ["power", "volume", "mute", "input_select"],
  "permissions": ["local_network", "device_control"],
  "compatibility": {
    "haptiqueOS": ">=1.0.6"
  },
  "source": {
    "repo": "https://github.com/example/haptique-denon-avr"
  },
  "driver": {
    "key": "DENON_AVR",
    "logicalDeviceUi": {
      "defaultLayout": "av_receiver",
      "primaryControls": ["power", "volume", "mute", "input_select"]
    }
  }
}
```

Installable drivers should also include:

```json
{
  "artifact": {
    "downloadUrl": "https://github.com/example/haptique-denon-avr/releases/download/v0.1.0/denon-avr.zip",
    "sha256": "..."
  }
}
```

The release ZIP must contain one Haptique driver manifest and one local driver source file.

