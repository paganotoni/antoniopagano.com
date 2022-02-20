## antoniopagano.com

This is the repo for my personal website. In it I share some info about me and my projects.

### Tools

This is a Hugo website that uses Tailwindcss to style the html. The deployment workflow requires the tailwindcss standalone CLI to be used to compile the `assets/css/tailwind.css` file. Typically with the following command:

```sh
./tailwindcss -i assets/css/tailwind.css -o assets/css/styles.css
```

Which will generate the required css in the `assets/css/styles.css` file.