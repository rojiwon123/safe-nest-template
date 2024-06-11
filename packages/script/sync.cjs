'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const root_package = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'),
);

const api_path = path.resolve(__dirname, '../api/package.json');
const api_package = JSON.parse(fs.readFileSync(api_path, 'utf-8'));

api_package.version = root_package.version;

api_package['dependencies']['typia'] = root_package['dependencies']['typia'];
api_package['dependencies']['@nestia/fetcher'] =
    root_package['dependencies']['@nestia/core'];

fs.writeFileSync(api_path, JSON.stringify(api_package, null, 2), 'utf-8');
