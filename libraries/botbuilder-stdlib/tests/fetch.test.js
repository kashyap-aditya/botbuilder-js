// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const assert = require('assert');
const http = require('http');
const nock = require('nock');
const sinon = require('sinon');
const { fetch } = require('../');

describe('fetch', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('nocked', () => {
        beforeEach(() => {
            nock.cleanAll();
            nock.disableNetConnect();
        });

        afterEach(() => {
            nock.cleanAll();
            nock.enableNetConnect();
        });

        it('works', async () => {
            nock('http://localhost.nock').get('/path').reply(200, { hello: 'world' });

            const resp = await fetch('http://localhost.nock/path');
            assert.strictEqual(resp.headers.get('content-type'), 'application/json');
            assert.deepStrictEqual(await resp.json(), { hello: 'world' });
        });
    });

    it('uses an http agent', async () => {
        const agent = new http.Agent();
        sandbox.mock(agent).expects('createConnection').once().callThrough();

        await assert.rejects(fetch('http://localhost.nock/path', { agent }));
        sandbox.verify();
    });
});
