#!/bin/bash

# Set size limit (100MB)
LIMIT=$((100 * 1024 * 1024))

# List files larger than the limit
echo "Finding files larger than $(($LIMIT / 1024 / 1024))MB..."

# Find and output large files
git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $2 " " $3 }' | \
sort -nr | \
awk '{print $2 " (" $1/1024/1024 " MB)"}'

# Generate .gitattributes file
echo "Generating .gitattributes file for Git LFS..."

git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $3 }' | \
sort -u | \
sed 's/^/\\/' > .gitattributes

echo "*.lfs filter=lfs diff=lfs merge=lfs -text" >> .gitattributes

echo ".gitattributes file generated."

# Generate .gitignore file
echo "Generating .gitignore file for large files..."

git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $3 }' | \
sort -u > .gitignore

echo ".gitignore file generated."

echo "Done."
