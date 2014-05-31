#!/bin/bash
clear
echo "Installing grunt dependencies..."
npm install
dt=$(cat ~/deployment_type);

# check for the deployment 
grunt $dt