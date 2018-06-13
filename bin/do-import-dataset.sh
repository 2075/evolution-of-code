#!/bin/bash

PROJECT_ROOT=$(realpath $(dirname $(dirname "$0")));


# XXX: Allow /tmp/lycheejs usage
if [ -z "$LYCHEEJS_ROOT" ]; then
	LYCHEEJS_ROOT="/opt/lycheejs";
fi;



if [ -f "$LYCHEEJS_ROOT/libraries/lychee/api/strainer.pkg" ]; then

	cd $PROJECT_ROOT;

	if [ -d ./dataset/lychee ]; then
		rm -rf ./dataset/lychee;
	fi;

	mkdir -p ./dataset/lychee;
	cp -R $LYCHEEJS_ROOT/libraries/lychee/api/* ./dataset/lychee/;

else

	echo "ERROR: No dataset source.                                  "
	echo "       Please run lycheejs-strainer check /libraries/lychee";

fi;

