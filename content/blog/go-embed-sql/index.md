---
date: 2022-01-16
title: "Go embed for better SQL query management"
author: "@Wawandco"
draft: false
type: post

tags: [go, golang, embed, stdlib]
description: "Learn how to improve SQL query management in Go using the embed package. Discover how to leverage SQL files with editor syntax highlighting while embedding queries directly into your Go applications"

summary: This post explores using Go's embed package for improved SQL query management in applications. It compares embedding SQL in strings versus using separate SQL files with go:embed. Learn how this enhances editor support and maintains single-binary deployment.

---
With the Go 1.16 release the Go team added a new way to embed files and folders into Go application binaries. This is a great feature as it facilitates a practice that is common in the community and much likely loved by many gophers: shipping a single binary with embedded assets. In my case it even makes me wonder if there is a need to use Docker to deliver our Go binaries, but that's another topic.

One nice pattern I have been using for the last year or so, is to use the `embed` package to facilitate the maintenance of standard formats as SQL, JSON, YAML and even text files. To explain this I will use a SQL example, I will go from what I used to do on Go 1.15 (without embed) and then port it to Go 1.16 using the `embed` package.

Let's start with the following go application which performs a query on a postgres database to then list the results through the standard output.

{{<copyable-code language="go">}}
package main

import (
    "database/sql"
    "fmt"
)

func main() {
    // Connection string would typically come from an environment variable.
    db, err := sql.Open("postgres", "postgres://user:pass@localhost/db")
    if err != nil {
        panic(err)
    }

    query := `
        SELECT
            id,
            name,
            personal_information.email
        FROM
            users
        JOIN
            permissions ON roles.permission_id = permissions.id
        JOIN
            personal_information ON users.id = personal_information.user_id
        WHERE
            permissions.name = 'permissions.edit'
        WHERE
            roles.name = 'admin'
    `

    rows, err := db.Query(query)
    if err != nil {
        panic(err)
    }

    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        var email string

        if err := rows.Scan(&id, &name, &email); err != nil {
            panic(err)
        }

        fmt.Printf("%d %s %s\n", id, name, email)
    }
}
{{</copyable-code>}}

Of course the SQL query could be (and typically will be) a lot more complicated but this simple example illustrates how I used to add the SQL statements within the Go code. Sometimes I'd go one step further and move the SQL code into a global (but private) variable.

{{<copyable-code language="go">}}
package main

import (
    "database/sql"
    "fmt"
)

// SQL query, now outside.
var userEmailQuery = `
SELECT
    id,
    name,
    personal_information.email
FROM
    users
JOIN
    permissions ON roles.permission_id = permissions.id
JOIN
    personal_information ON users.id = personal_information.user_id
WHERE
    permissions.name = 'permissions.edit'
WHERE
    roles.name = 'admin'
`

func main() {
    db, err := sql.Open("postgres", "postgres://user:pass@localhost/db")
    if err != nil {
        panic(err)
    }

    rows, err := db.Query(userEmailQuery)
    if err != nil {
        panic(err)
    }

    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        var email string

        if err := rows.Scan(&id, &name, &email); err != nil {
            panic(err)
        }

        fmt.Printf("%d %s %s\n", id, name, email)
    }
}
{{</copyable-code>}}

Which starts separating the SQL code from the Go code but still sacrifices editor support for languages like SQL and formats like JSON and YAML. With the SQL code being within a string variable the editor support for SQL is lost, its essentially a Go string for VS Code/Vim.

### Embed your SQL as SQL

As I mentioned the `embed` package allows to embed files and directories into the Go binary. To do so you can use the `go:embed` directive. Let's use it to simplify and separate our SQL query from the Go code.

To start I create a file with the content of my query:

{{<copyable-code language="sql">}}
-- `user_information.sql` --
SELECT
    id,
    name,
    personal_information.email
FROM
    users
JOIN
    permissions ON roles.permission_id = permissions.id
JOIN
    personal_information ON users.id = personal_information.user_id
WHERE
    permissions.name = 'permissions.edit'
WHERE
    roles.name = 'admin'
{{</copyable-code>}}

As you can see, the editors and tooling can apply some syntax coloring and highlighting to the SQL file. In some cases and editors you could get things like table and column suggestions, but let's keep going.

Once the file is created I can embed it into the Go binary using the `go:embed` directive.

{{<copyable-code language="go">}}
package main

import (
    _ "embed" // This is required by the compiler to do the embedding piece, otherwise it will fail.
    "database/sql"
    "fmt"
)

//go:embed user_information.sql
var userEmailQuery string

func main() {
    db, err := sql.Open("postgres", "postgres://user:pass@localhost/db")
    if err != nil {
        panic(err)
    }

    rows, err := db.Query(userEmailQuery)
    if err != nil {
        panic(err)
    }

    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        var email string

        if err := rows.Scan(&id, &name, &email); err != nil {
            panic(err)
        }

        fmt.Printf("%d %s %s\n", id, name, email)
    }
}
{{</copyable-code>}}

At runtime the contents of the sql file (`user_information.sql`) will be within the `userEmailQuery` string variable. The Go compiler makes sure that the contents of the file fill the variable, which could have been a slice of bytes or even a file. The resulting code works the same as the initial one but adds the benefits of better editor support and better tooling support, which could mean a better experience for the developer.

### Wrapping up
I hope you have enjoyed this post and found it useful. The say way you can embed your SQL queries you could do with other data like JSON, YAML or even text files. Doing that will facilitate the maintenance of those files as most of the editors will provide you with tools to edit them. Give it a try and see if you like it.
