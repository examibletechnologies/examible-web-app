import React, { Suspense, lazy } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

// Lazy load react-markdown and plugins to reduce initial bundle size
// Markdown is only used when AI responses are displayed
const ReactMarkdown = lazy(() => import("react-markdown"));

const FormattedResponse = ({ response }) => {
  const lineBreakRes = response?.split("\n");

  return (
    <div>
      {lineBreakRes.map((item, index) => (
        <div key={index}>
          {item === "" ? (
            <br />
          ) : (
            <div key={index} className="chat-markdown">
              <Suspense
                fallback={<div style={{ padding: "10px" }}>Loading...</div>}
              >
                <ReactMarkdown
                  remarkPlugins={[
                    require("remark-gfm"),
                    require("remark-math"),
                  ]}
                  rehypePlugins={[
                    require("rehype-sanitize"),
                    require("rehype-katex"),
                  ]}
                  components={{
                    code({ children, ...props }) {
                      return (
                        <code {...props}>
                          <Latex>{children}</Latex>
                        </code>
                      );
                    },
                  }}
                >
                  {item}
                </ReactMarkdown>
              </Suspense>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormattedResponse;
