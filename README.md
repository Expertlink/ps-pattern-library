vse-responsive-pilot
====================

## Installation

### Requirements

You'll need a few things installed before you can run the project locally:

* [node.js](http://nodejs.org/)
* [Ruby](https://www.ruby-lang.org/en/)
* [Sass](http://sass-lang.com/): `gem install sass`
* [Gulp](http://gulpjs.com/): `npm install -g gulp`

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
