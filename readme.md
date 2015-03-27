SaVaGe
======

_Web widgets implemented with SVG_

**SaVaGe** is a library of web widgets implemented with SVG (using _D3.js_).

Why SVG? Because using vector graphics you can easily change the size and colors of the widgets, and you don't need to include image or stylesheet files.

[See the live demos and read the documentation](http://jfmdev.github.io/SaVaGe/ "SaVaGe - Web widgets with SVG")

Usage
-----

In order to use it, you must only include the _D3.js_ and _SaVaGe_  scripts in your page.

```html
<html>
    <head>
        <script src="d3.v3.min.js" type="text/javascript"></script>
        <script src="savage.min.js" type="text/javascript"></script>
    </head>
    <body>
        <script type="text/javascript">
            // Add a toggle switch at the end of 'body'.
            SaVaGe.ToggleSwitch();
        </script>
    </body>
</html>
```

Widgets
-------

The widgets implemented (so far) are the following:

* [Toggle switch](http://jfmdev.github.io/SaVaGe/toggle-switch.html "SaVaGe - Toggle switch widget")
* [Progress pie chart](http://jfmdev.github.io/SaVaGe/docs/progress-pie-chart.html "SaVaGe - Progress pie chart widget")
* [Checkbox](http://jfmdev.github.io/SaVaGe/docs/checkbox.html "SaVaGe - Checkbox widget")

Upcoming releases may include progress bars, sliders, loaders, analog clocks and gauges, among others. _Suggestions are accepted!_

License
-------

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 3 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; If not, see <http://www.gnu.org/licenses/>.
