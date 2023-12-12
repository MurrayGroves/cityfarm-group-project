#!/bin/bash
sudo mkdir /mnt/mongodbshare
if [ ! -d "/etc/smbcredentials" ]; then
sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/cityfarmstorage.cred" ]; then
    sudo bash -c 'echo "username=cityfarmstorage" >> /etc/smbcredentials/cityfarmstorage.cred'
    sudo bash -c 'echo "password=QWbF2IqixvkyvfrQJ0jZ6mCbKPz8ictK19ukNHtgc/Hyo/vKmuVfciWn9xamscywzx3gMY/G9XbI+AStUN7QZw==" >> /etc/smbcredentials/cityfarmstorage.cred'
fi
sudo chmod 600 /etc/smbcredentials/cityfarmstorage.cred

sudo bash -c 'echo "//cityfarmstorage.file.core.windows.net/mongodbshare /mnt/mongodbshare cifs nofail,credentials=/etc/smbcredentials/cityfarmstorage.cred,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30" >> /etc/fstab'
sudo mount -t cifs //cityfarmstorage.file.core.windows.net/mongodbshare /mnt/mongodbshare -o credentials=/etc/smbcredentials/cityfarmstorage.cred,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30
