# Using the pattern library

The pattern library is a fun and fast way to quickly create and document reusable front-end patterns. You can organize code snippets for display in the style guide, or entire self-contained pages. You can include patterns inside of other patterns, or patterns inside of pages.

## Organization

All webpages are made up of various components (navigation, sidebar, article), which themselves are made up of even smaller elements (heading, button, paragraph, text field). It's important to see how all of these components work in context, but it's also important we see them on their own to ensure that they're flexible (and to document them for future use).

Pattern templates use the file extension `.hbs` and are organized as follows:

```
source/patterns/[pattern type]/[pattern group]/[pattern name].hbs
```

These templates all use Handlebars (a simple and easy form of HTML templating), which [you can read about here](http://handlebarsjs.com/).

### Re-ordering

By default, patterns will be ordered alphabetically by filename. If you'd like to control the order, you can prefix folders and/or filenames with digits and a dash:

```
01-unordered-list.hbs
02-ordered-list.hbs
definition-list.hbs
```

### Including patterns in patterns

Any pattern can include any other pattern within it as a partial by its parent directory and filename. So if you wanted to include the `components/forms/search.hbs` pattern in another, you can do so:

```hbs
<div>
  <h3>Search form</h3>
  {{> forms/search }}
</div>
```

### "Hidden" patterns

If you'd like to hide a pattern from the navigation and styleguide, prefix it with an underscore (`_`). These patterns can still be included like any other:

```hbs
{{> components/_header }}
```

### Pages

There is a special type of pattern organized in the `source/patterns/pages` directory. This is intended for full, self-contained pages and will not be output with the pattern library header, footer or navigation. Otherwise, they behave and have all the capabilities of any other pattern.

## Including data

If you've mastered the basics of pattern organization, you may find instances where it would be helpful to have some placeholder or other types of data in your templates.

Global data lives in the `source/data` directory in JSON files. This data is namespaced by JSON filename (e.g. `foo.json` is available on the `foo` object) and available to all templates.

Local data is available by creating a JSON file with the same name as the pattern it's for, in the same directory. Properties from local data are available at the top level.

Local data will supersede global data in the case of a namespace conflict.

### Pre-defined Data

The following variables are available to patterns and templates:

* `{{ pathRoot }}`: is available to patterns to create a relative path to the top of the pattern library.
* `{{ dirName }}`: Name of the "page" or immediate parent directory, formatted in the same way that nav items are. Used to create page titles. Note that the top-level page is currently hard-coded to be named 'Welcome' (not 'Patterns' as it would be without hard-coding it).

### Front Matter

You can use YAML front matter in patterns. Here's what you can use and what it does:

* `name`: Override the default name for the pattern (by default, filename-derived).
* `description`: Documentation/notes to render with the template in the pattern library (TODO markdown support).
* `showSource`: Render syntax-highlighted source (default `true`). Set to `false` to hide source for a pattern.
* `showHeader`: Render the pattern's name and description (default `true`). Set to `false` to hide the name and description for a given pattern.

#### Example

```
---
name: My custom pattern name
description: This pattern does this for this reason so you want to use it in this way
---

<h1>Pattern contents...</h1>
```

YAML front matter goes at the top of `.hbs` files as in the example above.

## <del>Dangerous</del> Advanced topics

> Perhaps ye knows too much... ye've seen the cursed treasure, you know where it be hidden. Now proceed at your own risk. These be the last 'friendly' words ye'll hear. Ye may not survive to pass this way again...

### The somewhat-special "welcome" pattern

There is only one non-hidden pattern at the root level (at the start of things, anyway). This is `welcome.hbs` and by default it is set to hide its heading and source. You can use it as a place to put content you'd like to render on a landing page.

Of course, any other non-hidden patterns (`.hbs` files) you put in this directory will also render onto the landing page.

### Templating and Styling the Style Guide Itself (More Advanced)

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

###### Navigation object

The `nav` object is available to patterns but is probably most useful to templates for the pattern library. You can learn more about the structure of the object, should you need to, by perusing the `navigation.js` util building function in `build/styleGuide`. It is used heavily by the `__NAV.hbs` template.

* Each (linked/clickable) nav item has a Boolean `isCurrent` property for applying active nav classes, etc.
* There is a top-level `nav.isHome` Boolean that is `true` on the landing page only. This allows for selective styling of the `Welcome` nav item.

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
