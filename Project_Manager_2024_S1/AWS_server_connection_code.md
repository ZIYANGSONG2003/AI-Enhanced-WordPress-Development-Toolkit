# connect AWS
ssh -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" ubuntu@ip_address

# upload build folder
 scp -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" -r "C:\Users\ZIYANG SONG\Desktop\test\build" ubuntu@ip_address:/usr/share/nginx/html/build
