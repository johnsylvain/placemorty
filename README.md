# PlaceMorty

A simple service for getting pictures of Morty for use as placeholders in your designs or code.

## Usage

__Base URL:__ http://www.placemorty.us
* Color
  * `http://www.placemorty.us/{width}/{height}`
* Greyscale
  * `http://www.placemorty.us/g/{width}/{height}`

```html
<img src="http://www.placemorty.us/300/200" />
<img src="http://www.placemorty.us/g/500/200" />
```

## Installation

```bash
# Install dependencies
yarn

# run dev server
yarn dev

# build + run
yarn start
```

## Todo

- [x] Image caching
- [ ] host on digitalocean
