#! /bin/bash
#get first 6 of commit hash to tag repo
BUILD=$(git rev-parse HEAD | cut -c1-6)

echo "Building for commit $BUILD"

docker build -t us.gcr.io/dynamic-fulcrum-210300/front-door:$BUILD .
