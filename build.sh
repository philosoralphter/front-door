#! /bin/bash

#Enter Your docker repo location here
REPO=us.gcr.io/dynamic-fulcrum-210300/front-door

#get first 6 of commit hash to tag repo
BUILD=$(git rev-parse HEAD | cut -c1-6)

echo "Building for commit $BUILD"
docker build -t $REPO:$BUILD .


#Push image
echo "Pushing Image..."
docker push $REPO:$BUILD
