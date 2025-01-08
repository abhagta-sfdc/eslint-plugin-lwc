/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../../shared');

// TODO: Type assertions break this rule

testRule('ssr/ssr-no-node-env', {
    valid: [
        {
            code: `
        import { LightningElement } from 'lwc';
        import tmplA from './a.html';

        export default class Foo extends LightningElement {
          foo = process.env.NODE_ENV;              
        }
    `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-non-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  renderedCallback() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                  bar() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  bar() {
                    doSomething(process.emv.NODE_ENV);
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(process.env.NODE_ENV);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  renderedCallback() {
                    this.foo();
                  }
                  foo() {
                    doSomethingWith(process.env.NODE_ENV);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';
              import tmplA from './a.html';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  this.foo();
                }
                renderedCallback() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(process.env.NODE_ENV);
                }
              }
          `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';
              import tmplA from './a.html';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  this.foo();
                }
                renderedCallback() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(process.env.NODE_ENV);
                }
              }
          `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';
            import tmplA from './a.html';

            export default class Foo extends LightningElement {
              constructor() {
                if (process.env.NODE_ENV === 'development') {
                  console.log('test');
                }
              }
            }
        `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';
            import tmplA from './a.html';

            export default class Foo extends LightningElement {
              constructor() {
                this.foo();
              }
              foo() {
                doSomethingWith(process.env.NODE_ENV);
              }
            }
        `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';
            import tmplA from './a.html';

            export default class Foo extends LightningElement {
              foo = process.env.NODE_ENV;              
            }
        `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
});
