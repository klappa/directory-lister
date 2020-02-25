#!/usr/bin/env node

import { createDirListing } from './index';

const [rootDir] = process.argv.slice(2);

createDirListing({ rootDir });
