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

Packages may be blocked if they:

- hide network behavior
- access credentials without declaration
- break HomeKit/Homebridge persistence
- create duplicate media playback sessions
- install unreviewed background services
- replace OS-owned Logical Device UI
- fail uninstall or rollback cleanup

