![Candor compliance workspace](./screenshot.png)

# Candor

A governance, risk, and compliance workspace for keeping controls, audit plans, and remediation work visible in one place.

**Live app:** [https://a2rp.github.io/governance-risk-compliance/](https://a2rp.github.io/governance-risk-compliance/)  
**Source code:** [github.com/a2rp/governance-risk-compliance](https://github.com/a2rp/governance-risk-compliance)

## Pages

- **Compliance room** - Monitor control health, evidence gaps, open audits, and priority findings. The impact and likelihood matrix filters the findings queue; priority findings open their detail dialogs.
- **Control library** - Search, filter, sort, review, create, and edit safeguards. Export the current register view as CSV. Deleting a control asks for confirmation and clears its linked sample references from audits and findings.
- **Audit plans** - Schedule reviews, assign a lead, select controls, and review evidence using checkboxes. Progress is calculated from the selected control sample. An audit cannot be completed until every selected sample is reviewed.
- **Findings and actions** - Track impact, likelihood, domain, owner, target date, workflow status, and linked control. Create, edit, inspect, filter, sort, update, delete, and export findings.
- **Not Found** - A branded recovery page with a link back to the compliance room.

## How the demo works

Candor uses realistic sample records and in-memory React state. Changes appear across pages while the app is open. Refreshing the page restores the original sample data. The app does not use browser storage, connect to a backend, upload evidence, or synchronize with external services. Evidence counts and audit review checkboxes are sample data only.

Forms validate required fields and show inline messages. Important decisions use accessible custom dialogs with keyboard dismissal and safe cancel actions. Brief updates use dismissible toast notifications. CSV exports contain the records matching the current filters.

## Screenshots

These captures show each route and every distinct user-facing dialog in the app.

### Pages

#### Compliance room

![Candor compliance room with risk matrix and priority findings](./screenshots/pages/overview.png)

Risk exposure, control health, current audit work, and findings that need attention.

#### Control library

![Candor control library and searchable control register](./screenshots/pages/control-library.png)

Search and review safeguards, owners, frameworks, assurance status, and review dates.

#### Audit plans

![Candor audit plan calendar](./screenshots/pages/audit-plans.png)

Scheduled, in-progress, and completed assurance plans with evidence progress.

#### Findings and actions

![Candor findings and remediation queue](./screenshots/pages/findings.png)

Owners, risk ratings, target dates, workflow status, and remediation notes.

#### Not Found

![Candor not found page with a return to overview button](./screenshots/pages/not-found.png)

### Dialogs

#### Demo guide

![Candor demo guide dialog](./screenshots/modals/demo-guide.png)

#### Control workflows

![Create control dialog](./screenshots/modals/control-create.png)

Create a control.

![Edit control dialog](./screenshots/modals/control-edit.png)

Edit a control.

![Control detail dialog](./screenshots/modals/control-details.png)

Review the selected control's owner, risk, evidence count, and review date.

![Confirm control deletion dialog](./screenshots/modals/control-delete-confirmation.png)

#### Audit workflows

![Create audit plan dialog](./screenshots/modals/audit-create.png)

Create a review window and choose its control sample.

![Edit audit plan dialog](./screenshots/modals/audit-edit.png)

Edit an audit plan.

![Audit evidence review dialog](./screenshots/modals/audit-evidence-review.png)

Review sample evidence and see completion progress.

![Confirm audit plan deletion dialog](./screenshots/modals/audit-delete-confirmation.png)

#### Finding workflows

![Create finding dialog](./screenshots/modals/finding-create.png)

Create a remediation item.

![Edit finding dialog](./screenshots/modals/finding-edit.png)

Edit an existing finding.

![Finding detail dialog](./screenshots/modals/finding-details.png)

Inspect the owner, target date, likelihood, and linked control.

![Confirm finding deletion dialog](./screenshots/modals/finding-delete-confirmation.png)

## Local setup

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

## Lint and build

```bash
npm run lint
npm run build
```

## Deploy

```bash
npm run deploy
```

The deploy command builds the app, copies the SPA entry file to `dist/404.html`, and publishes `dist` to the `gh-pages` branch.

**Deployed URL:** [https://a2rp.github.io/governance-risk-compliance/](https://a2rp.github.io/governance-risk-compliance/)

## Image credits

The compliance room uses a locally saved photo by [Olena Kholina on Unsplash](https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw), under the [Unsplash License](https://unsplash.com/license).

## Future improvements

These are backend or service extensions and are not implemented in this frontend demo:

- Shared server storage, workspace accounts, and permission levels.
- Secure evidence uploads, retention policies, and an auditable evidence history.
- Framework integrations and automated control evidence collection.
- Calendar synchronization and notifications for audit deadlines.
- Server-side audit trails and reporting across completed review cycles.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
