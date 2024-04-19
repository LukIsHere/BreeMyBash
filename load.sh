#!/bin/bash
#for debugging purposes only
#export debugbree=true

source "$breePath/helper/env.sh"

#adding bree to path
addPath "$breePath/bin"

#loading rest of the environment
source "$breePath/data/env.sh"
