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

Every installable artifact provides an HTTPS URL and SHA256. Community drivers can omit signing metadata and require explicit user trust for each unsigned release. Verified, Haptique-owned and non-driver artifacts also require a detached Ed25519 signature and trusted key ID. A supplied signature is always verified; partial signing metadata is rejected. Source-only entries omit the artifact block.

Community drivers run on the hub; declared permissions are disclosures, not a code sandbox. Checksum validation detects a download that differs from the registry listing, but does not certify the developer. Community packages cannot replace protected drivers or claim Haptique App ownership. Unsigned automatic updates remain disabled.

Packages may be blocked if they:

- hide network behavior
- access credentials without declaration
- break HomeKit/Homebridge persistence
- create duplicate media playback sessions
- install unreviewed background services
- replace OS-owned Logical Device UI
- fail uninstall or rollback cleanup
