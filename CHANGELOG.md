# QOwnNotes Web App Changelog

## 0.2.1

- More optimizations were done (for [#57](https://github.com/qownnotes/web-app/issues/57))
  - Upgraded ESLint to v9 with flat config support
  - Fixed all npm deprecation warnings
  - Optimized build configuration with manual chunk splitting for better performance
    - Separated vendor libraries into individual chunks
    - Reduced initial bundle size
    - Improved code splitting for faster page loads

## 0.2.0

- Migrate to Vue 3, Vuetify 3 and Vite (for [#57](https://github.com/qownnotes/web-app/issues/57))
  - **Major upgrade**: Migrated from Vue 2 to Vue 3
  - **Major upgrade**: Migrated from Vuetify 2 to Vuetify 3
  - **Major upgrade**: Migrated from Vue CLI to Vite for faster builds and development
  - **Security**: Fixed all security vulnerabilities by removing deprecated Vue CLI dependencies
  - Updated all dependencies to latest versions
  - Improved build performance with Vite (10-100x faster development server)
  - Added Material Design Icons font package
  - Modernized codebase to use Vue 3 features and APIs
  - Updated service worker implementation with vite-plugin-pwa
  - Updated Docker build to use Node 22

## 0.1.12

- Update dependencies

## 0.1.11

- You are now able to view the token
- You can now scan the token from a QR code in the settings dialog of QOwnNotes 21.7.6 or newer
- All `console.log` commands are now `console.debug`

## 0.1.10

- Heic/Heif images can now also be loaded by converting them to JPG images

## 0.1.9

- The form elements in the mobile layout were improved

## 0.1.8

- You can now set the maximum image height and width
- You can now set the output image format

## 0.1.6

- An image preview and image rotating was added

## 0.1.5

- The service worker was disabled to prevent update problems

## 0.1.1

- The version number will now be shown in the headline

## 0.1.0

- Initial implementation with token storing and file loading
