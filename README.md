# PlaceMorty
A simple service for getting pictures of Morty for use as placeholders in your designs or code.

## Usage
__Base URL:__ https://placemorty.us
* Color
  * `https://placemorty.us/{width}/{height}`
* Greyscale
  * `https://placemorty.us/g/{width}/{height}`

### Example (html)
```html
<img src="https://placemorty.us/300/200" />
<img src="https://placemorty.us/g/500/200" />
```

## Installation

### Redis
```bash
# install redis
brew update && brew install redis

# run redis
redis-server
```

### Application
```bash
# Install dependencies
yarn

# run dev server
yarn dev

# build + run
yarn start
```
## Routes
- `/` - Home
- `/{width}/{height}` - Color image
- `/g/{width}/{height}` - Grayscale image
- `/login` - Admin Login
- `/dashboard` - Admin Panel

### Authentication
Create a user:
- uncomment signup route (POST) in `src/routes.js`
- uncomment signup form in `views/login.pug`

## Todo
- [x] Redis image caching
- [x] Store images in s3 bucket
- [x] Authentication for admin panel
- [x] host on digitalocean
