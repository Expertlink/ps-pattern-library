## Using the pattern library

### Patterns

* Any file with the extension `.hbs` within the patterns source directory structure will be treated as a pattern.
* Patterns are Handlebars.
* Pattern filenames beginning with `_` will be treated as hidden or special items. They are available as partials but do not show up in rendered patterns.

#### Partials

* All `.hbs` files are available as partials, also, and may be used from any other `.hbs` file.
* Partials are keyed as `<parentDirectory>/<partialName>` where `<parentDirectory>` is the immediate parent directory name, and `<partialName>` is the partial's filename, without extension. Both `<parentDirectory>` and `<partialName>` are exclusive of leading digits, e.g. `03-a-directory/02-a-pattern` is available as `a-directory/a-pattern`.

#### Helpers

* Any helper defined and exported in the `templateHelpers.js` script in the patterns source root is available to all patterns and partials.

#### Data

* Global data lives in the `source/data` directory in JSON files. This data is namespaced by JSON filename (e.g. `foo.json` is available on the `foo` object) and available to all templates.
* Local data is available by creating a JSON file with the same name as the pattern it's for, in the same directory. Properties from local data are available at the top level.
* Local data will supersede global data in the case of a namespace conflict.
* The variable `{{ pathRoot }}` is available to patterns to create a relative path to the top of the pattern library.

#### Front Matter

You can use YAML front matter in patterns. Supported currently:

* `name`: Override the default name for the pattern (filename-derived).
* `description`: Documentation/notes to render with the template in the pattern library (TODO markdown support).
* `showSource`: Render syntax-highlighted source (default `true`).
* `showHeader`: Render the pattern's name and description (default `true`).

##### Example

```
---
name: My custom pattern name
description: This pattern does this for this reason so you want to use it in this way
---

<h1>Pattern contents...</h1>
```

YAML front matter goes at the top of `.hbs` files as in the example above.

#### The somewhat-special "welcome" pattern

There is only one non-hidden pattern at the root level (at the start of things, anyway). This is `welcome.hbs` and by default it is set to hide its heading and source. You can use it as a place to put content you'd like to render on a landing page.

Of course, any other non-hidden patterns (`.hbs` files) you put in this directory will also render onto the landing page.

### Templating and Styling the Style Guide

There are some special templates that are used to build the style guide itself. These are prefixed with two underscores (`__`).

The style guide builder will look for the nearest:

* `__INDEX.template`: This is the overall template for the `index` page for each directory.
* `__PATTERN.template`: This is the template used to wrap each individual pattern.

In addition, there is a `__NAV.hbs` template. This renders navigation.

Don't delete these from the patterns source root (though you *can* edit them as you see fit!).

#### Style Guide Core Templates

`__INDEX` and `__PATTERN` have `.template` extensions, but `__NAV.hbs` has a Handlebars extension. That is so that `__NAV.hbs` is available as a partial (it gets used in `__INDEX`).

`__INDEX` and `__PATTERN` are compiled both as EJS and Handlebars (crazy, eh?). You can use Handlebars or EJS/Javascript template syntax in them, with some exceptions explained below.

##### Special Template Objects and Variables

`__INDEX` and `__PATTERN` are both used to wrap content. You'll see the magic variable:

`<%= contents %>`

in those templates. Do not remove this. It's what renders the, uh, content!

In addition, there are some other metadata available in the EJS-compiled `__PATTERN` template. The `file.meta` object represents the YAML front matter for the template at hand.

**Summary:**

* `<%= contents %>` needs to remain in these templates
* `file.meta` is an object with data available _only_ in EJS within the `__PATTERN` template.
* Otherwise you can use Handlebars syntax to work with any and all templates.

##### Overriding and Customizing

The builder will look for the _closest_ `__INDEX` and `__PATTERN` templates, traversing upwards. If you want to override/customize these for particular sections, you can create an `__INDEX` and/or `__PATTERN` template file at the level you desire and it will be used for that level and anything below it.

##### Styles and Scripts

You can look at the `__INDEX` template(s) to see exactly what styles and scripts are being included, but note the presence of:

* `source/styles/patterns.scss`
* `vendor` (where some of the 3rd-party scripts and styles are housed)
* `source/assets/js`: Scripts