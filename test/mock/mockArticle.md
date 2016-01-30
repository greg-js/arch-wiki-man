# 2bwm

From ArchWiki

**Warning:** 2bwm is still in alpha stage and should be used cautiously. At the moment, 2bwm is only for advanced users.

[2bwm](https://aur.archlinux.org/packages/2bwm/)<sup><small>AUR</small></sup> is a fast floating WM, with the particularity of having 2 borders, written over the XCB library and derived from mcwm written by Michael Cardell. In 2bwm everything is accessible from the keyboard but a pointing device can be used for move, resize and raise/lower. The name has recently changed from mcwm-beast to 2bwm.

## Contents

*   [1 Installation](#Installation)
*   [2 Configuration](#Configuration)
    *   [2.1 Starting 2bwm](#Starting_2bwm)

## Installation

[Install](/index.php/Install "Install") [2bwm](https://aur.archlinux.org/packages/2bwm/)<sup><small>AUR</small></sup>. Although the installation process can be automatic, if directly building from the AUR, it is highly recommended to read and edit the "config.h" file in the source directory.

## Configuration

### Starting 2bwm

2bwm generally starts from a script, either from [startx](/index.php/Startx "Startx") or from a login manager such as [XDM](/index.php/XDM "XDM").

If it starts from the console, a .xinitrc file is needed. Here is a complete example:

```
 #!/bin/sh

 # Set a nice background.
 xsetroot -solid grey20

 # Load resources.
 xrdb -load ~/.Xresources

 # Start window manager in the background. If it dies, X still lives.
 2bwm &

 # Start a terminal in the foreground. If this dies, X dies.
 exec urxvt

```

2bwm used to have startup options. They have been removed because editing the config file was more convenient.

## See also

*   [2bwm](https://github.com/venam/2bwm) - the GitHub repository for 2bwm

Retrieved from "[https://wiki.archlinux.org/index.php?title=2bwm&oldid=414463](https://wiki.archlinux.org/index.php?title=2bwm&oldid=414463)"

[Category](/index.php/Special:Categories "Special:Categories"):

*   [Stacking WMs](/index.php/Category:Stacking_WMs "Category:Stacking WMs")
