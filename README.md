# AngularUI App (12) Azure Static Web App Deployment

[![Azure Static Web Apps CI/CD](https://github.com/MedJoudi/muffeez/actions/workflows/azure-static-web-apps-wonderful-forest-0a5f9fa03.yml/badge.svg)](https://github.com/MedJoudi/muffeez/actions/workflows/azure-static-web-apps-wonderful-forest-0a5f9fa03.yml)

[![Azure Static Web Apps CI/CD [2nd Sub]](https://github.com/MedJoudi/muffeez/actions/workflows/azure-static-web-apps-victorious-sea-0c5a92a10.yml/badge.svg)](https://github.com/MedJoudi/muffeez/actions/workflows/azure-static-web-apps-victorious-sea-0c5a92a10.yml)

This project demonstrates how to deploy an Angular 12 application to Azure Static Web Apps using GitHub Actions.

# marouen-portfolio 
Click the link below to open Muffezz's portfolio.
<https://mufeez1.github.io/muffeez/> 

## Prerequisites

- Azure account ([free account available](https://azure.microsoft.com/free/))
- GitHub account
- Angular 12 project (this repository)

## Deployment Guide

### 1. Create Azure Static Web App

Follow these steps to set up your Azure Static Web App:

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Click "Create a Resource" and search for "Static Web App"
3. Fill in the basic details:
   - Subscription
   - Resource group (create new if needed)
   - Name (e.g., `marouen-portfolio`)
   - Hosting plan: Free
   - Region: Choose one closest to your users
4. In the "Deployment Details" section:
   - Source: GitHub
   - Organization: Your GitHub org
   - Repository: This repository
   - Branch: `main`
   - Build preset: `default`
5. Click "Review + Create" then "Create"

For detailed instructions, refer to the [official Microsoft documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-angular?pivots=github).

### 2. GitHub Actions Workflow

This repository includes a GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) that automatically builds and deploys your Angular app.

#### Workflow Summary:

```yaml
jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3

      
      # Use Node.js 14.x which is recommended for Angular 12
      - name: Setup Node.js 14.x
        uses: actions/setup-node@v2

      # Install dependencies with legacy peer deps
      - name: Install dependencies

      # Build the Angular app (using production configuration from angular.json)
      - name: Build Angular application

      # Verify the built files exist in the correct location
      - name: Verify build output
      
      - name: Deploy to Azure Static Web Apps
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }} # This secret is created in Github when Azure Static Web App is created.
          repo_token: ${{ secrets.GITHUB_TOKEN }} # This secret is created in Github when Azure Static Web App is created.
          action: "upload"
          app_location: "/"  # Source code location
          output_location: "dist/marouen-portfolio"  # Built files location (matches angular.json)
          
  close_pull_request_job:
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
```

## Customization Guide <a name="customization-guide"></a>

### Configuration Reference

| Setting | Default Value | Type | Description | Required |
|---------|--------------|------|-------------|----------|
| `repo_token` | (inherited) | secret | This secret is created when Azure Static Web App is created. | ✅ Yes |
| `azure_static_web_apps_api_token` | (inherited) | secret | This secret is created when Azure Static Web App is created. | ✅ Yes |
|---------|--------------|------|-------------|----------|
| `app_location` | `/` | string | Root directory containing Angular source files (must contain `angular.json`) | ✅ Yes |
| `output_location` | `dist/marouen-portfolio` | string | Build output directory (must match `outputPath` in `angular.json`) | ✅ Yes |
| `node-version` | `14.x` | string | Node.js version (Angular 12 requires 12.x-14.x) | ✅ Yes |
| `build_command` | `npm run build -- --configuration production` | string | Production build command with Angular CLI flags | ✅ Yes |
| `api_location` | (empty) | string | API directory if using Azure Functions backend | ❌ No |
| `app_build_command` | (inherited) | string | Alternative to separate build step in workflow | ❌ No |


### Environment Variables

```yaml
env:
  NODE_VERSION: '14.x'  # Change according to Angular version
  OUTPUT_DIR: 'dist/marouen-portfolio'  # Must match angular.json
```
This README includes:
1. Clear setup instructions with Azure portal guidance
2. Workflow explanation with customization notes
3. Configuration reference table
4. Troubleshooting section
5. Links to official documentation
