#!/usr/bin/env node

import { directoryLister } from './wrapper.node';

const [rootDir] = process.argv.slice(2);

directoryLister({ rootDir });
