# Simple ASP.NET Core application sample

This is a project template and experiment for a *lightweight* **ASP.NET Core Single-Page Web Applications** - that have:

- Simple hashtag client router written in TypeScript - manages URL changes in URL's after hash ('#') symbol - and displays appropriate views as any router does (see `router.ts` for more details)

- Views that are defined by **inside Razor page** (see `Pages/Index.cshtml` for examples) by custom elements with `data-route` attribute, that can be either:

## Views

### 1) Simple view:

```html
<div class="text-center" data-route="/">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>
```

Defines view on route `/` (a home view).

```html
<div data-route="/privacy">
    <p>
        Use this page to detail your site's privacy policy.
    </p>
</div>
```

Will be considered as view with route `/privacy` and so on.

Additional DOM manipulation can be achieved by using route events that occur on navigation like `onNavigate` (see `src/main.ts` for example).

### 2) Parametrized views:

```html
<div data-route="/parametrized" 
     data-route-params='{"foo": "bar", "i": 1, "b": true}'>
    This is parametrized view
</div>
```

Parametrized views have `data-route-params` attribute that contains a JSON object with parameter names and default values. 

In this example `/parametrized` route can have most 3 parameters that are passed to the view in format `/parametrized/param1/param2/param3`.

If parameter is not present, default value is used. If there is more parameters then error is raised.

Parameters can be processed on router events `onNavigate` or `onBeforeNavigate` as event parameter values. See `src/main.ts` for this example.

### 3) Servers side views, rendered by Razor engine and retrieved by REST endpoint

```html
<div data-route="/rest-template" 
     data-route-template-url="/template1/{param1}/{param2}" 
     data-route-params='{"param1": "default1", "param2": "default2"}'>
</div>
```

REST views have `data-route-template-url` attribute that contains url on the server that will return the view as plain text. 

Curly brackets will contain name of the parameters matched by name. 

If parameter is not present, default value is used. 

REST endpoint for this view:

```csharp
    [ApiController]
    public class RestApiTemplatesController : Controller
    {
        [HttpGet("template1/{param1}/{param2}")]
        public IActionResult GetTemplate1(string param1, string param2) => PartialView("/Pages/Views/_Template1.cshtml", (param1, param2));
    }
```

### 4) Servers side views, rendered by Razor engine and retrieved by **gRPC service** (7 to 10 times faster than traditional REST services)

gRPC views have `data-route-grpc-template-service` attribute that contains url on the server that will return the view as plain text:

```html
<div data-route="/grpc-template"
     data-route-grpc-template-service="/templates.GrpcTemplates/GetTemplate2"
     data-route-params='{"1": "default1", "2:Int32": 1}'>
</div>
```

Value of `data-route-grpc-template-service` attribute in following format: `/{proto package name}.{service name}/{unary rpc method name}`

Implemented service must be unary and must return replay with key 1 (first field) that contains a content of rendered template (see `GrpcTemplates.cs` for details)

To pass route parameters to your grpc service that renders your the view, use standard `data-route-params` attribute with JSON value.

JSON value of `data-route-params` attribute has following format `{"key:type" : "default value"}` where

- `key` is grpc parameter key. For example in this request message:
- `type` is grpc parameter type. For string types this is optional, it will be assumed that is type "String".

For example service request message:

```
message GetTemplate2Request {
    string param1 = 1;
    int32 param2 = 2;
}
```

Keys are `1` and `2` for `param1` and `param2`.

Types are `string` and `int32` for `param1` and `param2`.

gRPC services that are returning templates must have replay with key `1` that contains string with rendered template. Example of implementation:


```csharp
public class GrpcTemplates : Protos.GrpcTemplates.GrpcTemplatesBase
{
    private readonly RazorPartialToStringRenderer _renderer;

    public GrpcTemplates(RazorPartialToStringRenderer renderer)
    {
        _renderer = renderer;
    }

    public override async Task<GetTemplate2Reply> GetTemplate2(GetTemplate2Request request, ServerCallContext context)
    {
        return new GetTemplate2Reply
        {
            Content = await _renderer.RenderPartialToStringAsync("/Pages/Views/_Template2.cshtml", (request.Param1, request.Param2))
        };
    }
}
```

For more information see `Pages/Index.cshtml`, `Protos/templates.proto` and `Services/GrpcTemplates.cs`.

## Also features: generic gRPC web client

Simple gRPC web client component that doesn't require any creation of stub or proxy JavaScript files by external tools and can be used in similar fashion to old REST services.

