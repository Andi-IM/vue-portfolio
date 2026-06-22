# Project Cleanup Commands

## Clean Command

The `clean` command removes all build artifacts, test outputs, and temporary files from the project.

### Usage

```bash
bun run clean
```

### What Gets Cleaned

The clean command removes the following directories and files:

| Path                       | Description                              |
| -------------------------- | ---------------------------------------- |
| `dist/`                    | Production build output from Vite        |
| `coverage/`                | Unit test coverage reports from Vitest   |
| `.nyc_output/`             | E2E test coverage data from Istanbul/NYC |
| `test-results/`            | Playwright test results and screenshots  |
| `playwright-report/`       | Playwright HTML test reports             |
| `.eslintcache`             | ESLint cache file                        |
| `tsconfig.app.tsbuildinfo` | TypeScript incremental build cache       |

### When to Use

Run the clean command when you want to:

- ✅ **Start fresh** - Remove all generated files before a new build
- ✅ **Free up disk space** - Clean up large test artifacts
- ✅ **Troubleshoot build issues** - Clear caches that might be causing problems
- ✅ **Before deployment** - Ensure a clean build
- ✅ **After switching branches** - Clear stale artifacts

### Common Workflows

#### Clean and Build

```bash
bun run clean && bun run build
```

#### Clean and Test

```bash
bun run clean && bun test && bun run test:e2e
```

#### Clean, Build, and Preview

```bash
bun run clean && bun run build && bun run preview
```

#### Full Clean and Coverage

```bash
bun run clean && bun run test:coverage && bun run test:e2e:coverage
```

### What Stays

The clean command does **NOT** remove:

- ✅ `node_modules/` - Dependencies (use `bun install` to reinstall)
- ✅ `src/` - Source code
- ✅ `public/` - Static assets
- ✅ `.git/` - Git repository
- ✅ Configuration files (`.eslintrc`, `vite.config.ts`, etc.)

### Manual Deep Clean

If you need to completely reset the project:

```bash
# Remove all artifacts
bun run clean

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove package-lock.json (if present) and bun.lockb
Remove-Item package-lock.json, bun.lockb -ErrorAction Ignore

# Reinstall dependencies
bun install
```

Or use this one-liner:

```bash
bun run clean; Remove-Item -Recurse -Force node_modules, package-lock.json, bun.lockb -ErrorAction Ignore; bun install
```

### Disk Space Savings

Typical sizes of cleaned directories:

| Directory            | Typical Size                |
| -------------------- | --------------------------- |
| `dist/`              | 1-5 MB                      |
| `coverage/`          | 5-20 MB                     |
| `.nyc_output/`       | 1-5 MB                      |
| `test-results/`      | 10-50 MB (with screenshots) |
| `playwright-report/` | 5-15 MB                     |
| **Total**            | **~20-95 MB**               |

### CI/CD Integration

In CI/CD pipelines, you typically want to clean before building:

```yaml
# GitHub Actions example
- name: Clean project
  run: bun run clean

- name: Build
  run: bun run build
```

### Troubleshooting

**Q: Clean command fails with permission errors**

```bash
# Close any running dev servers or test processes
# Then run clean again
bun run clean
```

**Q: Want to clean only specific directories**

```bash
# Clean only build output
bunx rimraf dist

# Clean only test results
bunx rimraf test-results playwright-report

# Clean only coverage
bunx rimraf coverage .nyc_output
```

**Q: Want to keep screenshots but clean other test results**

```bash
# Manually clean specific directories
bunx rimraf dist coverage .nyc_output playwright-report .eslintcache
```

## Additional Cleanup Commands

You can add more specialized clean commands to `package.json`:

```json
{
  "scripts": {
    "clean": "rimraf dist coverage .nyc_output test-results playwright-report .eslintcache tsconfig.app.tsbuildinfo",
    "clean:build": "rimraf dist",
    "clean:test": "rimraf coverage .nyc_output test-results playwright-report",
    "clean:cache": "rimraf .eslintcache tsconfig.app.tsbuildinfo node_modules/.vite"
  }
}
```
