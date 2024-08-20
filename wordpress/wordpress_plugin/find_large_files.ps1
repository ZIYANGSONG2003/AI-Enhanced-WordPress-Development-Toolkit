# 设置文件大小阈值（例如 100MB）
$threshold = 100MB

# 设置要检查的目录
$directory = "C:/Users/ZIYANG SONG/Desktop/COMP3500_GITHUB_DESK/AI-Enhanced-WordPress-Development-Toolkit/wordpress"

# 查找超过阈值大小的文件
$largeFiles = Get-ChildItem -Path $directory -Recurse | Where-Object { $_.Length -gt $threshold }

# 输出找到的文件
if ($largeFiles) {
    "以下文件超过 $threshold,将添加到 .gitattributes 和 .gitignore:" | Out-File -FilePath .'/'large_files_report.txt
    $largeFiles | ForEach-Object {
        $_.FullName | Out-File -FilePath .'/'large_files_report.txt -Append
        # 将文件路径添加到 .gitattributes 和 .gitignore
        Add-Content -Path .gitattributes -Value ("$($_.FullName) filter=lfs diff=lfs merge=lfs -text")
        Add-Content -Path .gitignore -Value ("$($_.FullName)")
    }
    Write-Output "文件已成功添加到 .gitattributes 和 .gitignore。"
} else {
    Write-Output "没有找到超过 $threshold 的文件。"
}
