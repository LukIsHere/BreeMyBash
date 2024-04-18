#!/bin/bash
#for debugging purposes only
#export debugbree=true

export breePath=$(pwd)
source ./helper/env.sh

#adding bree to path
addPath "$breePath/bin"

#loading rest of the environment
source "$breePath/data/env.sh"
