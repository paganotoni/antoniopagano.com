## antoniopagano.com

This is the repo for my personal website. In it I share some info about me and my projects.

### Tools

This is a Hugo website that uses Tailwindcss to style the html. The deployment workflow requires the tailwindcss standalone CLI to be used to compile the `assets/css/tailwind.css` file which will generate the required css in the `assets/css/styles.css` file.

### Development

To develop locally you need to have Hugo installed. You can follow the instructions in the [Hugo documentation](https://gohugo.io/getting-started/installing/).

You also need to have the Tailwindcss CLI installed. The dev script requires you to have the binary inside the bin folder named `tailwindcss`. You can follow the instructions in the [Tailwindcss documentation](https://tailwindcss.com/blog/standalone-cli) to install the CLI. Or run the `setup.sh` script to install it.

```sh
./setup.sh
```

Once you have Hugo and the Tailwind CLI installed you can run the `dev.sh` script to start the development server.

```bash
./dev.sh
```