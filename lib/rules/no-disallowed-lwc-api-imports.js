/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const LWC_SUPPORTED_APIS = new Set([
    // Common APIs
    'LightningElement',
    'api',
    'track',
    'wire',

    // From "@lwc/engine-core"
    'getComponentDef',
    'getComponentConstructor',
    'isComponentConstructor',
    'createContextProvider',
    'readonly',
    'register',
    'setFeatureFlagForTest',
    'unwrap',

    // From "@lwc/engine-dom"
    'hydrateComponent',
    'buildCustomElementConstructor',
    'createElement',

    // From "@lwc/engine-server"
    'renderComponent',
]);

module.exports = {
    meta: {
        docs: {
            description: 'restrict unexpected imports from the lwc package',
            category: 'LWC',
            url: docUrl('no-disallowed-lwc-api-imports'),
        },

        schema: [],
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.type === 'Literal' && node.source.value === 'lwc') {
                    for (const specifier of node.specifiers) {
                        if (specifier.type === 'ImportNamespaceSpecifier') {
                            context.report({
                                message: `Invalid import. Namespace imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                                node: specifier,
                            });
                        } else if (!LWC_SUPPORTED_APIS.has(specifier.imported.name)) {
                            context.report({
                                message: `Invalid import. ${specifier.imported.name} is not part of the lwc api.`,
                                node: specifier,
                            });
                        }
                    }
                }
            },
        };
    },
};
