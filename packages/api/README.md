# API SDK

## Example

```ts
import sdk from "@project/api";

const response = await sdk.functional.health.check({
    host: "http://localhost:4000",
});

if (response.status !== 200)
    console.error(response.data); // error response body
else console.log(response.data); // success response body
```
