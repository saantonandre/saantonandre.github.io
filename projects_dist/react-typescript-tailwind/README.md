# RTTS 

To launch
- on the command line change dir to this folder
- `yarn` to install packages
- `yarn start` to launch on localhost:3000 and open browser

### Configuration/customization
Replace the following;
ctrl+shift+h `rttproject_name`

ctrl+shift+s `rttproject_description`

Recommended: Check the index(`./public/index.html`) to replace meta tags with the app data
Also check the manifest data (`./public/manifest.json`) and replace properties

Replace the following images:
- `./public/favicon.ico`
- `./public/logo192.png`
- `./public/logo512.png`
- .`/public/logo.jpg`

Setup the app custom color scheme in `./src/theme.tailwind.json`

Check dependencies to remove the one you won't use

Once you get the most out of the components remove the one you are not using
https://www.npmjs.com/package/unimported
unimported conf is located at `./unimportedrc.json`

### Mobile debug
Navigate to `./public/index.html` and uncomment the following line: 
`<script src="./mobileConsole/hnl.mobileconsole.min.js"></script>`
