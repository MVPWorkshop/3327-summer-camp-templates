# Route definition declarations guide

In order to better and/or more strictly type the codebase, every new route
will have to follow these rules:

1. Every route in /routes folder should have corresponding file inside /definitions
named the same only with .d (definitions) before the .ts file type ending

2. Inside the routes definitions file, there should be a namespace named the
same as the class inside the routes folder which is being typed. The same
namespace is the default export of that file.
There should also be an enum in which every route/method is defined

3. Every namespace should implement next generics:
    + `ResponseBody<T extends ENameOfTheRoute>` - Returns specified routes response body
    + `RequestBody<T extends ENameOfTheRoute>` - Returns specified routes request body
    + `RequestQueries<T extends ENameOfTheRoute>` - Returns specified routes query params
    + `RequestParams<T extends ENameOfTheRoute>` - Returns specified routes request params
    + `Response<T extends ENameOfTheRoute>` - Returns expressjs response object
    + `Request<T extends ENameOfTheRoute>` - Returns expressjs request object
    + `RouteMethod<T extends ENameOfTheRoute>` - Returns typization for next function
   
   Every generic should return default empty object if route wasn't implemented

4. The naming convention is PascalCase/UpperCamelCase and it should look something like this:
    - For namespace name
        + `{ROUTE_NAME}Definitions` - AuthRouteDefinitions
    - For enum name
        + `E{ROUTE_NAME}` - EAuthRoute
    - For enum values
        + `{HTTP_METHOD}{ROUTE_NAME}` - GetMe or PostAuthGithub
