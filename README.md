# Playwright TypeScript Automation Framework

## Overview

This repository contains a robust Playwright + TypeScript automation framework designed using the Page Object Model (POM) architecture. The framework supports UI automation, API validation, Excel-driven test execution, download validation, reporting, logging, and CI/CD integration.

---

## Key Features

### Playwright + TypeScript

* Modern end-to-end automation framework
* Fast and reliable test execution
* Cross-browser support
* Auto-waits and intelligent synchronization

### Page Object Model (POM)

* Reusable page classes
* Clean separation of test logic and UI interactions
* Easy maintenance and scalability

### API + UI Validation

* Validate backend APIs alongside UI workflows
* Network response interception
* Search API validation
* Product Detail API validation
* End-to-end data consistency checks

### Excel-Driven Testing

* Test data managed through Excel files
* Dynamic execution based on test data
* Easy maintenance for QA teams
* Supports large-scale test scenarios

### Download Validation

* File download verification
* Download utility for reusable validation
* Supports Excel, CSV, and future report validations

### Logging & Reporting

* Custom logger utility
* Screenshot capture on failures
* Playwright HTML reports
* Detailed execution logs

### Authentication Support

* Azure AD login support
* MFA-compatible execution flow
* Storage state support for future optimization

### GitHub Actions CI/CD

* Automated execution through GitHub Actions
* CI-ready framework structure
* Easy integration with DevOps pipelines

---

## Framework Structure

```text
playwright-ts-framework
│
├── .github/
│   └── workflows/
│
├── pages/
│   ├── common/
│   │   ├── SidebarComponent.ts
│   │   └── P360Breadcrumb.ts
│   │
│   └── p360/
│       ├── P360SearchPage.ts
│       ├── P360ResultsPage.ts
│       └── ProductDetailPage.ts
│
├── tests/
│   ├── login/
│   └── p360/
│
├── utils/
│   ├── ExcelReader.ts
│   ├── ExcelWriter.ts
│   ├── DownloadUtil.ts
│   ├── Logger.ts
│   ├── ScreenshotUtil.ts
│   └── ProductSearchValidator.ts
│
├── test-data/
│
├── reports/
│
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Technology Stack

* Playwright
* TypeScript
* Node.js
* Excel (xlsx)
* GitHub Actions
* Azure Authentication

---

## Current Capabilities

* Login Automation
* Product Search Automation
* Description Search Validation
* UPC Search Validation
* Search API Validation
* Product Detail API Validation
* Product Detail Validation
* Export Download Validation
* Screenshot Capture
* Excel Result Updates

---

## Future Enhancements

* Authentication State Management
* Allure Reporting
* Parallel Execution
* Visual Testing
* API Test Suite Expansion
* Cross Environment Execution
* Advanced CI/CD Integration

---

## Execution

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npx playwright test
```

Run specific test:

```bash
npx playwright test tests/p360/productSearch.spec.ts
```

Open report:

```bash
npx playwright show-report
```

---

## Author

**Suryansh Dhiman**

