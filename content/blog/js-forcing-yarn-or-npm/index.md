---
title: "TIP: Ensuring your team uses YARN/NPM"
date: 2020-01-16T09:19:57-05:00
draft: false
type: "post"
author: "@paganotoni"

tags: ["frontend", "software-development", "devops", "tools"]
description: "Quick tip: Learn how to maintain package manager consistency in your team by enforcing YARN or NPM usage. Simple steps to prevent dependency conflicts and ensure smooth development workflow."

summary: This tip explains how to enforce consistent package manager usage in JavaScript projects. By configuring .npmrc and package.json engines, teams can prevent mixing YARN and NPM. This avoids dependency conflicts and ensures smooth development workflows.

---
One common Javascript flaw I see in repositories I get in touch with is the usage of both yarn.lock and npm-lock.json. This is not on purpose, in most cases is due to the lack of communication on the tooling the repo uses or different points of view on the best tooling for the problem at hand.

In this short post, I'm not going to focus on communication strategies for the codebase, nor in which one is better between YARN and NPM. Rather I want to share a small tip on how to prevent the usage of NPM when your team decided on YARN and vice-versa.

### How to?

#### Edit .npmrc

We may not have this file in our codebase, it allows us to specify package manager configurations and both NPM and YARN read from it. Our `.npmrc` file should have the `engine-strict` property marked as true.

{{<copyable-code language="js">}}
//.npmrc
engine-strict = true
{{</copyable-code>}}

This option will tell our package manager to respect the versions of the engines we have specified. But, where do we specify those versions?

#### Edit package.json

This is the file where our JS module packages are defined, it allows to define other things like scripts and engines. We will use the engines part in this post. Inside our package.json we should add the engines section if we don't have it.

{{<copyable-code language="js">}}
//package.json
{
  ...
  "engines": {
    "npm": "please-use-yarn",
    "yarn": ">= 1.19.1",
  }
  ...
}
{{</copyable-code>}}

As you see we're saying here that this package.json uses a version of yarn. And we specify that npm will use the please-use-yarn version (which doesn't exist).

### Trying NPM install

So when we run npm install we will get:

{{<copyable-code language="sh">}}
npm ERR! code ENOTSUP
npm ERR! notsup Unsupported engine for jsapp@1.0.0: wanted: {"npm":"please-use-yarn","yarn":">= 1.19.1"} (current: {"node":"13.2.0","npm":"6.13.3"})
npm ERR! notsup Not compatible with your version of node/npm: jsapp@1.0.0
npm ERR! notsup Not compatible with your version of node/npm: jsapp@1.0.0
npm ERR! notsup Required: {"npm":"please-use-yarn","yarn":">= 1.19.1","node":">= v10.17.0"}
npm ERR! notsup Actual:   {"npm":"6.13.3","node":"13.2.0"}

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/youruser/.npm/_logs/2020-01-16T14_36_42_431Z-debug.log
{{</copyable-code>}}

And as you can see the tooling returns an error that prevents us from using npm. This could be used the other way around to prevent the usage of Yarn when our project has decided to use NPM.

### Wrapping up

Ensuring that your team uses the same tooling may reduce the ambiguity of the issues you find in your codebase, it is always good to write a good README that on-boards members to the tools/techniques used by the team. I hope you find this tip useful to force the team to use the Javascript package manager of your choice. Thanks for reading and stay tuned for more!
