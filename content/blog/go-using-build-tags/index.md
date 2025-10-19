---
date: 2020-11-26
title: "Using Go's build tags"
draft: false
type: post

author: "@paganotoni"
tags: ["software-development", "go"]
description: "Master Go's build tags to optimize your Go applications. Learn how to use build constraints effectively for platform-specific code, testing, and development configurations."

summary: This post explains how to use Go's build tags for conditional compilation in applications. It covers syntax, Boolean logic for tags, and practical examples for plugins and OS-specific code. Learn to optimize Go builds for different environments and features.

---
In [Go](https://golang.org/), a `build tag` is an indicator that is added to a piece of our code, to indicate when a package will be included in the building process.  This gives us the possibility to compile different versions or parts of our application from Go, switch between them in a fast and organized way, and all from the same source code.By using the build tags we can work on integration tests in development teams, which allows us to test the updates of our code without the need to make modifications to the already tested sections of it.

`Build tags` can appear in any type of source file (not just Go), but should appear near the top of the file, preceded only by blank lines and other line comments. This means that in Go files a compilation tag must appear before the package clause and to be differentiated from the package documentation it must be followed by a blank line.

The build tags have the following syntax:

```
// +build [tag]
```

When we use more than one tag within a package, they interact using Boolean logic, depending on how we make the statement.

`Build tags` follow these three rules:

1. The tags separated by space will be interpreted under the OR logic.
2. Comma separated tags will be interpreted under the AND logic.
3. Each term is an alphanumeric word and if preceded by `!` it means it is negated.

### As an Example

Given the tag:

```
// +build tag1 tag2
```

The interpretation would be that this package will be included if  tag1 `OR`  tag2 are present when the build command is executed.

On the other hand, if we use the tag:

```
// +build tag1, tag2
```

The interpretation would be that tag1 `AND` tag2 must be present in the build command for our package to be included in the compilation.

### Hands On

We can see simple example to understand what we can do with the `build tags`.

Let's consider a scenario where we are working in a development team on an application where there is already a large percentage of development that works perfectly but there are still requirements to be completed.

We will start by creating our main.go file where we will represent the core of the application that has already passed all kinds of tests.

{{<copyable-code language="go">}}
package main

import "fmt"

var features = []string{
    "This is a working prototype of the app",
}

func main() {
    for _, f := range features {
        fmt.Println(">", f)
    }
}
{{</copyable-code>}}

If we build and run this application in the folder where we save our file, we will get the following result:

Running:

{{<copyable-code language="">}}
$ go build
$ ./tags
{{</copyable-code>}}
We will get:

```
> This is a working prototype of the app
```

Let's suppose that the requirements that are in development were made by different people each of them, and we want to test them inside the application without having to modify the code that already exists. By using the `build tags` we can do this in a very easy way.

The requirements we need to add are a two plugins ( fixer.go and test.go ). We'll start by adding the first one. To do this we must create a new file called fixer.go:

{{<copyable-code language="go">}}
package main

func init() {
    features = append(features,
        "This is a fixer plugin of the app",
    )
}
{{</copyable-code>}}

And then create our test.go file:

{{<copyable-code language="go">}}
package main

func init() {
    features = append(features,
        "This is a test plugin of the app",
    )
}
{{</copyable-code>}}

If we rebuild our application, the result will be as follows:

Running:
{{<copyable-code language="">}}
$ go build
$ ./tags
{{</copyable-code>}}
We'll get the next output:

```
> This is a working prototype of the app
> This is a fixer plugin of the app
> This is a test plugin of the app
```

If we wanted to test the plugins separately, this would not be a convenient output. For this we must indicate in each file, the conditions under which each plugin will be included during the compilation process.

We add the fixer tag in the fixer.go file:

{{<copyable-code language="go">}}
// +build fixer

package main

func init() {
    features = append(features,
        "This is a fixer plugin of the app",
    )
}
{{</copyable-code>}}

And then we add the test tag as well as the fix tag in the test.go file:

{{<copyable-code language="go">}}
// +build fixer, test

package main

func init() {
    features = append(features,
        "This is a test plugin of the app",
    )
}
{{</copyable-code>}}

The reason for adding these two tags in the second file is with the intention of putting as a condition that the two tags are required to be able to include this plugin within the compilation of our application.  We will see both cases below:

If we run:

{{<copyable-code language="">}}
$ go build -tags fixer
$ ./tags
{{</copyable-code>}}

We'll get the next output:

```
> This is a working prototype of the app
> This is a fixer plugin of the app
```

We can see that only the plugin with the fixer tag was included in the compilation. If we want to add the second plugin to our app we must meet the conditions indicated in the tag we added in our file:

If we run:

{{<copyable-code language="">}}
$ go build -tags “fixer test”
$ ./tags
{{</copyable-code>}}

We'll get the next output:

```
> This is a working prototype of the app
> This is a fixer pluging of the app
> This is a test pluging of the app
```

This way we can vary the way we include our packages within our application. We could also use the `build tags` for cases where it is necessary to make changes to the application depending on the operating system it is running on, or simply to control software where different types of license levels are offered to customers (Basic, Pro, Enterprise, for example).

### Further reading

If you want to read more about this topic you can go to Go's documentation in the [build constrains](https://golang.org/cmd/go/#hdr-Build_constraints) section.
