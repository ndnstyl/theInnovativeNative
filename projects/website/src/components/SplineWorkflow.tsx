import { useCallback, useRef, useState } from "react";

// ── Node data for the THT pipeline ──────────────────────────────────────────
export interface WorkflowNode {
  id: string;
  splineName: string; // object name in the Spline scene
  label: string;
  subtitle: string;
  description: string;
  tech: string[];
  inputs: string[];
  outputs: string[];
  color: string;
}

export interface WorkflowConfig {
  title: string;
  subtitle: string;
  sceneUrl: string;
  nodes: WorkflowNode[];
}

// ── THT Pipeline Config ─────────────────────────────────────────────────────
export const THT_PIPELINE: WorkflowConfig = {
  title: "Tiny Home Timelapse Pipeline",
  subtitle:
    "From a single canon photo to a branded construction timelapse — fully automated",
  sceneUrl:
    "https://prod.spline.design/jvhlvCDxA8Z1Gdgd/scene.splinecode",
  nodes: [
    {
      id: "router",
      splineName: "Node_Router",
      label: "Router",
      subtitle: "WF-THT-ROUTER",
      description:
        "The dispatcher. Receives action triggers from Airtable, validates project status, and routes to the correct downstream workflow. Handles 6 action types: Canon Upload, Prompts, Stage 1-4 Image, Video 1-4, Regen, and Reel Assembly.",
      tech: ["n8n Webhook", "Airtable API", "Switch Node"],
      inputs: ["Airtable Run Action dropdown"],
      outputs: [
        "Routes to Prompt, Image, Video, or Reel workflow",
      ],
      color: "#D4956A",
    },
    {
      id: "prompt",
      splineName: "Node_Prompt",
      label: "Prompt Generator",
      subtitle: "WF-THT-PROMPT",
      description:
        "Generates 8 phase-specific prompts using Groq LLM. Each prompt describes a construction stage from foundation to move-in ready. For real estate industry, prompts switch to room-type staging language with compliance tags.",
      tech: ["Groq LLM", "n8n Code Node", "Airtable API"],
      inputs: ["Project record with canon photo"],
      outputs: [
        "8 prompts stored in Prompt Tracking table",
        "Status → prompts_approved",
      ],
      color: "#6AB4D4",
    },
    {
      id: "image",
      splineName: "Node_Image",
      label: "Image Generator",
      subtitle: "WF-THT-IMAGE",
      description:
        "Runs Flux 2 Pro img2img generation in 4 stages, chaining from the canon photo through 8 construction phases. Each stage generates 2-3 images with quality scoring. Failed generations get auto-regenerated.",
      tech: ["Kie.AI (Flux 2 Pro)", "Callback Webhooks", "Google Drive API"],
      inputs: ["Prompts + canon reference photo"],
      outputs: [
        "8 AI-generated construction phase images",
        "Stored in Google Drive",
      ],
      color: "#6AD4A0",
    },
    {
      id: "video",
      splineName: "Node_Video",
      label: "Video Generator",
      subtitle: "WF-THT-VIDEO",
      description:
        "Creates Veo 3.1 generative video by interpolating between consecutive phase images. First and last frames define the motion — Veo generates the in-between frames with actual camera movement, not Ken Burns zoom.",
      tech: [
        "Kie.AI (Veo 3.1)",
        "First+Last Frame Interpolation",
        "Callback Webhooks",
      ],
      inputs: ["Phase image pairs (first + last frame)"],
      outputs: [
        "4 video clips (one per stage)",
        "True generative motion",
      ],
      color: "#B46AD4",
    },
    {
      id: "reel",
      splineName: "Node_Reel",
      label: "Reel Assembler",
      subtitle: "WF-THT-REEL",
      description:
        "FFMPEG stitches 4 video clips with crossfade transitions, adds music, and overlays branding. For real estate: agent logo, brokerage name, MLS number, and AI disclosure badge. Exports platform-optimized formats.",
      tech: ["FFMPEG", "n8n Code Node", "Google Drive API"],
      inputs: ["4 video clips + branding config + music selection"],
      outputs: [
        "Branded timelapse reel (MP4)",
        "Instagram/TikTok/YouTube/MLS exports",
      ],
      color: "#D46A6A",
    },
  ],
};

// ── Component ───────────────────────────────────────────────────────────────

interface SplineWorkflowProps {
  config?: WorkflowConfig;
}

export default function SplineWorkflow({
  config = THT_PIPELINE,
}: SplineWorkflowProps) {
  const [activeNode, setActiveNode] = useState<WorkflowNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Derive the iframe embed URL from the scene URL
  // prod.spline.design/XXXX/scene.splinecode → my.spline.design/XXXX/
  const embedUrl = config.sceneUrl
    .replace("prod.spline.design", "my.spline.design")
    .replace("/scene.splinecode", "/");

  const selectNode = (node: WorkflowNode) => {
    setActiveNode((prev) => (prev?.id === node.id ? null : node));
  };

  return (
    <section className="spline-workflow">
      <div className="spline-workflow__header">
        <h2 className="spline-workflow__title">{config.title}</h2>
        <p className="spline-workflow__subtitle">{config.subtitle}</p>
      </div>

      <div className="spline-workflow__layout">
        {/* 3D Scene */}
        <div className="spline-workflow__scene">
          <iframe
            src={embedUrl}
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "16px" }}
            loading="lazy"
            allow="autoplay"
            title={config.title}
          />
        </div>

        {/* Node Legend (clickable) */}
        <div className="spline-workflow__legend">
          {config.nodes.map((node) => (
            <button
              key={node.id}
              className={`spline-workflow__legend-item ${
                activeNode?.id === node.id ? "spline-workflow__legend-item--active" : ""
              } ${hoveredNode === node.id ? "spline-workflow__legend-item--hovered" : ""}`}
              onClick={() => selectNode(node)}
            >
              <span
                className="spline-workflow__legend-dot"
                style={{ backgroundColor: node.color }}
              />
              <span className="spline-workflow__legend-label">
                {node.label}
              </span>
              <span className="spline-workflow__legend-tech">
                {node.tech[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {activeNode && (
        <div
          className="spline-workflow__detail"
          style={{ borderColor: activeNode.color }}
        >
          <div className="spline-workflow__detail-header">
            <div>
              <h3 style={{ color: activeNode.color }}>{activeNode.label}</h3>
              <span className="spline-workflow__detail-id">
                {activeNode.subtitle}
              </span>
            </div>
            <button
              className="spline-workflow__detail-close"
              onClick={() => setActiveNode(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <p className="spline-workflow__detail-desc">
            {activeNode.description}
          </p>

          <div className="spline-workflow__detail-grid">
            <div className="spline-workflow__detail-col">
              <h4>Tech Stack</h4>
              <ul>
                {activeNode.tech.map((t) => (
                  <li key={t}>
                    <i className="fa-solid fa-microchip" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="spline-workflow__detail-col">
              <h4>Inputs</h4>
              <ul>
                {activeNode.inputs.map((i) => (
                  <li key={i}>
                    <i className="fa-solid fa-arrow-right-to-bracket" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="spline-workflow__detail-col">
              <h4>Outputs</h4>
              <ul>
                {activeNode.outputs.map((o) => (
                  <li key={o}>
                    <i className="fa-solid fa-arrow-right-from-bracket" /> {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
