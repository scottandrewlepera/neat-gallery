# Neat Gallery!

Easy responsive image galleries for static websites. Point this tool at a folder of images and it'll do the following:

* create thumbnail images for fast loading
* generate an HTML file for your gallery, in either a grid or masonry layout
* automatically connect your gallery to Photoswipe

You can then upload your folder to your website to create an instant swipeable gallery.

## Getting started

You'll need `npm` and Node 18 or higher installed.

Run `npm install` in the project directory to install the required packages.

To create a gallery with default settings, try the following command:

```bash
node neat-gallery.js -i my-image-folder
```

This will result in the following:

* a `/thumbnails/` folder containing generated thumbnail images will be created inside the target folder. The default thumbnail width is 500px.
* a `gallery.html` file will be created inside the target folder. This is a minimal HTML page for your gallery.

Open `gallery.html` in a web browser to see the gallery. By default, all image URLs are relative to the page and the layout will be a grid of squares. The gallery page contains inline CSS and JS that imports the Photoswipe library. Click or tap a gallery image to launch the Photoswipe viewer.

You can then upload your gallery folder to your website as-is, or alter the CSS and HTML as needed.

## Gallery options

The following command-line arguments provide more options:

| Argument | Default | Description |
|--------|---------|-------------|
| -i, --input | N/A | The target folder of images. This is the only required argument |
| -w, --width | 500 | The desired width of thumbnail images in pixels |
| -t, --title | "Gallery" | The gallery title or name |
| -p | "." | A prefix for image URLS. Defaults to relative local to gallery page |
| -l, --layout | "`grid`" | The gallery layout. Accepted values are "grid" or "masonry" |
| --nohtml | false | When present, only the list of images is rendered, inline CSS and JS is excluded from the HTML output

IMPORTANT: the `--width` argument dictates the width of the generated thumbnail image **file**, not the onscreen size of the displayed thumbnail image!

Use the `-p` argument to override from where the images will be served. Note that you will need to move the images to that location.

The `--nohtml` argument is useful if you have copied the CSS and JS into a common file on your website and no longer need it to be included in gallery pages.

### Examples

Create a gallery with 300px thumbnail images and masonry layout:

```bash
node neat-gallery.js -i my-image-folder -w 300 -l masonry
```

Create a gallery without the CSS and Photoswipe JS, with images served from AWS Cloudfront:

```bash
node neat-gallery.js -i my-image-folder --nohtml -p "https://my-domain.cloudfront.net/images/"
```

Note that you'll need to copy the images and thumbnail folder to the Cloudfront AWS bucket for the gallery to work.





