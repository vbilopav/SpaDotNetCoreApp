# Simple AS.NET Core application sample

This is a project template for applications that are using:

- Razor pages
- Simple hashtag router
- Typescript
- Optional server rendering by Razor engine

Also features:

- Bootstrap 4.5.0 - from CDN with local fallback
- SystemJS 6.2.3 module loader for TypeScript modules - from CDN with local fallback

Client-side local libraries (bootstrap css and SystemJS for local fallbacks) are restored and maintained by Visual Studio Library Manager (see `libman.json` file).

NPM `package.json` only defines dependencies for node tools needed for the build process. It has several scripts needed for the build process that you may use manually or with NPM script tools or any other task runner Scripts are:

- `tsc-watch`: Runs TypeScript compilation in watch mode (see `tsconfig.json`). All compiled modules will be bundled into single file: `wwwroot/app.js`. Compile target is newest JavaScript, followed by `.map` file for convenient debugging.
- `tsc-build`: Runs TypeScript compilation without watching for changes and produces `wwwroot/app.js`.
- `transpile`: Runs `babel` CLI to transpile and minify `wwwroot/app.js`. It will produce older, more compatible version of JavaScript and minified content will be in `wwwroot/app.min.js`. See `babel` section in `package.json` file to change transpile target.
- `scss`: Builds and minifies `scss` file from `src` dir and produces `wwwroot/site.css`
- `build-all`: Runs `tsc-build` `transpile` and `scss`. This script is also called from pre-build event.

Hosting environment:

- If application runs in `Development` configuration, index file will reference `wwwroot/app.js` which is followed by `wwwroot/app.js.map` for convenient debugging.
- If application does not run in `Development` configuration, index file will will reference `wwwroot/app.min.js` produced by transpiler.

See `Pages/Shared/_Layout.cshtml` for more details.

This application template also features simple hash-based view router component, see `src/router.ts` for implementation details. 

Views are defined inside page elements by using `data-route` attribute. All elements with `data-route` attribute will be considered as view by the router and hidden initially. For example:

```html
<div class="text-center" data-route="/">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>
```

will be considered as "home view" with route `/`.

```html
<div data-route="/privacy">
    <p>
        Use this page to detail your site's privacy policy.
    </p>
</div>
```

will be considered as view with route `/privacy` and so on.

For convenience, in this template app, all views are inside `Pages/Views/` dir as partial views. See index page at `Pages/Index.cshtml` for more details.

Views can also be parametrized, for example 

```html
<div data-route="/parametrized" 
     data-route-params='{"foo": "bar", "i": 1, "b": true}'>
    This is parametrized view
</div>
```

- Parametrized views have `data-route-params` attribute that contains a JSON object with parameter names and default values. 

- In this example `/parametrized` route can have most 3 parameters that are passed to the view in format `/parametrized/param1/param2/param3`.

- If parameter is not present, default value is used. If there is more parameters then error is raised.

- Parameters can be processed on router events `onNavigate` or `onBeforeNavigate` as event parameter values. See `src/main.ts` for this example.

View also can be rendered on server and returned to the router that will display it as any other view. For example route:

```html
<div data-route="/rest-template" 
     data-route-template-url="/template1/{param1}/{param2}" 
     data-route-params='{"param1": "default1", "param2": "default2"}'>
</div>
```

have `data-route-template-url` attribute that contains url on the server that will return the view as plain text. Curly brackets will contain name of the parameters matched by name. If parameter is not present, default value is used. For this example we must also implement this URL on the server:

```csharp
    [ApiController]
    public class RestApiTemplatesController : Controller
    {
        [HttpGet("template1/{param1}/{param2}")]
        public IActionResult GetTemplate1(string param1, string param2) => PartialView("/Pages/Views/_Template1.cshtml", (param1, param2));
    }
```

This view is implemented as partial view that receives parameters from the client router and can optionally talk with databases and implement complex rendering logic.

Also, if you need more search engine visibility and want to implement traditional routing without hashtag, this partial view can be called from normal Razor page.

## Support

This is open-source software developed and maintained freely without any compensation whatsoever.

If you find it useful please consider rewarding me on my effort by [buying me a beer](https://www.paypal.me/vbsoftware/5)🍻 or [buying me a pizza](https://www.paypal.me/vbsoftware/10)🍕

Or if you prefer bitcoin:
bitcoincash:qp93skpzyxtvw3l3lqqy7egwv8zrszn3wcfygeg0mv

## Licence

Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2020
This source code is licensed under the [MIT license](https://github.com/vbilopav/SpaDotNetCoreApp/blob/master/LICENCE).
