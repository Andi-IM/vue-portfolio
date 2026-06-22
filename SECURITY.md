# Security Policy

## Supported Versions

Only the latest production release of this portfolio is actively maintained and receives security fixes.

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| Older   | ❌        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do not open a public GitHub issue**.

Instead, report it privately using one of the following methods:

- **GitHub Private Advisory**: [Report a vulnerability](https://github.com/Andi-IM/vue-portfolio/security/advisories/new)
- **Email**: [email@airham.my.id](mailto:email@airham.my.id)

Please include as much detail as possible:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact or risk assessment
- Any suggested remediation (optional)

## Response Timeline

| Stage              | Target Time     |
| ------------------ | --------------- |
| Acknowledgement    | Within 48 hours |
| Initial assessment | Within 5 days   |
| Fix or mitigation  | Within 14 days  |

## Scope

This is a **personal portfolio website** deployed on Cloudflare Pages. The following areas are in scope:

- XSS vulnerabilities (note: [DOMPurify](https://github.com/cure53/DOMPurify) is used for sanitization)
- Exposed secrets or credentials in the codebase
- Cloudflare Workers / Pages Functions security issues
- Dependency vulnerabilities with a direct exploit path

The following are **out of scope**:

- Denial-of-service attacks
- Social engineering
- Issues in third-party services (Cloudflare, Google, Credly, etc.)
- Vulnerabilities requiring physical access to the host machine

## Dependency Security

Dependencies are monitored automatically via [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot). Critical updates are applied as soon as possible.

To audit dependencies manually:

```sh
bun audit
```

## Acknowledgements

Responsible disclosure is appreciated. Contributors who report valid vulnerabilities will be credited in the release notes (with their consent).
