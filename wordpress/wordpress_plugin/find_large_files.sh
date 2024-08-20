#!/bin/bash

# 设置大小限制 (100MB)
LIMIT=$((100 * 1024 * 1024))

# 列出大于限制的文件
echo "Finding files larger than $(($LIMIT / 1024 / 1024))MB..."

# 查找并输出大文件
git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $2 " " $3 }' | \
sort -nr | \
awk '{print $2 " (" $1/1024/1024 " MB)"}'

# 生成 .gitattributes 文件
echo "Generating .gitattributes file for Git LFS..."

git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $3 }' | \
sort -u | \
sed 's/^/\\/' > .gitattributes

echo "*.lfs filter=lfs diff=lfs merge=lfs -text" >> .gitattributes

echo ".gitattributes file generated."

# 生成 .gitignore 文件
echo "Generating .gitignore file for large files..."

git rev-list --objects --all | \
git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
sed -n 's/^blob //p' | \
awk -v limit=$LIMIT '$2 > limit { print $3 }' | \
sort -u > .gitignore

echo ".gitignore file generated."

echo "Done."
