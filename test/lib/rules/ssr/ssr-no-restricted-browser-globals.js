/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../../shared');

// TODO: Type assertions break this rule

testRule('ssr/ssr-no-restricted-browser-globals', {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    window.foo = true;
                  }
                  bar() {
                    this.template.classList.add('foo');
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
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    window.foo = true;
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
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(window);
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
                    // we can't use window here
                  }
                  bar() {
                    doSomething(window);
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    notInvokedDuringSSR();
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    notInvokedDuringSSR();
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
                    window.x = 1;
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
                  if(typeof window !== 'undefined') {
                    window.x = 1;
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
                  if(!import.meta.env.SSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        { code: `const f = new Foo();`, filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js' },
        { code: `const name = new Foo();`, filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js' },
        {
            code: `
              let screen = 'mobile';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  let name = "hello";
                  screen;
                }
              }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              let name;
              let screen = 'mobile';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  name = "hello";
                  screen;
                }
              }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { name } from 'some/component';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  name();
                }
              }
          `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `btoa('lwc');`,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `document`,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
            options: [{ 'restricted-globals': { document: false } }],
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = globalThis.document?.x;
            }
          `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              constructor() {
                console.log(globalThis.document?.x);
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
                  globalThis.document?.addEventListener('click', () => {});
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
                  globalThis.addEventListener?.('click', () => {});
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
                    doSomethingWith(globalThis);
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
                    const list = [globalThis.DOMException];
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    return globalThis.location?.href;
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    return !import.meta.env.SSR ? globalThis.location.href : null;
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    if (!import.meta.env.SSR) {
                      return globalThis.location.href;
                    }
                    return null;
                  }
                }
            `,
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
    invalid: [
        {
            code: `sample`,
            options: [{ 'restricted-globals': { sample: true } }],
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                document.futzAround();
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                {
                  document.futzAround();
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                for (const thing of things) {
                  document.futzAround(thing);
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function writer() {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                const writer = function() {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                const writer = () => {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    window.foo = true;
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'foo' },
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
                    window.bar = true;
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'bar' },
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
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'window' },
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
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'window' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },

        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!import.meta.env.notSSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!import.meta.notenv.SSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!notimport.meta.env.SSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
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
                console.log(window.x);
              }
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = window.x;
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = globalThis.document.x;
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              constructor() {
                console.log(globalThis.document.x);
              }
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                url = window.location.href;
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                url = window.location?.href;
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                constructor() {
                  window.location.href = '/path';
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  document.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  document?.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.document.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'addEventListener' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'addEventListener' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  name = 'hello';
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'name' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'location' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return window.location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return globalThis.location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                function utility() {
                  window.fuzzAround();
                }

                export default class Foo {
                  bar() {
                    utility();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'fuzzAround' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `addEventListener('resize', () => {});`,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'addEventListener' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                function utility() {
                    console.log(window.x);
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                function getAttributes(element) {
                    if (element instanceof Element) {
                        return element.getAttributeNames();
                    }
                    return [];
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Element' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                function getAttributes(element) {
                    return element instanceof Element ? element.getAttributeNames() : [];
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Element' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
        {
            code: `
                function getJson(response) {
                    if (response instanceof Response) {
                        return response.json();
                    }
                    return Promise.resolve();
                }
            `,
            options: [{ 'restricted-globals': { Response: true } }],
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Response' },
                },
            ],
            filename: 'test/lib/rules/ssr/fixtures/cmp-ssr/cmp.js',
        },
    ],
});
