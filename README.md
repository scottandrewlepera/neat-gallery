# Neat Gallery!

Easy responsive image galleries for static websites. Point this tool at a folder of images and it'll do the following:

* create thumbnail images for fast loading
* generate a minimal, customizable HTML file for your gallery with a grid or masonry layout
* automatically set up [Photoswipe](https://photoswipe.com/)

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

https://github.com/user-attachments/assets/01b181ba-d8ed-4929-a31f-38d0e0e7c458

You can then upload your gallery folder to your website as-is, or alter the CSS and HTML as needed.

## Gallery options

The following command-line arguments provide more options:

| Argument | Default | Description |
|--------|---------|-------------|
| `-i`,<br>`--input` | N/A | The target folder of images. This is the only required argument |
| `-w`,<br>`--width` | 500 | The desired width of thumbnail images in pixels |
| `-t`,<br>`--title` | "Gallery" | The gallery title or name |
| `-p` | "." | A prefix for image URLS. Defaults to relative local to gallery page |
| `-l`,<br>`--layout` | "grid" | The gallery layout. Accepted values are "grid" or "masonry" |
| `--nohtml` | false | When present, only the list of images is output. Inline CSS, Photoswipe JS, and the enclosing HTML body is excluded from the HTML output |
| `-r` | false | Regenerate thumbnails. See explanation below.


IMPORTANT: the `--width` argument dictates the width of the generated thumbnail image **file** in order to keep filesizes manageable, not the actual displayed width of the thumbnail.

Use the `-p` argument to override from where the images will be served. Note that you will need to move the images to that location.

The `--nohtml` argument is useful if you have copied the CSS and Photoswipe JS into a common file on your website and no longer need it to be included in gallery pages.

By default, thumbnails are only created the first time the gallery is created. If you need to regenerate thumbnails, re-run the script with the `-r` flag. Thumbnails are also automatically regenerated if you pass the `-w` or `--width` arguments with any value other than the default 500px value.

### Examples

Create a gallery with 300px thumbnail images and masonry layout:

```bash
node neat-gallery.js -i my-image-folder -w 300 -l masonry
```

Create a gallery without the CSS and Photoswipe JS, with images served from AWS Cloudfront:

```bash
node neat-gallery.js -i my-image-folder --nohtml -p "https://my-domain.cloudfront.net/images/"
```

Note that you'll need to copy the images and thumbnail folder to the Cloudfront AWS bucket for the images to appear in the gallery.

## Creating and preserving ALT text

You can insert ALT text by hand into the gallery HTML page, but be aware that this will be overwritten if you ever need to regenerate the gallery page. Neat Gallery! has a simple mechanism to preserve ALT text for images.

The first time you generate a gallery, the script will create a `gallery.json` file alongside the HTML file. This JSON file is a simple mapping between each image file and an empty ALT text field. The script will read this file to assign ALT text to the thumbnail HTML images.

Once created, you can edit this file to assign ALT text to each image:

```json
{
	"IMG_5686.jpeg": {
		"alt": "A photo of white roses in the garden."
	},
	"IMG_5746.jpeg": {
		"alt": "A photo of a willow tree swaying in the breeze." 
	},
  ...
}
```

When you're done editing ALT text, save `gallery.json` and re-run the script. The resulting HTML gallery thumbnails should now include your ALT text.

You can re-run the script as many times as needed and ALT text should be preserved, even if you change the path to the image.

> NOTE: the ALT text is mapped to the image file name, so changing the file names will cause the ALT text to no longer be applied. In this case, you'll have to correct the file names in `gallery.json`.


