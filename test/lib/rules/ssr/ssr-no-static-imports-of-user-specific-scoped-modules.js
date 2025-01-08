/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../../shared');

testRule('ssr/ssr-no-static-imports-of-user-specific-scoped-modules', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
    invalid: [
        {
            code: `
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user-specific scoped modules is not allowed in SSR-able components. The recommended declarative solution is to use a data provider to fetch this information.',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
});

testTypeScript('ssr/ssr-no-static-imports-of-user-specific-scoped-modules', {
    valid: [
        {
            code: `
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-non-ssr/cmp.js',
        },
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
    invalid: [
        {
            code: `
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user-specific scoped modules is not allowed in SSR-able components. The recommended declarative solution is to use a data provider to fetch this information.',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
});
