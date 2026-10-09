# Security And Permissions

Kitchen packages must declare every permission they need.

Supported Beta permissions:

- `device_control`
- `local_network`
- `cloud_access`
- `credential_storage`
- `background_service`
- `media_playback`
- `homekit_bridge`
- `automation_runtime`
- `dashboard_ui`

Haptique OS must show permissions before installation.

An installable artifact must provide its HTTPS URL, SHA256, detached Ed25519 signature and signing key ID. Source-only entries remain permitted, without an artifact block. The schema checks the signature's format; HOS must verify it against a trusted public key and the exact downloaded ZIP before activation. Unknown artifact fields and incomplete signing metadata are rejected.

Packages may be blocked if they:

- hide network behavior
- access credentials without declaration
- break HomeKit/Homebridge persistence
- create duplicate media playback sessions
- install unreviewed background services
- replace OS-owned Logical Device UI
- fail uninstall or rollback cleanup
