import { getCollection } from "astro:content";

import { isPublished } from "./blogPublishing";

/** All blog posts whose `publishedTime` has passed (every post in dev). */
export const getPublishedPosts = () =>
  getCollection("blog", ({ data }) =>
    isPublished(data.publishedTime, new Date(), import.meta.env.DEV),
  );
