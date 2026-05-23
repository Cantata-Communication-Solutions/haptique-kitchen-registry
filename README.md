# Haptique Kitchen Registry

Haptique Kitchen is the local-first community extension registry for Haptique OS.

This registry lists community drivers, widgets, recipes, scenes, and AI Driver Builder templates that can be discovered from inside Haptique OS. The OS remains responsible for compatibility checks, permissions, install, rollback, diagnostics, and Logical Device UI rendering.

## Beta Publishing Model

The Beta registry uses a transparent GitHub workflow:

1. Build and test a package locally in Haptique OS or AI Driver Builder.
2. Publish the package source or release artifact in a public GitHub repository.
3. Add a package manifest under `packages/<type>/`.
4. Open a pull request.
5. CI validates schema, trust level, permissions, source links, and package shape.
6. A Haptique maintainer reviews and merges.
7. The generated `catalog/index.json` becomes visible inside Haptique Kitchen.

## Trust Levels

- `community`: listed after automated validation and maintainer review.
- `verified`: passed stronger install, uninstall, diagnostics, and compatibility checks.
- `core-candidate`: accepted by Haptique for future OTA consideration.
- `built-in`: shipped through Haptique OS OTA and shown as part of core.
- `deprecated`: no longer recommended.
- `blocked`: not installable due to safety, security, or compatibility risk.

## Logical Device UI Rule

Drivers declare capabilities. Haptique OS renders the core Logical Device UI.

Drivers may provide UI hints and optional widgets, but they must not replace OS navigation or the default Logical Device surface.

## Repository Layout

```text
catalog/                 Generated static catalog read by Haptique OS
packages/                Human-authored package listing manifests
schemas/                 JSON Schemas enforced by CI
validations/             Policy inputs for CI and review
blocked/                 Blocked package/version records
deprecated/              Deprecated package records
verified/                Verified package records
tools/                   Catalog validation and generation scripts
.github/workflows/       Pull request validation and catalog publishing
```

Developer docs live under `docs/` while GitHub Wiki initialization is unavailable. The Wiki can mirror those pages once GitHub exposes the `.wiki.git` remote.
