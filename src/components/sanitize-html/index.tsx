import './style.css';

import React, { memo } from 'react';
import DOMPurify from 'dompurify';
import htmlToReact from 'html-to-react';

// import Fancybox from '../fancybox';

const defaultOptions = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'marquee', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'src'],
};

const sanitize = (dirty: string, options: Record<string, any>) =>
  DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });

type SanitizeHtmlProps = {
  as?: string;
  html: string;
  options?: Record<string, any>;
  className: string;
};

type TNode = {
  name: string;
  attribs: Record<string, any>;
};

function SanitizeHtml(props: SanitizeHtmlProps) {
  const { className, as = 'div', html, options } = props;

  const parser = htmlToReact.Parser();
  const processNodeDefinitions = htmlToReact.ProcessNodeDefinitions();

  const instructions = [
    // {
    //   shouldProcessNode: (node: TNode) => {
    //     return node.name === 'img';
    //   },
    //   processNode: (node: TNode) => {
    //     return (
    //       <Fancybox
    //         options={{
    //           Carousel: {
    //             infinite: false,
    //           },
    //         }}
    //         as={as}
    //       >
    //         <a data-fancybox='gallery' href={node.attribs.src}>
    //           {React.createElement(node.name, { ...node.attribs, className: 'sanitize-img' })}
    //         </a>
    //       </Fancybox>
    //     );
    //   },
    // },

    {
      shouldProcessNode: () => {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];

  const rawHtml = sanitize(html, options);
  const reactJSX = parser.parseWithInstructions(rawHtml, () => true, instructions);

  return React.createElement(
    as,
    {
      className,
    },
    reactJSX
  );
}

export default memo(SanitizeHtml);
