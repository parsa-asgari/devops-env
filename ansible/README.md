# Commands 
```bash
ssh-copy-id localhost
ssh-copy-id homelab-controlplane-1 && ssh-copy-id homelab-node-1 && ssh-copy-id homelab-node-2

# install latest ansible version
python3 -m pip install --upgrade pip
pip install ansible

# add /home/vagrant/.local/bin to PATH
echo PATH=$PATH:/home/vagrant/.local/bin >> .bashrc
```