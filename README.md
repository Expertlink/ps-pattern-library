vse-responsive-pilot
====================

## Installation

### Requirements

* `node` and `npm`
* `ruby`
* `sass` gem

### Installation

1. Clone repository
2. `$ npm install`

## Usage

### Gulp

* `default`
* `watch`

TODO

### Pattern Source

#### Templates

Directories and compiled templates from `source/patterns` will get output as HTML to the static patterns directory (default: `static/patterns`).

Templates are Handlebars with `.hbs` extensions.

##### Partials

Templates may include partials. Partials are named via the following convention: `<directory>/<templateFilename>` where `<directory>` is the immediate parent directory and `<templateFilename>` is the name of the template with any numeric prefix an the extension removed.

e.g. a template with this path:

`source/patterns/05-mything/07-arbitrary-subdirectory/01-hello-noodle.hbs`

would be available as a partial as:

`{{> arbitrary-subdirectory/hello-noodle }}`

Note that:

* Combinations of directory names and templates that are the same could cause collisions. That is, if you have a `subdir/list.hbs` in two places, that could cause woes. I believe this is also the case with Pattern Lab.
* All templates for now are available as partials so it's up to you to avoid circular references.

##### Data

Templates may use data from `JSON` files with the same name in the local directory, or inherit from data in `source/data`. Local data will override global. Data files must have a `.json` extension.

Data from `JSON` files in `source/data` will be namespaced, e.g. data from `source/data/flippers.json` will be namespaced to `flippers` and scoped from templates thus:

`{{ flippers.pointy }}`

Partials inherit scope from their parents.
