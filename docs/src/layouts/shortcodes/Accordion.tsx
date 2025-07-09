import React, { useState } from "react";

const Accordion = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [show, setShow] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(show ? "auto" : "0px");

  React.useEffect(() => {
    if (show) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [show]);

  return (
    <div className={`accordion  ${className}`}>
      <button className="accordion-header" onClick={() => setShow(!show)}>
        {title}

        <div className="inline-block accordion-icon">
          <svg
            className={` transition-transform duration-500 ${show ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              className={`transition-opacity duration-500 ${show ? "opacity-0" : "opacity-100"}`}
            ></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </button>
      <div ref={contentRef} style={{ height, overflow: "hidden", transition: "height 0.5s ease" }}>
        {show && <div className={show ? "accordion-content [&_*]:text-base [&_*]:m-0" : "mt-0"}>{children}</div>}
      </div>
    </div>
  );
};

export default Accordion;
