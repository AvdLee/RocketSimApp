// FAQ answers are written in Markdown so they can link to related pages.
// Structured data wants plain text, and Markdown twins want absolute URLs.

const markdownLink = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function faqPlainText(answer: string): string {
  return answer.replace(markdownLink, "$1");
}

export function faqWithAbsoluteLinks(answer: string, baseUrl: string): string {
  return answer.replace(markdownLink, (match, text: string, href: string) =>
    href.startsWith("/") ? `[${text}](${baseUrl}${href})` : match,
  );
}
