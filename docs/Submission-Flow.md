# Submission Flow

Beta submissions use GitHub pull requests.

1. Build and test the package locally in Haptique OS.
2. For drivers, prefer generating the package through AI Driver Builder.
3. Publish the source repository and release artifact if installable.
4. Add a JSON listing under `packages/<type>/`.
5. Run `npm ci`, `npm test` and `npm run validate`.
6. Open a pull request.
7. Haptique reviews metadata, permissions, install behavior, docs, and diagnostics.
8. Once merged, the package appears in Haptique Kitchen after catalog refresh.

Source-only listings omit `artifact`. Merging them makes their source and documentation discoverable; HOS displays **Not Installable**.

For a `community` driver, publish the developer-owned runtime ZIP and add:

- `artifact.downloadUrl`: public HTTPS release ZIP URL.
- `artifact.sha256`: SHA256 of the exact published ZIP bytes.

A Haptique signing request is not required. After the registry PR is merged and the catalog is generated, compatible HOS runtimes show **Install**. The user reviews the source and permissions, then chooses **Trust & install**. Consent is bound to the exact artifact checksum; every unsigned update requires a new confirmation. Unsigned drivers execute on the user's hub and are not sandboxed by the declared permissions.

Verified, core-candidate, built-in and non-driver packages still require both `artifact.signature` and `artifact.signingKeyId`. These use the approved secure signing process. Community signing remains optional, but if either field is supplied, both are required and HOS verifies the signature; invalid signing metadata cannot fall back to unsigned installation.

The signing payload is UTF-8, with no trailing newline:

```text
haptique-app-v1
id:<package id>
type:<package type>
version:<package version>
sha256:<lowercase ZIP SHA256>
```

Registry CI validates metadata shape. HOS verifies the downloaded checksum, compatibility, ZIP allowlist, driver key/version and protected integration boundaries before installation. Unsigned community packages cannot claim Haptique App ownership or replace protected drivers. Unsigned automatic updates are disabled.

Older HOS releases still require signatures for Kitchen installation. Deploy the HOS community-install runtime update before relying on this flow; until then, use local Upload Driver for testing. Registry acceptance does not establish real-device compatibility or promote the driver into HOS core.

Never put private keys in the listing, repository or CI fixtures.
