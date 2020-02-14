# YelpMap


### First Time Setup for Linux
Clone the repository to your home directory
```
git clone git@github.com:RiceCakess/YelpMap.git
```
Make copies of the default config files for both api and web
```
cd ~/YelpMap/api
cp config.default.js config.js

cd ~/YelpMap/web
cp config.default.js config.js
```
Use your favorite editor to fill in API/MySQL details

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
