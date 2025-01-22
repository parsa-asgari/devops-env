Vagrant.configure("2") do |config|

  # What it does:
  config.ssh.forward_agent = true

  # A list of VMs and their details.
  servers=[
      {
        :hostname => "homelab-controlplane-1",
        :box => "bento/ubuntu-22.04",
        :version => "202407.23.0",
        :ip => "192.168.56.5",
        :ssh_port => '2211'
      },
      {
        :hostname => "homelab-node-1",
        :box => "bento/ubuntu-22.04",
        :version => "202407.23.0",
        :ip => "192.168.56.6",
        :ssh_port => '2212'
      },
      {
        :hostname => "homelab-node-2",
        :box => "bento/ubuntu-22.04",
        :version => "202407.23.0",
        :ip => "192.168.56.7",
        :ssh_port => '2213'
      },
      {
        :hostname => "homelab-ansible",
        :box => "bento/ubuntu-22.04", # the vagrant box's name
        :version => "202407.23.0", # the vagrant box's version
        :ip => "192.168.56.4", # the vagrant ip, for later local network service discovery
        :ssh_port => '2210' # for ssh port forwarding on the host
      }
    ]

  # A loop to iteratively create and provision machines
  servers.each do |machine|
      config.vm.define machine[:hostname] do |node|
          node.vm.box = machine[:box]
          node.vm.hostname = machine[:hostname]
          node.vm.network :private_network, ip: machine[:ip]
          node.vm.network "forwarded_port", guest: 22, host: machine[:ssh_port], id: "ssh"
          node.vm.provider :virtualbox do |vb|
            if node.vm.hostname.include?('controlplane')
              vb.customize ["modifyvm", :id, "--memory", 2000]
              vb.customize ["modifyvm", :id, "--cpus", 2]
            elsif node.vm.hostname.include?('node')
              vb.customize ["modifyvm", :id, "--memory", 3000]
              vb.customize ["modifyvm", :id, "--cpus", 4]
            elsif node.vm.hostname.include?('ansible')
              vb.customize ["modifyvm", :id, "--memory", 1500]
              vb.customize ["modifyvm", :id, "--cpus", 2]
            end
          end

          # provision the ansible machine
          if node.vm.hostname.include?('ansible')
            node.vm.provision "shell", inline: <<-SHELL
            sudo apt-get update
            sudo apt-get install -y git python3 python3-pip sshpass bash-completion
            sudo bash -c 'cat /vagrant/hosts >> /etc/hosts'
            runuser -l vagrant -c 'pip install --upgrade pip'
            runuser -l vagrant -c 'pip install ansible'
            runuser -l vagrant -c 'ssh-keygen -b 2048 -t rsa -f ~/.ssh/id_rsa -q -N ""'
            runuser -l vagrant -c 'sshpass -p vagrant ssh-copy-id -o StrictHostKeyChecking=no homelab-ansible'
            runuser -l vagrant -c 'sshpass -p vagrant ssh-copy-id -o StrictHostKeyChecking=no localhost'
            runuser -l vagrant -c 'sshpass -p vagrant ssh-copy-id -o StrictHostKeyChecking=no homelab-controlplane-1'
            runuser -l vagrant -c 'sshpass -p vagrant ssh-copy-id -o StrictHostKeyChecking=no homelab-node-1'
            runuser -l vagrant -c 'sshpass -p vagrant ssh-copy-id -o StrictHostKeyChecking=no homelab-node-2'
            runuser -l vagrant -c 'echo PATH=\"\$HOME/.local/bin:\$PATH\" >> .profile'
            runuser -l vagrant -c 'cd /vagrant/ansible && ansible-playbook -i k3s -i ansible site.yml'
            SHELL
          end

      end
  end
end