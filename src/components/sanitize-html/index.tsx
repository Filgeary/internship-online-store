import React, { memo } from 'react';
import DOMPurify from 'dompurify';

const defaultOptions = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'marquee', 'a'],
  ALLOWED_ATTR: ['href'],
};

const sanitize = (dirty: string, options: Record<string, any>) =>
  DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });

type SanitizeHtmlProps = {
  as?: string;
  html: string;
  options?: Record<string, any>;
  className: string;
};

function SanitizeHtml(props: SanitizeHtmlProps) {
  const { className, as = 'div', html, options } = props;

  return React.createElement(as, {
    dangerouslySetInnerHTML: { __html: sanitize(html, options) },
    className,
  });
}

export default memo(SanitizeHtml);
