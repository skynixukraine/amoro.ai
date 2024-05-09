import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { generateEmailDesigns } from "@/services/openaiService";

type DesignSelectionProps = {
  onBack: () => void;
  onNext: () => void;
  onSaveHtml: (html: string) => void;
  htmlEmailContent: string; // The HTML email content to generate designs from
};

const DesignSelection: React.FC<DesignSelectionProps> = ({
  onBack,
  onNext,
  onSaveHtml,
  htmlEmailContent,
}) => {
  const [designs, setDesigns] = useState<string[]>([]);

  useEffect(() => {
    // Generate designs on mount
    const fetchDesigns = async () => {
      //const { designs } = await generateEmailDesigns(htmlEmailContent);
      //setDesigns(designs);
    };
    //fetchDesigns();
  }, [htmlEmailContent]);

  return (
    <div>
      <h1>Design Selection</h1>
      {designs.length === 0 && <p>Loading designs...</p>}
      {designs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {designs.map((design, index) => (
            <iframe
              key={index}
              srcDoc={design}
              style={{ width: "50%", height: "50vh", border: "none" }}
            />
          ))}
        </div>
      )}
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  );
};

export default DesignSelection;
