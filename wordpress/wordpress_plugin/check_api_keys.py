import os
import re

# 需要检查的目录
directory = "C://Users//ZIYANG SONG//Desktop//COMP3500_AI_website_creator_2024_s2//AI-Enhanced-WordPress-Development-Toolkit"

# 定义API密钥的正则表达式模式
api_key_pattern = re.compile(r'(sk-[A-Za-z0-9]{40,})')

def check_files_for_api_keys(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                matches = api_key_pattern.findall(content)
                if matches:
                    print(f"Found API key(s) in {file_path}: {matches}")

# 运行检查
check_files_for_api_keys(directory)
