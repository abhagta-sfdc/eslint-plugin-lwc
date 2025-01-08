/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../../shared');

// TODO: Type assertions break this rule

testRule('ssr/ssr-no-unsupported-properties', {
    valid: [
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              connectedCallback() {
                this.childNodes.item(0).textContent = 'foo';
              }
            }
        `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-non-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.querySelector here
                  }
                  renderedCallback() {
                    this.querySelector('span')?.foo();
                  }
                  bar() {
                    this.querySelector('span')?.foo();
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
                    // we can't use this.querySelector here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    this.querySelector('span')?.foo();
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
                    // we can't use this.lastChild here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(this.lastChild);
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
                    // we can't use this.ownerDocument here
                  }
                  bar() {
                    doSomething(this.ownerDocument);
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if(typeof document !== 'undefined') {
                      doSomething(this.lastElementChild);
                    }
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if (!import.meta.env.SSR) {
                      this.querySelector('span').getAttribute('role');
                    }
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
                    this.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    this.querySelectorAll('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    doSomethingWith(this.lastChild);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    doSomethingWith(this.dispatchEvent);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    doSomethingWith(this.getBoundingClientRect);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                  doSomethingWith(this.querySelector);
                }
              }
          `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                renderedCallbac() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(this.querySelectorAll);
                }
              }
          `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.getAttribute('role');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.firstElementChild?.id;
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').getAttribute('role');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').getAttribute?.('role').startsWith('button');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.children?.item?.(0);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.childNodes.item(0).textContent = 'foo';
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
});
