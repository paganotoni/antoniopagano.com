---
date: 2015-10-09
title: "Golang on CircleCI"
author: "@paganotoni"
draft: false
type: post

tags: [software-development, go, CI, deployment, devops]
description: "Quick guide to setting up Continuous Integration for your Go projects with CircleCI. Get a ready-to-use configuration file and essential settings for seamless Go builds and tests on CircleCI."

summary: This post provides a quick guide to setting up Continuous Integration for Go projects on CircleCI. It includes a sample circle.yml configuration for dependencies, testing, and environment setup. Get started with automated builds and tests for your Go applications.

---

As some of you may know, our team has been working with Go for some time and we have always been using CircleCI to run our test suites, we would like to share our circle.yml file, it would help for your Go projects.

{{<copyable-code language="yaml">}}
machine:
  environment:
    GOPATH: /home/ubuntu/.go_workspace
    IMPORT_PATH: "github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"

dependencies:
  pre:
    - go get -d ./...

  override:
    - mkdir -p "$GOPATH/$IMPORT_PATH"
    - rsync -azC --delete ./ "$GOPATH/$IMPORT_PATH"

test:
  override:
    - cd "$GOPATH/$IMPORT_PATH"
    - go vet "$IMPORT_PATH/..."
    - go test "$IMPORT_PATH/..." --race --cover

test:
  override:
    - go vet ./...
    - go test -v ./... --race --cover
{{</copyable-code>}}

Enjoy!
