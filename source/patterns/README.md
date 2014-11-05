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

#### Front Matter

You can use YAML front matter in patterns. Supported currently:

* `name`: Override the default name for the pattern (filename-derived).
* `description`: Documentation/notes to render with the template in the pattern library (TODO markdown support).
* `showSource`: Render syntax-highlighted source (default `true`).
* `showHeader`: Render the pattern's name and description (default `true`).

### Templates
