---
title: "Page layouts in Go"
date: 2022-03-12
draft: false
type: "post"
author: "@paganotoni"

tags:
  - software-development
  - go
  - html
  - templates
  - golang

keywords:
  - golang
  - html
  - templates
  - golang

description: "Master Go template layouts using block and define expressions. Learn how to create efficient, DRY web page templates and eliminate layout repetition in your Go web applications"

summary: This post explains how to use Go's template block and define expressions for creating reusable page layouts. It demonstrates avoiding repetition in HTML templates for a blog application. Learn to separate layout from content for better maintainability.

---
I recently tried to build a web application using Go and HTML templates. In doing so, I started to miss some cool features that Buffalo and plush have to avoid repeating the layout of your web pages. I thought this was a common enough problem that the Go team should have provided the tools in the standard library, and as usual, they did. That's when I came across the [`block`](https://pkg.go.dev/text/template#example-Template-Block) and [`define`](https://pkg.go.dev/text/template#example-Template-Block) expressions for templates. In this post I will explain how to use these to avoid repeating the layout of your web pages.

## The application

To better explain the issue at hand let's take a blog as an example. On a blog we have a layout for the header and footer of each page, and a template for each post. The content of each post is different but the content of the header and footer is the same.

A ten thousand feet view of the application looks like the following file tree:

{{<copyable-code language="">}}
blog
  cmd
    blog
      main.go
  server
    server.go
  templates
    posts
      antonio-likes-go.html
      wawandco-rocks.html
      teams-that-matter.html
{{</copyable-code>}}

Now, the problem comes from having repeated HTML for the header and footer of the page across every blog post template. The following content repeats in all templates:

{{<copyable-code language="html">}}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/stylesheet/path" />
    <title>{{.Year}}</title>
  </head>
  <body>
    <h1>Welcome to the blog!</h1>
    ...[page content]...
    <footer>
      <p>&copy; {{.Title}} by Blog Team</p>
    </footer>
  </body>
</html>
{{</copyable-code>}}

And when we think about the [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle), the reasons why this code would change are different than the reasons why the content of the templates will. It makes sense to try and refactor to avoid repetition and, more importantly, to avoid maintaining the same code in all templates.

#### Adding a layout file

This is where the `block` and `define` expressions come in handy. To use them, we will add a layout file to the templates folder. The layout file will hold the HTML we've mentioned it repeats across the posts.

{{<copyable-code language="html">}}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/stylesheet/path.css" />
    <title>{{.Title}}</title>
  </head>
  <body>
    <h1>Welcome to the blog!</h1>
    <div class="content">
      <!-- Here goes the content of the template -->
      {{ block "content" . }}{{ end }}
    </div>
    <footer>
      <p>&copy; {{.Year}} by Blog Team</p>
    </footer>
  </body>
</html>
{{</copyable-code>}}

With the slight difference that we've added the block expression to specify the block where the content of the posts will take place. Besides that we need to modify our posts, since we have extracted the layout we can remove the repeated content from the posts.

As an example let's take `templates/posts/wawandco-rocks.html`:

{{<copyable-code language="html">}}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/stylesheet/path.css" />
    <title>{{.Title}}</title>
  </head>
  <body>
    <h1>Welcome to the blog!</h1>
    <div class="content">
      <h2>Wawandco Team Rocks</h2>
      <p>
        The Wawandco team is amazing. I don't have to tell you this, these guys
        know very well Go and put the best effort to build the best software
        solutions for Wawandco clients.
      </p>
    </div>
    <footer>
      <p>&copy; {{.Year }} by Blog Team</p>
    </footer>
  </body>
</html>
{{</copyable-code>}}

Which will be simplified to the following:

{{<copyable-code language="html">}}
<h2>Wawandco Team Rocks</h2>
<p>
  The Wawandco team is amazing. I don't have to tell you this, these guys know
  very well Go and put the best effort to build the best software solutions for
  Wawandco clients.
</p>
{{</copyable-code>}}

