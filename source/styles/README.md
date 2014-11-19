# CSS Guidelines

## Syntax

Based on [codeguide.co](http://codeguide.co/#css), but with adjustments for this project and team:

* Use soft tabs with two spaces (everything else can look gnarly in web interfaces, such as GitHub).
* When grouping selectors, keep individual selectors to a single line.
* Include one space before the opening brace of declaration blocks for legibility.
* Place closing braces of declaration blocks on a new line.
* Include one space after `:` for each declaration.
* Each declaration should appear on its own line.
* End all declarations with a semi-colon.
* Comma-separated property values should include a space after each comma (e.g., `box-shadow`).
* Don't include spaces after commas within `rgb()`, `rgba()`, `hsl()`, `hsla()`, or `rect()` values. This helps differentiate multiple color values (comma, no space) from multiple property values (comma with space).
* Avoid specifying units for zero values, e.g., `margin: 0;` instead of `margin: 0px;`.
* In most cases, you should order your declarations alphabetically.

If you have questions about the terms used here, check out the [syntax section of the Cascading Style Sheets article](http://en.wikipedia.org/wiki/Cascading_Style_Sheets#Syntax) on Wikipedia.

## Specificity

From Harry Roberts' [cssguidelin.es](http://cssguidelin.es/#specificity):

> The problem with specificity isn’t necessarily that it’s high or low; it’s the fact it is so variant and that it cannot be opted out of: the only way to deal with it is to get progressively more specific—the notorious specificity wars we looked at above.
>
> One of the single, simplest tips for an easier life when writing CSS—particularly at any reasonable scale—is to keep always try and keep specificity as low as possible at all times. Try to make sure there isn’t a lot of variance between selectors in your codebase, and that all selectors strive for as low a specificity as possible.
>
> Doing so will instantly help you tame and manage your project, meaning that no overly-specific selectors are likely to impact or affect anything of a lower specificity elsewhere. It also means you’re less likely to need to fight your way out of specificity corners, and you’ll probably also be writing much smaller stylesheets.
>
> Simple changes to the way we work include, but are not limited to,
>
> 1. not using IDs in your CSS;
> 1. not nesting selectors;
> 1. not qualifying classes;
> 1. not chaining selectors.
>
> **Specificity can be wrangled and understood, but it is safer just to avoid it entirely.**

Avoiding specificity makes our styles more maintainable over time, while also promoting reusability.

When building patterns, see if it's possible to define a simple, design-free object that can be _built upon_ with additional classes.

```css
/* Bad CSS */
.product > button#add-to-cart {
  background-color: #ff4136;
  color: #fff;
  display: inline-block;
  font-weight: bold;
  padding: 1em 2em;
}

/* Good CSS */
.btn {
  display: inline-block;
  font-weight: bold;
  padding: 1em 2em;
}
.btn-primary {
  background-color: #ff4136;
  color: #fff;
}
```

Further reading:
* [When using IDs can be a pain in the class...](http://csswizardry.com/2011/09/when-using-ids-can-be-a-pain-in-the-class/)
* [The Specificity Graph](http://csswizardry.com/2014/10/the-specificity-graph/)

## Browser compatibility

Browser-specific mixins are difficult to maintain over time, so this project uses [Autoprefixer](https://github.com/postcss/autoprefixer) to magically insert any required vendor prefixes to CSS rules _after_ our styles are compiled based on a configuration file detailing our target browsers. Because of this, you should avoid including vendor prefixes or browser-centric fixes in your code as much as possible.

```scss
/* Bad: Unnecessary duplication */
.example {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}

/* Bad: Non-standard, difficult-to-maintain mixin */
.example {
  @include display-flex;
}

/* Good: Standard syntax */
.example {
  display: flex;
}
```

## Organization

The `source/styles` directory is organized like so:

* `base/`: Variables, mixins and other things that should be included before anything else.
  * `_variables.scss`: Colors, type, Bootstrap settings and other important variables.
* `elements/`: The basic reusable building blocks of the site. Buttons, forms, icons, typography, etc.
* `components/`: More complex (but still reusable) patterns, usually made up of at least one or two elements themselves.
* `vendor/`: Any styles written by a third party, imported as-needed into our project.
  * `_bootstrap-custom.scss`: Controls which portions of Bootstrap we do or do not include.
* `patterns.scss`: Styles specifically for the pattern library. (You shouldn't need to edit this too often.)
* `styles.scss`: The "master" stylesheet that includes everything else and is compiled.

We may need to create additional directories for things like "regions" or "pages," but for now this should be enough for us to get started.

## Bootstrap

As mentioned previously, we are including certain portions of [Bootstrap](http://getbootstrap.com/) on a case-by-case basis, especially for core things like grids, forms and buttons that can be needlessly complex to develop from scratch.

Please use Bootstrap's class-naming conventions as a frame of reference when naming your own patterns and variables.

If you think the project would benefit from including another portion of the framework, please speak up!
