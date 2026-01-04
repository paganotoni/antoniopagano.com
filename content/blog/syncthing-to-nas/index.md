---
date: 2025-11-28
title: "Syncthing to my NAS"
draft: false
type: post
author: "@paganotoni"
description: "Sharing my experience setting up Syncthing to sync files between my computers and home NAS. A practical guide to continuous file synchronization with real-world configuration tips."

summary: This post walks through setting up Syncthing to sync files between multiple computers and a NAS device. It covers installation on Arch Linux, Docker setup for NAS, device configuration via Tailscale, and important exclusion patterns to avoid syncing unnecessary files.

tags: ["tools", "devops", "networking", "deployment"]
---

One of the challenges I had since moving to Omarchy was to find a reliable way to sync files between my (at this point) two main computers: a laptop I use when I work from the office and my mini computer at home. Both run Omarchy (BTW) and were connected to the Tailscale network I use to connect all my devices.

I was tempted to use a service like Dropbox but certainly I wanted to use the NAS I have at home as much as possible, so I started looking for alternatives. My initial thought was to use rsync over SSH, however, I knew that would require some scripting and I wanted something more automatic. After some research I found [Syncthing](https://syncthing.net/).

Syncthing is... Well, I better let their website describe it:
> Syncthing is a continuous file synchronization program. It synchronizes files between two or more computers in real time, safely protected from prying eyes. Your data is your data alone and you deserve to choose where it is stored, whether it is shared with some third party, and how it’s transmitted over the internet.

So, it looks like its the perfect fit for my needs. It is open source, it works over LAN and WAN, it has a web interface and it is cross platform. Perfect.

Installing Syncthing was very easy on Arch (BTW!) since it is available on the AUR:

```bash
sudo pacman -S syncthing
# Enable and start the syncthing service
systemctl --user enable --now syncthing 
```

After that I accessed the web interface at `http://localhost:8384` and started configuring my devices. I installed Syncthing on both my mini computer and the NAS. 

For the NAS, as I use the Ugreen DXP4800 I installed Syncthing using Docker. As I had already installed Tailscale on my NAS it was very easy.

Once both devices were connected to the same Tailscale network, I added them as devices on Syncthing. After that I created a folder on my mini computer that I wanted to sync with the NAS and shared it with the NAS device. On the NAS side I accepted the folder and selected the path where I wanted to store the files.

One important thing to note is the exclusion pattern list, to start I kept my `code` folder out as well as some other patterns I keep in github:

```.gitignore
**/code/*   # Don't want to sync my code folder
**/.git     # No git files
go          # ignore the go folder at home
**/.*       # Ignore all hidden files
.cache      # No Cache
.local      # I read I should ignore this one
```

Then on the laptop I repeated the process of installing syncthing and added the NAS as a device. I then shared the same folder from the mini computer to the laptop. After some time the files started syncing between the three devices.

I am pretty happy with Syncthing so far. That said, I have to admit I'm just getting started with it, so I will see how it goes in the long term. So far it seems to be working well and I like the fact that I have full control over my day to day data.
