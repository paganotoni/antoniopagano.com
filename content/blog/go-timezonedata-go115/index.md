---
date: 2021-12-10
title: "Timezone Data in Go 1.15+"
author: "@Wawandco"
draft: false
type: post

tags: [go, golang, timezone, stdlib]
description: "Updated guide for handling timezone data in Go 1.15 and newer versions. Learn about recent changes in Go's time package and how to properly implement timezone support in modern Go applications."

summary: This updated guide explains handling timezone data in Go 1.15 and newer versions using the time/tzdata package. It covers importing the package or using build tags to embed timezone data. Learn to simplify timezone support in Go applications without Dockerfile modifications.

---
[On a previous post](/blog/posts/go-time-default-locations-d636bda6/) I wrote about Go's time locations and how to put those in an alpine Docker container. This was achieved by copying the timezone data zip file from the docker builder image into the distributable image. Then using an environment variable to point Go to the location of that file.

<!--more-->

That led us to use the following instructions in our Dockerfile:

{{<copyable-code language="sh">}}
...
# Copying the binary in the destination container
COPY --from=builder /bin/app .
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /zoneinfo.zip
ENV ZONEINFO=/zoneinfo.zip // Notice it matches where I copied it.
...
{{</copyable-code>}}

Which works, meaning that with those instructions we got our timezone locations when our container was running in production. However, as time passes languages improve support for common things, and timezones are not the exception. In this case the Go team added a better way of importing timezones into your package in Go 1.15. which is the reason of this post, so Let me explain how it works.

### Introducing time/tzdata

In go `1.15` the Go team introduced a couple of ways to add timezone data into your Go binary. Both using the `time/tzdata` package, which contains the [timzone](https://www.iana.org/time-zones) database information. Citing the Godoc for the package we can read:

```txt
Package tzdata provides an embedded copy of the timezone database. If this package is imported anywhere in the program, then if the time package cannot find tzdata files on the system, it will use this embedded information.

Importing this package will increase the size of a program by about 450 KB.

This package should normally be imported by a program's main package, not by a library. Libraries normally shouldn't decide whether to include the timezone database in a program.

This package will be automatically imported if you build with -tags timetzdata.
```

Which, at least to me, means that there are 2 ways of adding the timezone data into your app.

#### Importing "time/tzdata" in your code:

With this method the application would do an underscore import of the `time/tzdata` package, by doing this the binary will include the timezone data.

{{<copyable-code language="go">}}
package main

import(
    _ "time/tzdata"
)
{{</copyable-code>}}

#### Adding the `timetzdata` tag to your build instruction:

Alternatively you can add the `timetzdata` tag to your build instruction. This will include the timezone data in your app as well.

{{<copyable-code language="sh">}}
go build -tags timetzdata ./cmd/app
# Or in Buffalo/ox
ox build -tags timetzdata
{{</copyable-code>}}

### Which one to use?

With these 2 methods to add the timezone data into our app we can now avoid using Dockerfile instructions to copy the timezone data into the resulting container (I love less code). Besides that, the binary will not need to load the zip file into memory, because timezones are set there since compilation time.

I do like using the first method more than the second one, mostly because it makes the binary explicitly import the timezone data instead of depending on build tags that one could miss. However, I can see the case where a binary needs to be compiled with and without the timezone data depending on the final use case, in that case, the build tag may come very handy to provide that needed flexibility.

### Wrapping up

The _not-so-new_ `time/tzdata` package simplifies the way we add timezones to our Go programs. Allowing us to reduce the code in our Dockerfiles and making the process a lot more easier to maintain. Feel free to try it and Let me know what you think.
