<div align="center">

# Exercise NASA Media Vue

**Coding exercise for a single page webapp that queries the NASA media API**

[![Check Status](https://badgen.net/github/checks/evelynhathaway/exercise-nasa-media-vue/?icon=github)](https://github.com/evelynhathaway/exercise-nasa-media-vue/actions)

</div>

## Description

Single page app webapp using the NASA Image and Video Library written in Vue.js and BootstrapVue.

## Features

- Displays a table of media from the API
	- Preview column using the thumbnail link from the API
	- Title, Keywords, Media Type, and Description metadata columns
- Search for a certain media by any field ([try online](https://exercise-nasa-media-vue.evelyn.dev/search/earth-blue-marble/image))
- Filter by media type ([try online](https://exercise-nasa-media-vue.evelyn.dev/image))
- Search query, media types, and page number are preserved in the URL ([try online](https://exercise-nasa-media-vue.evelyn.dev/search/test/image-video/2))
	- Hydrates the state on reload

## Project Structure

Most of this project reflects Vue's default project structure.

Most of the logic is in the:
- [`<MediaTable>` component](src/components/MediaTable.vue)
- [`search-params.js` mixin](src/mixins/search-params.js)
- [`nasa-api.js` API abstraction](src/util/nasa-api.js)

## Opportunities

First things I'd change before using this in production.

### Polish

After implementing  the basic qualifications of this coding exercise, I implemented features that would match the exercise well as a challenge to learn the implementation of Bootstrap written in Vue.js (I only used the vanilla Bootstrap version before.).

Since I went for an MVP of a webapp approach, the following is what I would do first to polish the webapp:

- Treeshake Bootstrap by importing the only the components I used
	- This would prevent the warnings shown on `build` and would decrease load time
- Use a design spec provided by designers or use my own mockups
	- Replace Bootstrap's default styles, Vue's favicon, etc.
- Automatically scroll to the top of the table when changing pages
- Implement placeholders, spinners, and empty states for a more input-responsive feel
- Add error handling for edge cases
	- Would need to spend more time testing to determine them

### Tests

I added some tests to cover the basics of the `<MediaTable>` component. This integration tests a significate amount of the project; however, I would add more to the following areas if pursuing this project again.

- Test the routes
- Test the other two components
- Add edge cases for pagination

### Features

- Loading each media entry in a lightbox would be fairly easy using NASA's API
	- I partially implemented an [API with more details](https://github.com/evelynhathaway/exercise-nasa-media-vue/blob/e48f5335aa3e578b15b935fd50ea85caa9cd407b/src/util/nasa-api.js#L27-L30)

---

## Installation

```bash
git clone https://github.com/evelynhathaway/exercise-nasa-media-vue.git
cd exercise-nasa-media-vue
npm install
```

## Launch Development Server

[**Just want to view it?**](https://exercise-nasa-media-vue.evelyn.dev)

```bash
npm run serve
```

## Production

```bash
# Build for production
npm run build
```

## Testing

```bash
# ESLint all JS and Vue files
npm run lint
# Test with Jest
npm run test
```
