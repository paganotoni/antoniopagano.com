---
date: 2022-04-16
title: "Using Plush with Go"
draft: false
type: post
author: "@paganotoni"
tags: ["go", "architecture", "tools", "web-development", "backend"]
description: "Learn how to enhance your Go templating with Plush, a powerful template engine. Discover how to simplify template creation and management in Go applications using Plush's intuitive syntax and features."

summary: This post demonstrates using Plush templating engine with plain Go applications for server-side HTML rendering. It shows how to integrate Plush with standard Go handlers and embed templates. Learn to enhance Go web apps with Plush's ERB-like syntax for dynamic content.

---

One of the coolest libraries in the Buffalo framework is [Plush](https://github.com/gobuffalo/plush), a templating engine that provides ERB-like syntax for writing server side HTML. It is a very powerful templating engine that can be used to render HTML pages for Go applications. Plush makes it easy to iterate over collections, have conditional content, use partials and more.

Even though Plush is built within the Buffalo ecosystem and I’ve been able to mostly use it in my buffalo apps, I’ve always wondered how it can be integrated with Go applications written with the standard library. In this post I'll show you how to use Plush to simplify your templating needs in your plain Go applications.

### Our application

To show how to do this I will pick a simple web landing page. Even though that might not make much sense (Why not just go HTML?) It will allow us to show how to use Plush with Go, which is ultimately what I want to do.


#### Folder structure

This is the folder structure of our application, it separates the web layer from the executable/binary Go code that lives in the cmd folder.

```
├── cmd
│   ├── app
│   │   ├── main.go             // main application binary.
├── web
│   ├── server
│   │   ├── server.go           // web server and routes
│   ├── landing
│   │   ├── landing.go          // our landing handler lives here
│   │   ├── landing_test.go     // tests for the landing handler
│   │   └── landing.plush.html  // plush template for the landing
│   ├── web.go                  // our common web things live on this folder
│   └── layout.plush.html       // shared layout for our views (to avoid repeating)
├── go.mod
├── go.sum
```

#### Application binary part
`cmd/main.go` is the binary entrypoint for our application, is the one we’ll use to run our app. By purpose we try to keep it as simple as possible. It contains the following code:

{{<copyable-code language="go">}}
package main
import (
    "github.com/paganotoni/plgo/web/server"
)

func main() {
    err := server.Start()   //Start our web server.
    if err != nil {
        panic(err)
    }
}
{{</copyable-code>}}

#### Web server
`cmd/server/server.go` is the web server, it contains the following code:

{{<copyable-code language="go">}}
package server

import (
	"fmt"
	"net/http"

	"github.com/paganotoni/plgo/web/landing"
)

func Start() error {
	http.HandleFunc("/", landing.HandlerFn)
	fmt.Println(">>> Application running on http://localhost:8080 <<<")

	return http.ListenAndServe(":8080", nil)
}
{{</copyable-code>}}

### Handlers and plush

Let’s get into plush by looking at the following files

- `web/web.go`: It contains the Render function.
- `web/landing/landing.go`: The landing handler.

#### `web/web.go`

{{<copyable-code language="go">}}
package web

import (
	"context"
	_ "embed"
	"html/template"

	"github.com/gobuffalo/plush/v4"
)

//go:embed layout.plush.html
var layout string

func Render(ctx context.Context, content string, data map[string]interface{}) (string, error) {
	pctx := plush.NewContextWithContext(ctx)
	for k, v := range data {
		pctx.Set(k, v)
	}

	content, err := plush.Render(content, pctx)
	if err != nil {
		return "", err
	}

	pctx.Set("yield", template.HTML(content))

	return plush.Render(layout, pctx)
}
{{</copyable-code>}}

This function takes care of the rendering of our templates with the help of plush. It uses the `layout.plush.html` template as a shared layout for all our views and then renders the passed content to append it to the context  on the `yield` value.

Most of the magic happens here:

1. I create a new plush context with the context passed as a parameter.
2. I set the data passed as a parameter in the context.
3. I render the content passed as a parameter in the context.
4. I render the layout template with the context and the content as the `yield` value.
5. I return the result of the rendering as a string.

The rest depends on the specific view that's being rendered within the app.

#### `web/landing/landing.go`

The landing handler uses the `Render` function to display the landing page. This is one simple example for other web handlers needed. The code within this file is:


{{<copyable-code language="go">}}
package landing

import (
    _ "embed"

    "github.com/paganotoni/plgo/web"
)

//go:embed landing.plush.html
var landing string

func HandlerFn(w http.ResponseWriter, r *http.Request) {
    dat, err := web.Render(r.Context(), landingHTML, map[string]interface{}{
		"title": "Plush is very cool",
		"features": []string{
			"It has a nice syntax",
			"Allows for dynamic content",
			"Its cool",
		},
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.Write([]byte(dat))
}
{{</copyable-code>}}

And then our `landing.plush.html` template uses Plush syntax to render the content by receiving the variables from the context. Below you can see how it looks like.

{{<copyable-code language="html">}}
<h2><%= title %></h2> <!-- Here we use the title context value. -->
<p>This is a sample of using plush in Go</p>
<ul>
    <%= for (k) in features { %> <!-- This is an iteration of the features context value. -->
        <li><%= k %></li>
    <% } %>
</ul>
{{</copyable-code>}}

Which will be rendered as:

{{<copyable-code language="html">}}
<h2>Plush is very cool</h2>
<p>This is a sample of using plush in Go</p>
<ul>
    <li>It has a nice syntax</li>
    <li>Allows for dynamic content</li>
    <li>Its cool</li>
</ul>
{{</copyable-code>}}

### Wrapping up

As this post shows its possible to use Plush outside of the Buffalo framework with Go handlers. Your web application can benefit from the power of Plush and still use your own router/middleware stack. Plush makes server side templating easier and hopefully will make things easier for your development needs.

#### Further reading

Here are some resources I think could be interesting after this post and I hope you will find them useful:

- [Plush](https://github.com/gobuffalo/plush)
- [Source for this post](https://github.com/paganotoni/plgo)
- Bonus: [Buffalo Docs](https://gobuffalo.io/documentation/)