Current gRPC web client implementations require that you download two separate executables that will generate appropriate service access code that you can use in your web pages. And every time your service signatures are changed, those utilities must run again to re-create your JavaScript code. (see [official pages](https://github.com/grpc/grpc-web#code-generator-plugin))

This projects features `grpc-service.ts` module that can be used to cal `grpc-web` services directly, without using any additional tools.

For example if you have following gRPC service:


```
syntax = "proto3";

package mygrpc;

service MyService {
	rpc MyMethod (MyMethodRequest) returns (MyMethodReply);
}

message MyMethodRequest {
	string name = 1;
	int32 i = 2;
}

message MyMethodReply {
	string content = 1;
	string content2 = 2;
	int32 content3 = 3;
}
```

You can use following TypeScript to issue an unary RPC call to this service:

```TypeScript
import {GrpcService, GrpcType} from "./grpc-service";

const service = new GrpcService();

const promise = service.unaryCall({
    service: "/mygrpc.MyService/MyMethod",
    request: [GrpcType.String, GrpcType.Int32],
    reply: [GrpcType.String, GrpcType.String, GrpcType.Int32]
}, "test", 9999);

promise.then(response => console.log(response));
```

- `GrpcService` constructor can have argument of object type with following optional properties:
    - `host`: url to service host, default is origin host
    - `format`: [service wire format](https://github.com/grpc/grpc-web#wire-format-mode), default is "text"
    - `suppressCorsPreflight`: default is false

- `unaryCall` receives argument parameter, followed by list of request parameter values. Argument is object type that can have following properties:
    - `service`: service name in format `/{proto package name}.{service name}/{unary rpc method name}`, required
    - `metadata`: optional metadata sent to service, default is empty object
    - `request`: array of `GrpcType` values that will set request parameter types. Parameters are matched by position in array, index 0 matches parameter with key 1, and so on. If values are not present "string" type is assumed.
    - `reply`: array of `GrpcType` values that will set reply parameter types. Parameters are matched by position in array, index 0 matches parameter with key 1, and so on. If values are not present "string" type is assumed.

Server streaming is also supported with `serverStreaming` method.  Example:

```typescript
    const stream = service.serverStreaming({
        service: "/mygrpc.MyService/StreamTest",
        request: [GrpcType.String, RequestType.Int32],
        reply: [GrpcType.String, GrpcType.GrpcType, ReplayType.Int32]
    }, "test", 9999);

    stream
        .on("error", error => console.log("error", error))
        .on("status", status => console.log("status", status))
        .on("data", data => console.log("data", data))
        .on("end", () => console.log("end"));
```

This component depends on `grpc-web` and `google-protobuf` NPM modules.

### New features

#### Support for `repeated` array messages in replay types

Declare reply as:

```
message MyMessage {
    string Message1 = 1;
	string Message2 = 2;
}

message MyReply {
	repeated MyMessage Messages = 1;
	string SomeOtherField = 2;
}
```

Fetch result as :

```TypeScript
    const result = await service.unaryCall({
        service: "/mygrpc.MyService/MyMethod",
        request: [],
        reply: [
            [GrpcType.String, GrpcType.String], GrpcType.String
        ]
    });
```

This will result in complex object:

```
{
    1: [{1: string, 2: string}, {1: string, 2: string} ...]
    2: string
}
```

#### Support for field names

In previous example reply structure is described as array of matching GRPC types. Result is object with GRPC keys as names.

Instead of array of matching GRPC types we can now pass object `{"name": GrpcType}`.

For example:

```TypeScript
    const result = await service.unaryCall({
        service: "/mygrpc.MyService/MyMethod",
        request: [],
        reply: [
            {
                messages: [{message1: GrpcType.String}, {message2: GrpcType.String}]
            }, 
            {someOtherField: GrpcType.String}
        ]
    });
```

This will result in complex object:

```
{
    messages: [{message1: string, message2: string}, {message1: string, message2: string} ...]
    someOtherField: string
}
```

which can be casted into type or interface appropriately.

#### Error handling

Module exports appropriate error object:

```TypeScript
export type GrpcError = {
    code: number;
    message: string;
    metadata: Record<string, string>;
};
```

## Build system

Frontend system does not uses `webpack`, instead it uses combination of:

- typescript for happy coding 
- browserify for module bundling
- tsify for browserify typescript support
- watchify for incemental build in watch mode (development mode)
- babel with mininimal configuration for transpilation for older browsers
- node-sass to build css

There are also dependencies for  `grpc-web` and `google-protobuf` for gRPC support.

Following NPM script are defined:

- `tsc-watch`: starts incremental build (watch mode) with `watchify` utility (that uses `browserify` bundler) and produces un-minified `wwwroot/app.js` with source maps for debugging

- `tsc-build`: Builds main bundle `wwwroot/app.js` by using `browserify` one time.

- `transpile`: Runs `babel` CLI to transpiles and minifies `wwwroot/app.js`. It will produce older, more compatible version of JavaScript and minified content will be in `wwwroot/app.min.js`. See `babel` section in `package.json` file to change transpile target.

- `scss`: Builds and minifies `scss` file from `src` dir and produces `wwwroot/site.css`

- `build-all`: Runs `tsc-build` `transpile` and `scss`. This script is also called from pre-build event.

Hosting environment:

- If application runs in `Development` configuration, index file will reference `wwwroot/app.js` (un-minified with source maps) and source files in `src` are available to the server.
- If application does not run in `Development` configuration, index file will will reference `wwwroot/app.min.js` produced by transpiler and source files in `src` are unavailable to the server.

See `Pages/Shared/_Layout.cshtml` for more details.


## Support

This is open-source software developed and maintained freely without any compensation whatsoever.

If you find it useful please consider rewarding me on my effort by [buying me a beer](https://www.paypal.me/vbsoftware/5)🍻 or [buying me a pizza](https://www.paypal.me/vbsoftware/10)🍕

Or if you prefer bitcoin:
bitcoincash:qp93skpzyxtvw3l3lqqy7egwv8zrszn3wcfygeg0mv

## Licence

Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2020
This source code is licensed under the [MIT license](https://github.com/vbilopav/SpaDotNetCoreApp/blob/master/LICENCE).
