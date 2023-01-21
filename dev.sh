# This script starts the tailwind watcher and the hugo server 
hugo serve &\
./bin/tailwindcss -i assets/css/tailwind.css -c tailwind.config.js -o assets/css/styles.css -w &\

wait