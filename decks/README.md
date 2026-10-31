# Decks

Slides for Taylor'd Wraps, written in [Marp](https://marp.app/) markdown and rendered to HTML and PDF beside the source.

| Deck | Open it | What it is |
| --- | --- | --- |
| Hello, Taylor | [slides (HTML)](https://drasticstatic.github.io/taylordwraps-public-preview/decks/hello-taylor.marp.html) · [PDF](https://drasticstatic.github.io/taylordwraps-public-preview/decks/hello-taylor.marp.pdf) · [source](hello-taylor.marp.md) | the first hello: what was built, what it does not do, what it costs (nothing) |

Rebuild after editing the source (from this folder):

```sh
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
marp --allow-local-files hello-taylor.marp.md -o hello-taylor.marp.html
marp --allow-local-files hello-taylor.marp.md -o hello-taylor.marp.pdf
```

These files are mirrored from the private source repository like the rest of the Car Show; edit them there, not here.
