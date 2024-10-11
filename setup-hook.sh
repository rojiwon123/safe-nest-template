#!/bin/sh

git config core.hooksPath ./hooks

for file in ./hooks/*; do
    if [ -f "$file" ]; then
        chmod +x "$file"
    fi
done