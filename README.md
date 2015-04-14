ExpertLink's vse-responsive-pilot
====================

## Installation

### Requirements

You'll need a few things installed before you can run the project locally:

* [node.js](http://nodejs.org/)
* [Ruby](https://www.ruby-lang.org/en/)
* [Sass](http://sass-lang.com/): `gem install sass`
* [Gulp](http://gulpjs.com/): `npm install -g gulp`

Note: Depending on how you installed Ruby or Node, some OS X users may see permission errors unless they prepend either installation command with `sudo`.

### Installation

1. Clone the repository from GitHub
2. `cd` to the project directory
3. Run `npm install`

## Usage

Run the development environment by going to the project directory in a terminal and typing:

```
gulp
```

That's it! A local webserver will start (it should open in your default browser), and will remain open as long as you'd like. Changes to source files should automatically refresh the page in your browser.

To quit the process, tap `ctrl`+`c` with your terminal focused.

## Contributing

### Code Guides

* [Pattern Library Documentation](source/patterns/README.md)
* [CSS Guidelines](source/styles/README.md)

### Git Guide

Follow these steps to contribute to the repository:

1. Before you start, be sure to `git pull` to make sure you have the latest changes from `master`.
2. Create and checkout a new branch. (You can do this from [the terminal](http://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging), [GitHub](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/) or your Git application of choice.)
3. Do your work, committing changes as you go. (Be sure to write [good commit messages](http://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message), you'll thank yourself later!)
4. When your branch is ready to merge, [create a pull request](https://help.github.com/articles/creating-a-pull-request/) with a title and description of the changes made.
5. A Cloud Four team member will review the pull request and may provide feedback.
6. Once you've received the thumbs-up, you may [merge the pull request](https://help.github.com/articles/merging-a-pull-request/). Yay!!

## Build and Deploy

https://vse-responsive-pilot.herokuapp.com

### Pre-Requisites

* You need to be a collaborator or better on the heroku project `vse-responsive-pilot`
* You need to have the heroku remote set up

### Do It

* `$ gulp dist`
* `$ git commit` (Commit the dist build)
* `$ git push heroku`


## Troubleshooting

Having trouble running the `gulp` command?

* Make sure you're in the project's root directory.
* Try running `npm install` (sometimes we add new node packages to the project's requirements as we go).


## SVG creation

1. Add new svg file to '/source/sprites/svg/css' folder
2. Run 'gulp'
3. Grab '/source/build/out/sprite.scss' -> replaces existing scss file
4. Grab '/source/build/out/images/svg-sprite.css-(something).svg' -> replaces existing svg file

Other notes:

Find '/source/sprites/svg' - This contains two folders, `css` and `inline`. Each with SVG files in them. When you run `gulp` (or `gulp dist`), it combs through those folders and assembles two files containing all of the SVG assets therein. These end up in the output `images` directory, and are usually identifiable as `sprite-(something).svg`. The _inline_ SVG is pretty straightforward, because it gets included directly into files just like any image. You can see an example of this in the `icons` pattern. The _CSS_ SVG is the one that's probably giving you trouble. It's designed to be included as a `background-image`. In addition to the SVG files, the script outputs a Sass include to `/source/build/out/sprite.scss`. This is included in our base stylesheet like so: ```// Generated SCSS in source/build/out
@import "sprite";
```
It includes the path to the generated SVG, as well as information about the icons contained therein and a mixin for using it. So_... if you wanted to use this stuff _outside_ of this environment, the steps you'd need to take would be...

1. Run `gulp` to make sure you have the latest.
2. Copy over any new image assets or whatever.
3. Copy `/source/build/out/sprite.scss` somewhere accessible.
4. Change the `@import` line in `styles.scss` to point to wherever that SCSS file is.


