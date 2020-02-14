# YelpMap


### First Time Setup
Clone the repository
```
git clone git@github.com:RiceCakess/YelpMap.git
```
Make copies of the default config files for both api and web
```
cp config.default.js config.js
```
Use your favorite editor to fill in API/MySQL details

Build production copy of Vue and move to public web directory
```
cd YelpMap/web
npm run build
cp dist/* /var/www/
```

Run backend api
```
cd YelpMap/api
npm run start
```
