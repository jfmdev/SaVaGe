SaVaGe
======

_Web widgets implemented with SVG_

**SaVaGe** is a library of web widgets implemented with SVG (using _D3.js_).

Why SVG? Because using vector graphics you can: easily change the size and colors of the widgets, and you don't need to include image or stylesheet files.

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
            SaVaGe.ToggleSwitch();
        </script>
    </body>
</html>
```

License
-------

SaVaGe is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SaVaGe is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with TelemarketingLogs. If not, see <http://www.gnu.org/licenses/>.