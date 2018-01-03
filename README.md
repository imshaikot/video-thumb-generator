
<h1 align="center"> Generate/capture screenshots from videos on the fly over HTML5 </h1>
<p align="center">
  This library will let you grab screenshots from video tracks that supported by modern web browsers and will give you standard images (ObjectURL or base64 DataURL) 
</p>
<p align="center">
  <a href="https://www.npmjs.org/package/video-thumb-generator"><img src="https://img.shields.io/npm/v/video-thumb-generator.svg?style=flat-square" /></a>
  <a href="https://travis-ci.org/imshaikot/video-thumb-generator"><img src="https://api.travis-ci.org/imshaikot/video-thumb-generator.svg" /></a>
</p>

## Demo

<a href="https://imshaikot.github.io/video-thumb-generator/">https://imshaikot.github.io/video-thumb-generator/</a>

## Installation

```bash
$ npm install video-thumb-generator --save
```
OR
```
<script src="https://unpkg.com/video-thumb-generator/umd/VideoToThumb.min.js"></script>
```

## Getting Started

This is a tiny library to get screenshots from video tracks either from your local filesytem OR same-origin based URL.

```js
// Using ES6
import VideoToThumb from 'video-thumb-generator'; // This is a default export, so you don't have to worry about the import name

// Not using ES6
var VideoToThumb = require('video-thumb-generator');
```

## Example and API

The constructor - you have to pass whether a local origin URL (such as http://mydomain.com/video.mp4) OR a HTML5 File Object.
See the example below
```js
const videoToThumb = new VideoToThumb(file.files[0]); // OR you could pass instantiate new VideoToThumb('http://mydomain.com/video.mp4')
```
The instance of VideoToThumb contains a bunch of method (which are chained) but to get strated you have to call the `load()` method before any other chained method being called

```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load(); // This will start the process
```
After the `.load()` being called then you're free to call other methods. Like `.positions([])` method - this method will accept a parameter as an Array of the positions (in second) of video duration where you want to capture the screenshots. The Defualt value is `[1]`
```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load()
.positions([223, 555, 632, 104]);
```
In order to set the returned screenshots size - you can call `.size([320, 240])` - default is `[320, 240]`
```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load()
.positions([223, 555, 632, 104])
.size([480, 360]); // 480x360 pixel
```
You can also customize the screenshot coordinates by calling `xy([0, 0])` this method. This method will decide from which coordinate to start capturing the snapshots.
```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load()
.positions([223, 555, 632, 104])
.xy([0, 0])
.size([480, 360]);
```
Another method `type()` - this method to tell whether you want the image to be returned as `base64` dataURL OR HTML5 `objectURL` - default `'objectURL'`
```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load()
.xy([0, 0])
.size([480, 360])
.positions([223, 555, 632, 104])
.type('base64')
```
And finally the `done(successCB, errorCB)` method. Remember the `load()` method to start and now `done` to end the process and your job done. This method accept two parameters `successCallback` and `errorCallback` and both are required.
The success callback returns the successive screenshots that have been taken as an array.
```js
const videoToThumb = new VideoToThumb(file.files[0]);
videoToThumb
.load()
.xy([0, 0])
.size([480, 360])
.positions([223, 555, 632, 104])
.type('base64')
.done(function(imgs) {
  imgs.forEach(function(img) {
    var elem = new Image();
    elem.src = img;
    document.body.appendChild(elem);
  })
}, function(err) {
  console.log(err);
})
```

Note: All methods are chained, that means every method returns the same instance/context and that means you can call any method in any order but `load()` method must be called at the top and `done()` at the bottom, unless you want some silent errors ;)

<b>Warnings:</b> few errors are still silent and won't reach the error callback. Feel free to make pull request.

## LICENSE

MIT
