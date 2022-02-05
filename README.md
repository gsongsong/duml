# duml

UML using [D3.js][d3]

- [Motivations & Features](#motivations--features)
- [Usage](#usage)
  - [Class diagram](#class-diagram)
- [API](#api)
  - [`ClassDiagram(d3, data[, options])`](#classdiagramd3-data-options)
- [Limitations & To-dos](#limitations--to-dos)

## Motivations & Features

The existing UML software have two problems:
- Text based UML, e.g. [PlantUML][plantuml], is developer-friendly since UML can be defined programatically and it can be managed via source control software. When it comes to visualization, 
- Graphic based UML, e.g. [diagrams.net][diagrams], is very convenient to define UML by drag-and-drop and connecting entities on graphical area. When it comes to manageability, however, it is difficult to track changes from version to version since UML definition is mixed with visual attributes (color, position, shape, size and others)

*duml* is being developed with the following objectives:

- To be able to define UML programtically
- To be able to manage UML via source control
- To focus on UML itself and not to concern about visualization

## Usage

Copy [`dist/index.js`][src] and write code as demos describe

### Class diagram

[Demo]

## API

### `ClassDiagram(d3, data[, options])`

Takes definitions of classes and associations and returns a rendered SVG element

**Parameters:**

- `d3`: d3 namespace
- `data`: an object containing the following:
  - `classes`: a list of classes, each of which is characterized by `Class`
  - `associations`: a list of associations, each of which is characterized by `Association`
- `options`: an object possibly containing the following:
  - `width`: the width of an SVG element. default: `600`
  - `height`: the height of an SVG element. default: `600`
  - `vw`: the width of a view box. the view box will show `-vw/2` to `vw/2`. default: `600`
  - `vh`: the height of a view box. the view box will show `-vh/2` to `vh/2`. default: `600`
  - `force`: repulsion force to each other node.  
    The smaller value (towards negative infinity), the stronger repulsion force. default: `-400`

**Types**

- `Class`: an object containing the following:
  - `name`: a name of a class. a class name must be unique
  - `attributes`: a list of attributes, each of which is characterized as `Attribute`
- `Associations`: an object containing the following:
  - `name`: a name of an association. an association name must be unique  
    A combination of `source`, `name` and `target` must be unique
  - `source`: a name of a class which is a source of a association
  - `target`: a name of a class which is a target of a association
  - `attributes`: a list of attributes, each of which is characterized as `Attribute`
- `Attribute`: an object containing the following:
  - `visibility`: `'public'` or `'private'`
  - `name`: a name of an attribute
  - `type`: a data type of an attribute

**Returns:**

It returns an SVG element which can be appended as child to an element

## Limitations & To-dos

- [ ] Only class diagram is supported
- [ ] Collision handling must be improved
- [ ] Drawing edge and arrow must be improved
- [ ] Multiplicity must be supported
- [ ] Highlight hovered and associated entities shall be supported
- [ ] A class name and an association name must not contain whitespace. The root cause has not been identified

[d3]: https://d3js.org
[plantuml]: https://plantuml.com
[diagrams]: https://www.diagrams.net
[src]: ./dist/index.js
[demo]: https://codesandbox.io/s/duml-09smg?file=/index.html
