---
title: "Go's Locations & Alpine Docker image"
date: 2020-03-29T13:30:25-05:00

author: "@paganotoni"
draft: false
type: post

tags: ["go", "tools", "deployment", "devops", "backend"]
description: "Learn how to properly configure timezone support in Go applications running on Alpine Docker images. Guide to including localization files for accurate time handling using Go's time package in containerized apps."

summary: This post explains how to configure timezone support in Go applications running on Alpine Docker images. It covers copying the zoneinfo.zip file and setting the ZONEINFO environment variable. Learn to ensure accurate time handling in containerized Go apps.

---

My team has faced an issue with timezones repeated times: Apparently, default `Locations` were not present in our production deployments of our apps, that took us by surprise given locally these were present and working nicely 🤔.

This is an issue I've faced before. Every time I wanted to show dates in a certain timezone but such timezone was not present in our production environment, Our app ended up in GMT for everything, or we had to create our own locations.
<!-- more -->

> [Important] There is a newer post detailing new strategy for this in Go 1.15+, if you're using a Go version newer than 1.15 I strongly suggest to [take a look at it](/blog/posts/timezonedata-go115-7c2a25e7-dbdd-4b6b-8092-51cc2d0241ce/)

### Our Docker images

So I decided to take a look at why this was happening. Our typical application deployment stack uses very tiny [Alpine](https://hub.docker.com/_/alpine) images with just the binary of our applications. Buffalo's [Packr](https://github.com/gobuffalo/packr) takes care of embedding our assets into the final binary.

Besides that, our applications typically follow the `12 factor app` methodology and use a set of environment variables for environment-specific ends, from dependencies like the database to application-specific things like sending email addresses.

### Go Timezones

For those that are not familiar with Go's timezones, Go uses the concept of Location for timezone adjustments. Taking Go's standard library `time` package definition's word:

> A Location maps time instants to the zone in use at that time. Typically, the Location represents the collection of time offsets in use in a geographical area. For many Locations the time offset varies depending on whether daylight savings time is in use at the time instant.

And as an example of its usage:

{{<copyable-code language="go">}}
t := time.Now() //Current Time for the example

location, err := time.LoadLocation("EST") // ***
if err == nil {
   return t
}

return t.In(location) //Here is where the magic happens
{{</copyable-code>}}

The issue I've been talking about was happening around the `LoadLocation` function call:

{{<copyable-code language="go">}}
loc, err := time.LoadLocation("EST")
{{</copyable-code>}}

Where we were getting an error for the EST timezone in `production`. But how come?!.

#### Findings

My initial discovery pointed me to learn that default timezones/locations are stored in the system and loaded by Go. Your Go installation comes with a zip file named: `zoneinfo.zip`. On the official Go docker image, it is stored at `/usr/local/go/lib/time/zoneinfo.zip`.

This file contains default timezones information. While looking at my resulting Docker image I noticed that it's a multistage docker build file:

{{<copyable-code language="dockerfile">}}
FROM gobuffalo/buffalo:v0.15.3 as builder

ENV GOPROXY=https://proxy.golang.org
ENV GO111MODULE=on

...

# Building the binary
RUN buffalo build --static -o /bin/app

FROM alpine # HERE WE USE Alpine!
# ...
WORKDIR /bin/

# Copying the binary in the destination container
COPY --from=builder /bin/app .
ENV ADDR=0.0.0.0

EXPOSE 3000

CMD /bin/app
{{</copyable-code>}}

We were only copying the binary (`/bin/app`) into the Alpine resulting container. So our resulting docker image did not contain the locations file.

I decided to copy the file to my resulting container with:

{{<copyable-code language="dockerfile">}}
FROM gobuffalo/buffalo:v0.15.3 as builder

ENV GOPROXY=https://proxy.golang.org
ENV GO111MODULE=on

# ...  Rest of the things you've already seen

# Copying the binary in the destination container
COPY --from=builder /bin/app .
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /zoneinfo.zip
ENV ADDR=0.0.0.0

EXPOSE 3000

CMD /bin/app
{{</copyable-code>}}

And while the copy works (meaning the file exists in both sides) I was still not finding the desired timezones when we requested to use these.

That's when I learned that there is an environment variable to tell Go where to look for that file: `ZONEINFO`.

I added that to our Dockerfile with:

{{<copyable-code language="dockerfile">}}
FROM gobuffalo/buffalo:v0.15.3 as builder

ENV GOPROXY=https://proxy.golang.org
ENV GO111MODULE=on

... # Rest of the things you`ve already seen

# Copying the binary in the destination container
COPY --from=builder /bin/app .
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /zoneinfo.zip

ENV ADDR=0.0.0.0
ENV ZONEINFO=/zoneinfo.zip // Notice it matches where I copied it.

EXPOSE 3000

CMD /bin/app
{{</copyable-code>}}

And Tadaaa 🎉🎉. It worked. Now I had the default timezones ready to be used in my production app.

### Wrapping up

I hope you enjoyed this small and very wild post. I know that this is an issue that some of our team has faced and thought it might be valuable for you. Please let me know comments and thoughts around this.

Last but not least here are a couple of related links that may be interesting if you want to keep reading about the topic:

- [12 Factor App Metodology](https://12factor.net/)
- [Docker multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
- [Go Location/Timezones](https://golang.org/pkg/time/#Location)
