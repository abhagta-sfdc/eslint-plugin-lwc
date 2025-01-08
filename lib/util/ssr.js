/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const metaCache = new Map();
const SSR_CAPABILITIES = [
    'lightning__ServerRenderable',
    'lightning__ServerRenderableWithHydration',
];

module.exports.isSSREscape = function isSSREscape(node) {
    if (
        (node.type === 'IfStatement' || node.type === 'ConditionalExpression') &&
        checkConditionalStatements(node.test)
    ) {
        return true;
    }

    return false;
};

function checkConditionalStatements(test) {
    let node = test;

    // Base Case: If the node is a `!` UnaryExpression, call isMetaEnvCheck().
    if (node.type === 'UnaryExpression' && node.operator === '!') {
        return isMetaEnvCheck(node);
    }

    // Base Case: If the node is a `!==` BinaryExpresion, call isWindowOrDocumentCheck().
    if (node.type === 'BinaryExpression' && node.operator === '!==') {
        return isWindowOrDocumentCheck(node);
    }

    // Recursive Case: If the node is a `&&` logical expression, check its left and right parts.
    if (node.type === 'LogicalExpression' && node.operator === '&&') {
        const rightNodeConditional = checkConditionalStatements(node.right);
        return rightNodeConditional || checkConditionalStatements(node.left);
    }

    return false;
}

function isMetaEnvCheck(test) {
    let node = test;
    if (!(node.type === 'UnaryExpression' && node.operator === '!')) return false;

    node = node.argument;
    if (
        !(
            node.type === 'MemberExpression' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'SSR'
        )
    )
        return false;

    node = node.object;
    if (
        !(
            node.type === 'MemberExpression' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'env'
        )
    )
        return false;

    node = node.object; // .meta is not a MemberExpression, it's a MetaProperty in eslint
    if (
        !(
            node.type === 'MetaProperty' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'meta'
        )
    )
        return false;

    node = node.meta;
    return node.type && node.name === 'import';
}

function isWindowOrDocumentCheck(node) {
    return (
        node.type === 'BinaryExpression' &&
        node.left.type === 'UnaryExpression' &&
        node.left.operator === 'typeof' &&
        node.left.argument.type === 'Identifier' &&
        (node.left.argument.name === 'document' || node.left.argument.name === 'window')
    );
}

function getLastXMLFileInDirectory(dir) {
    const xmlFiles = fs
        .readdirSync(dir)
        .filter((file) => /\.xml$/i.test(file))
        .sort((a, b) => b.localeCompare(a));

    return xmlFiles.length ? path.join(dir, xmlFiles[0]) : null;
}

module.exports.isSSRCapable = function isSSRCapable(dir) {
    if (metaCache.has(dir)) {
        return metaCache.get(dir);
    }

    const xmlFile = getLastXMLFileInDirectory(dir);
    if (!xmlFile) {
        metaCache.set(dir, false);
        return false;
    }

    const content = fs.readFileSync(xmlFile, 'utf8');
    const parser = new XMLParser({
        isArray: (_name, jPath) => jPath === 'LightningComponentBundle.capabilities',
    });

    const xmlRoot = parser.parse(content);
    const bundle = xmlRoot.LightningComponentBundle;

    const hasSSRCapabilities =
        bundle && bundle.capabilities
            ? bundle.capabilities.some((capabilityObj) =>
                  Array.isArray(capabilityObj.capability)
                      ? capabilityObj.capability.some((cap) => SSR_CAPABILITIES.includes(cap))
                      : SSR_CAPABILITIES.includes(capabilityObj.capability),
              )
            : false;

    metaCache.set(dir, hasSSRCapabilities);
    return hasSSRCapabilities;
};
