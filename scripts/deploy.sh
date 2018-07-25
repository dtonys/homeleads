#!/bin/sh
cd ~/webapps/homeleads
git pull origin v2
yarn
npm run build
npm run start
