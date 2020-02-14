# YelpMap


### First Time Setup for Linux
Clone the repository to your home directory
```
git clone git@github.com:RiceCakess/YelpMap.git
```
Make copies of the default config files for both api and install required dependencies
```
cd ~/YelpMap/api
npm install
cp config.default.js config.js
```
Use your favorite editor to fill in API/MySQL details

Likewise for Vue dependencies and config
```
cd ~/YelpMap/web
npm install
cp config.default.js config.js
```

Build production copy of Vue and move to public web directory
```
cd ~/YelpMap/web
npm run build
cp dist/* /var/www/
```

Run backend api
```
cd ~/YelpMap/api
npm run start
```
