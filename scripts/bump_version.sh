#!/bin/bash

# Usage: ./bump_version.sh [major|minor|patch]
# Default: patch

FILE="package.json"

if [ ! -f "$FILE" ]; then
  echo "package.json not found!"
  exit 1
fi

PART=${1:-patch}

# Extract current version (assumes a well-formed package.json)
current=$(jq -r .version package.json)
IFS='.' read -r major minor patch <<< "$current"

case $PART in
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  patch)
    patch=$((patch + 1))
    ;;
  *)
    echo "Usage: $0 [major|minor|patch]"
    exit 1
    ;;
esac

new="$major.$minor.$patch"

# Update package.json with new version
tmp=$(mktemp)
jq --arg v "$new" '.version = $v' package.json > "$tmp" && mv "$tmp" package.json

echo "Version bumped to $new"