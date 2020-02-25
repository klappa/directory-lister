#!/usr/bin/env deno --allow-write --allow-read

import { createDirListing } from './index.ts';

const [rootDir] = Deno.args;


createDirListing({ rootDir });
