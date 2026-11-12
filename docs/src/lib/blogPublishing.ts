/**
 * A blog post is published once its `publishedTime` has passed. Posts dated in
 * the future are left out of the build, so a post can be merged ahead of time
 * and appears with the first deploy after its date. The development server
 * shows every post so drafts can be reviewed locally.
 */
export const isPublished = (
  publishedTime: Date,
  now: Date = new Date(),
  showFuture = false,
): boolean => showFuture || publishedTime.getTime() <= now.getTime();
