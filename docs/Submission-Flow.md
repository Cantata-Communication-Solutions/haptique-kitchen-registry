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

For Kitchen installation, Haptique reviews the driver, rebuilds the exact runtime ZIP and signs its metadata through the approved secure signer. Then add all four fields:

- `artifact.downloadUrl`: public HTTPS release ZIP URL.
- `artifact.sha256`: SHA256 of the exact published ZIP bytes.
- `artifact.signature`: base64 Ed25519 signature (64 bytes) over the HOS `haptique-app-v1` payload.
- `artifact.signingKeyId`: signing identity whose public key is trusted by the target HOS runtime.

The signing payload is UTF-8, with no trailing newline:

```text
haptique-app-v1
id:<package id>
type:<package type>
version:<package version>
sha256:<lowercase ZIP SHA256>
```

Registry CI validates metadata shape. HOS verifies the downloaded checksum and cryptographic signature before installing; accepting metadata in CI does not establish signer trust or real-device compatibility. A signed community beta can remain `community` while user acceptance continues. Signing does not make the integration built-in.

Never put private keys in the listing, repository or CI fixtures. Local unsigned ZIP upload remains a separate developer-testing path.
