A tool to browse and search a constantly updated local copy of the entire (English) Arch Wiki on the command line using `man`.

# Installation
```
npm install -g arch-wiki-man
```

![screenshot](./docs/screenshot.png)

# Usage & Examples

## `awman`

```
awman beginners guide
```

Just one match for `beginners guide` so the article will open with `man`. By the way, `awman` stands for arch wiki man.

## Multiple matches

```
awman guide
```

There are multiple matches for `guide` so a selection menu will be displayed. Use the arrow keys or vim-style keybindings (j/k) to select the one to read.

## Search in descriptions

```
awman -d i3
```

The `-d` or `--desc-search` option causes searches to scan both the titles _and_ the descriptions for a match.

## Apropos

```
awman -k wayland
```

The familiar `-k` or `--apropos` option causes searches to scan the contents for a match as well. This option makes searches run significantly slower.

## Open in a browser

```
awman -w tmux
```

The `-w` or `--web` option opens the resulting match in a web browser rather than with `man`. It uses `xdg-open` to open the relevant url in your default browser.

# Updating

```
npm install -g arch-wiki-man

```

Updates are pushed automatically every two days to `https://github.com/greg-js/arch-wiki-md-repo`, a dependency for this project. Whenever the install command is run, the changes will be fetched.

# License

Licensed under GPLv3
