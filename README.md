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
- [x] Image caching
- [x] Store images in s3 bucket
- [x] Authentication for admin panel
- [ ] host on digitalocean
