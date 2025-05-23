#!/bin/bash
cd /tmp/kavia/workspace/code-generation/quizsphere-1009-1017/quizsphere
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

