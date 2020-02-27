#!/usr/bin/env deno --allow-write --allow-read

import { directoryLister } from './wrapper.deno.ts';

const [rootDir] = Deno.args;

directoryLister({ rootDir });
