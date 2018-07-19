#! /bin/bash

#Enter Your docker repo location here
REPO=us.gcr.io/dynamic-fulcrum-210300/front-door

#get first 6 of commit hash to tag repo
BUILD=$(git rev-parse HEAD | cut -c1-6)

echo "Building for commit $BUILD"
docker build -t $REPO:$BUILD .

#Check build was successful
if [ $? -eq 0 ]
then
    echo -e "\nBuild Successful."
else
    echo -e "\nBuild Failed with code $?"
    exit 1
fi

#Push image
echo -e "\nPushing Image..."
docker push $REPO:$BUILD

#Check push was successful
if [ $? -eq 0 ]
then
    echo -e "\nPush Successful."
else
    echo -e "\nPush Failed with code $?"
    exit 1
fi
