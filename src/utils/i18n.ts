export const t = (content: any, lang: string) => {
  if (!content) return "";
  if (typeof content === 'object' && content !== null) {
    return content[lang] || content.EN || "";
  }
  return content;
};
