#!/bin/sh
cd ~/webapps/homeleads
git pull origin v2
yarn
npm run build
forever restart homeleads
