---
name: release
description: Cut a new MooshieUI release — bump versions, update release notes, validate, tag, and push
argument-hint: "Version number (e.g. 0.4.3) and a brief summary of changes"
agent: agent
---

Cut a new MooshieUI release. Follow every step in order.

## Required Information

Ask the user for:
1. **Version number** (e.g. `0.4.3`) — must be semver, no `v` prefix
2. **Summary of changes** — what features/fixes to include in release notes

## Checklist

### 1. Bump version in 3 files

All three must have the **exact same version string**:

- **`package.json`** → `"version": "X.Y.Z"`
- **`src-tauri/Cargo.toml`** → `version = "X.Y.Z"` (under `[package]`)
- **`src-tauri/tauri.conf.json`** → `"version": "X.Y.Z"`

After bumping, run `grep -n "X.Y.Z" package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json` to verify all three match.

> `Cargo.lock` updates automatically on next `cargo check`.

### 2. Update RELEASE_NOTES.md and CHANGELOG.md

**RELEASE_NOTES.md** — prepend a new section **above** the existing content:

```markdown
## What's New in vX.Y.Z

### Feature/Fix Title
- Description

---

## What's New in vPREVIOUS
(existing content below)
```

**CHANGELOG.md** — prepend the same new section **below** the `# Changelog` heading and **above** the previous version:

```markdown
# Changelog

## What's New in vX.Y.Z

### Feature/Fix Title
- Description

---

## What's New in vPREVIOUS
(existing content below)
```

Format rules (apply to both files):
- `## What's New in vX.Y.Z` as the top-level heading
- `### Subsection` for each feature or fix group
- Bullet points for details
- `---` horizontal rule separating from the previous version

### 3. Build validation

Run both and confirm they succeed with no errors:

```bash
cargo check --manifest-path src-tauri/Cargo.toml
npm run build
```

### 4. Commit

Stage everything and commit with this message format:

```
vX.Y.Z: Short summary of major changes

- Bullet point for each notable change
```

### 5. Tag and push

```bash
git tag vX.Y.Z
git push && git push --tags
```

The `v*` tag triggers the **Build & Release** GitHub Actions workflow (`.github/workflows/release.yml`) which:
1. Builds Linux (`.deb`, `.AppImage`) and Windows (`.exe`) installers
2. Generates `latest.json` updater manifest with signatures
3. Creates a **GitHub Release** with download table + full `RELEASE_NOTES.md` content as the release body

### 6. Verify CI

After pushing, confirm the workflow started:
- Go to `https://github.com/Mooshieblob1/MooshieUI/actions`
- The "Build & Release" workflow should be running for tag `vX.Y.Z`

## How the About section works

No manual edit needed. The About section in Settings auto-populates:
- **Version**: `v{appVersion}` where `appVersion` comes from `package.json` → Vite define → `__APP_VERSION__`
- **Release notes**: Fetched at runtime from the GitHub Releases API via `fetchReleaseNotes()` in `SettingsPage.svelte`

## Common mistakes to avoid

1. **Forgetting one of the 3 version files** — always grep to verify all three match
2. **Not running cargo check** — the Cargo.lock won't update and the build will fail in CI
3. **Pushing without the tag** — CI only triggers on `v*` tags, not plain commits
4. **Tag before commit** — the tag must point at the release commit, not the previous one
