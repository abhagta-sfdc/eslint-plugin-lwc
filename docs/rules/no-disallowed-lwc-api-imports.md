## Prevent importing restricted APIs from the "lwc" package (no-disallowed-lwc-api-imports)

Restricts importing disallowed modules from the `lwc` package. It's recommended to only use the "safe" APIs allowed by this rule.

### Rule details

Examples of **incorrect** code:

```js
import { SuperSecretApiYouShouldNotUse } from 'lwc';
```

```js
import * as lwc from 'lwc';
```

Example of **correct** code:

```js
import { LightningElement } from 'lwc';
```

If you disable this rule, then you may import unstable or otherwise undesirable APIs from `lwc`.
