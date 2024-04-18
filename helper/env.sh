#!/bin/bash
addPath(){
	if [ "$debugbree" ]
	then
		echo "adding $1"
	fi

	PATH=$PATH:$1
}