# Workflow Conclusion Action

[![CI Status](https://github.com/step-security/workflow-conclusion-action/workflows/CI/badge.svg)](https://github.com/step-security/workflow-conclusion-action/actions)
[![codecov](https://codecov.io/gh/step-security/workflow-conclusion-action/branch/main/graph/badge.svg)](https://codecov.io/gh/step-security/workflow-conclusion-action)
[![CodeFactor](https://www.codefactor.io/repository/github/step-security/workflow-conclusion-action/badge)](https://www.codefactor.io/repository/github/step-security/workflow-conclusion-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/step-security/workflow-conclusion-action/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

GitHub action to get workflow conclusion.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
  - [Success](#success)
  - [Failure](#failure)
- [Author](#author)


</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
e.g. Lint => Test => Publish (only tagged) => slack (only if any job fails)
```yaml
on: push

name: CI

jobs:
  lint:
    name: ESLint
    runs-on: ubuntu-latest
    ...

  test:
    name: Coverage
    needs: lint
    strategy:
      matrix:
        node: ['11', '12']
    ...

  publish:
    name: Publish Package
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    ...

  slack:
    name: Slack
    needs: publish # set "needs" only last job except this job
    runs-on: ubuntu-latest
    if: always() # set "always"
    steps:
        # run this action to get the workflow conclusion
        # You can get the conclusion via env (env.WORKFLOW_CONCLUSION)
      - uses: step-security/workflow-conclusion-action@v3

        # run other action with the workflow conclusion
      - uses: 8398a7/action-slack@v3
        with:
          # status: ${{ env.WORKFLOW_CONCLUSION }} # neutral, success, skipped, cancelled, timed_out, action_required, failure
          status: failure
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: env.WORKFLOW_CONCLUSION == 'failure' # notify only if failure
```