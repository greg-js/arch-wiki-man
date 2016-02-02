_This is a work in progress_

A tool to browse and search a constantly updated local copy of the entire (English) Arch Wiki on the command line using `man`.

# Installation
```
npm install arch-wiki-man
```

# Usage

Use the `awman` command (it stands for arch wiki man)

```
awman beginners guide
```
--> Just one match for `beginners guide` so the article will open with `man`

```
awman guide
```
--> Multiple matches for `guide` so a selection menu will be displayed

```
awman -d i3
```
--> `-d` or `--desc-search` option searches in the descriptions for a match as well as in the titles

```
awman -k wayland
```
--> `-k` or `--apropos` option searches in the contents for a match.

```
awman -w tmux
```
--> `-w` or `--web` option opens the resulting match in a web browser rather than with `man`


# License
Licensed under GPLv3