We can start seeing the difference in content for each of the posts that gets simplified. While modifying the content of the posts and adding the layout is important now we need to modify the way we render these posts.

#### Modifying the post server

As mentioned, we need to modify the way we render those posts to inject the post content into the layout. To do that we will modify the `server/server.go` file, which contains the following code:

{{<copyable-code language="go">}}
package server

// Data needed by all the pages.
var commonData = struct {
    Year  string
    Title string
}{
    Year:  time.Now().Format("2006"),
    Title: "The Blog",
}

func renderPost(w http.ResponseWriter, r *http.Request) {
    // Read the template requested from the posts directory.
    dd, err = ioutil.ReadFile(filepath.Join("./templates/posts/", r.URL.Path))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Executing the template
    if err := tmpl.Execute(w, commonData); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

// New returns a new instance of the blog server which renders
// the blog posts using the blog templates.
func New() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("/", renderPost)

    return mux
}
{{</copyable-code>}}

We should now read the layout first and then read the content of the post to inject it into the layout. The resulting `server.go` file is as follows:

{{<copyable-code language="go">}}
package server

// Data needed by all the pages.
var commonData = struct {
    Year  string
    Title string
}{
    Year:  time.Now().Format("2006"),
    Title: "The Blog",
}

func renderPost(w http.ResponseWriter, r *http.Request) {
    // Here we read the layout to later on instantiate a
    // template with it.
    dd, err := ioutil.ReadFile("./templates/layout.html")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // We parse the layout content as a template.
    tmpl, err := template.New("layout").Parse(string(dd))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Then we read the content of the post.
    dd, err = ioutil.ReadFile(filepath.Join("./templates/posts/", r.URL.Path))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Here is the magic ✨. We use {{define "content"}} to inject the content of
    // the post into the layout. It will be inserted in the place where
    // the layout has defined the block named "content".
    tt := fmt.Sprintf(`{{define "content"}}%s{{end}}`, dd)
    tmpl, err = template.Must(tmpl.Clone()).Parse(tt)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    data := struct {
        Year  string
        Title string
    }{
        Year:  time.Now().Format("2006"),
        Title: "The Blog",
    }

    if err := tmpl.Execute(w, data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

// New returns a new instance of the blog server which renders
// the blog posts using the blog templates.
func New() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("/", renderPost)

    return mux
}
{{</copyable-code>}}

The magic in this file happens in reading and cloning the template, we first read the layout and then we read the content of the post and inject it into the layout.

{{<copyable-code language="go">}}

    // We parse the layout content as a template.
    tmpl, err := template.New("layout").Parse(string(dd))
    ...

    // Here is the magic ✨. We use {{define "content"}} to inject the content of
    // the post into the layout. It will be inserted in the place where
    // the layout has defined the block named "content".
    tt := fmt.Sprintf(`{{define "content"}}%s{{end}}`, dd)
    tmpl, err = template.Must(tmpl.Clone()).Parse(tt)
{{</copyable-code>}}

To do it we use the `{{define "content"}}` block and then we inject the content of the post within that expression.

### Improvements and caveats

In order to illustrate this concept of layouts for Go templates I simplified the blog post server, in doing so I traded some software attributes for simplicity. I wanted to point some important points:

- The blog pose server is not secure as it reads from the filesystem.
- We could have implemented some caching layer for the layout.
- The templates could be embedded instead of read from the filesystem.

While these are cool things we could do, I thought I wanted to concentrate in showing how to do the template layout part. Maybe we could cover these as part of other of my posts. You can check the source code of the blog server in the following git repository.

- [Paganotoni/bloghtmltemplates](https://github.com/paganotoni/bloghtmltemplates)

## Wrapping up

That's all I got. I hope you enjoyed this post. If you find it useful or have any comment I'd love to hear from you, reach me out at [@paganotoni](https://twitter.com/paganotoni) in Twitter or our team at [@Wawandco](https://twitter.com/wawand.co).
