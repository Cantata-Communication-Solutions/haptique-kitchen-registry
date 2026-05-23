# Submission Flow

Beta submissions use GitHub pull requests.

1. Build and test the package locally in Haptique OS.
2. For drivers, prefer generating the package through AI Driver Builder.
3. Publish the source repository and release artifact if installable.
4. Add a JSON listing under `packages/<type>/`.
5. Run `npm install` and `npm run validate`.
6. Open a pull request.
7. Haptique reviews metadata, permissions, install behavior, docs, and diagnostics.
8. Once merged, the package appears in Haptique Kitchen after catalog refresh.

Source-only listings may be accepted, but they are not installable from the OS until an artifact is provided.

