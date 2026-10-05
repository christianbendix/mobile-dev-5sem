import { pb } from '../client';
import type { FileUrlResolver } from './records';

/** Absolute URL of a file stored on a record (pb.files.getURL). */
export const fileUrl: FileUrlResolver = (owner, filename) => pb.files.getURL(owner, filename);
