#!/bin/sh
cd ~/webapps/homeleads
git pull origin master
yarn
npm run build
npm run start
