# Workflow Conclusion Action

[![CI Status](https://github.com/step-security/workflow-conclusion-action/workflows/CI/badge.svg)](https://github.com/step-security/workflow-conclusion-action/actions)
[![codecov](https://codecov.io/gh/step-security/workflow-conclusion-action/branch/main/graph/badge.svg)](https://codecov.io/gh/step-security/workflow-conclusion-action)
[![CodeFactor](https://www.codefactor.io/repository/github/step-security/workflow-conclusion-action/badge)](https://www.codefactor.io/repository/github/step-security/workflow-conclusion-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/step-security/workflow-conclusion-action/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

これはワークフローの結果を取得するための`GitHub Actions`です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [Success](#success)
  - [Failure](#failure)
- [Author](#author)


</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
例：Lint => Test => Publish (タグ付与時のみ) => slack (いずれかのジョブが失敗した場合のみ)
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
    needs: publish # このjobを除いた最後のjobを"needs"に設定
    runs-on: ubuntu-latest
    if: always() # "always"を設定
    steps:
        # workflowの結果を取得するためにこのアクションを実行
        # 環境変数から結果を取得できます (env.WORKFLOW_CONCLUSION)
      - uses: step-security/workflow-conclusion-action@v3

        # workflowの結果を使用してアクションを実行
      - uses: 8398a7/action-slack@v3
        with:
          # status: ${{ env.WORKFLOW_CONCLUSION }} # neutral, success, skipped, cancelled, timed_out, action_required, failure
          status: failure
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: env.WORKFLOW_CONCLUSION == 'failure' # 失敗を通知する場合
```