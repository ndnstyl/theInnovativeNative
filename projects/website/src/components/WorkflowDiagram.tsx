import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// ── Types ───────────────────────────────────────────────────────────────────

export interface WorkflowNode {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  tech: string[];
  inputs: string[];
  outputs: string[];
  color: string;
  icon: string;
  // Position on the isometric grid (col, row) — determines layout
  gridPos: [number, number];
}

export interface WorkflowEdge {
  from: string;
  to: string;
  // Waypoints as [col, row] for routing the neon tube
  waypoints?: [number, number][];
}

export interface WorkflowConfig {
  title: string;
  subtitle: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ── THT Pipeline Config ─────────────────────────────────────────────────────

export const THT_PIPELINE: WorkflowConfig = {
  title: "Tiny Home Timelapse Pipeline",
  subtitle:
    "From a single canon photo to a branded construction timelapse — fully automated",
  nodes: [
    {
      id: "router",
      label: "Router",
      subtitle: "WF-THT-ROUTER",
      description:
        "The dispatcher. Receives action triggers from Airtable, validates project status, and routes to the correct downstream workflow.",
      tech: ["n8n Webhook", "Airtable API", "Switch Node"],
      inputs: ["Airtable Run Action dropdown"],
      outputs: ["Routes to Prompt, Image, Video, or Reel workflow"],
      color: "#D4956A",
      icon: "fa-route",
      gridPos: [0, 1],
    },
    {
      id: "prompt",
      label: "Prompt Generator",
      subtitle: "WF-THT-PROMPT",
      description:
        "Generates 8 phase-specific prompts using Groq LLM. Each prompt describes a construction stage from foundation to move-in ready.",
      tech: ["Groq LLM", "n8n Code Node", "Airtable API"],
      inputs: ["Project record with canon photo"],
      outputs: [
        "8 prompts in Prompt Tracking table",
        "Status → prompts_approved",
      ],
      color: "#6AB4D4",
      icon: "fa-brain",
      gridPos: [2, 0],
    },
    {
      id: "image",
      label: "Image Generator",
      subtitle: "WF-THT-IMAGE",
      description:
        "Runs Flux 2 Pro img2img generation in 4 stages, chaining from the canon photo through 8 construction phases.",
      tech: ["Kie.AI (Flux 2 Pro)", "Callback Webhooks", "Google Drive API"],
      inputs: ["Prompts + canon reference photo"],
      outputs: ["8 AI-generated phase images", "Stored in Google Drive"],
      color: "#6AD4A0",
      icon: "fa-image",
      gridPos: [3, 1.5],
    },
    {
      id: "video",
      label: "Video Generator",
      subtitle: "WF-THT-VIDEO",
      description:
        "Creates Veo 3.1 generative video by interpolating between consecutive phase images with actual camera movement.",
      tech: ["Kie.AI (Veo 3.1)", "Frame Interpolation", "Callback Webhooks"],
      inputs: ["Phase image pairs (first + last frame)"],
      outputs: ["4 video clips (one per stage)", "True generative motion"],
      color: "#B46AD4",
      icon: "fa-film",
      gridPos: [2, 2.5],
    },
    {
      id: "reel",
      label: "Reel Assembler",
      subtitle: "WF-THT-REEL",
      description:
        "FFMPEG stitches 4 video clips with crossfade transitions, adds music, and overlays branding.",
      tech: ["FFMPEG", "n8n Code Node", "Google Drive API"],
      inputs: ["4 video clips + branding + music"],
      outputs: ["Branded timelapse reel (MP4)", "Multi-platform exports"],
      color: "#D46A6A",
      icon: "fa-clapperboard",
      gridPos: [4.5, 2.5],
    },
  ],
  edges: [
    { from: "router", to: "prompt" },
    { from: "prompt", to: "image" },
    { from: "router", to: "video" },
    { from: "image", to: "reel" },
    { from: "video", to: "reel" },
  ],
};

// ── Grid → Pixel helpers ────────────────────────────────────────────────────

const CELL = 160; // px per grid unit

function gridToIso(col: number, row: number): { x: number; y: number } {
  return {
    x: (col - row) * (CELL * 0.5),
    y: (col + row) * (CELL * 0.28),
  };
}

// ── Neon Tube Connector (SVG) ───────────────────────────────────────────────

function NeonTube({
  fromPos,
  toPos,
  color,
  index,
  active,
}: {
  fromPos: [number, number];
  toPos: [number, number];
  color: string;
  index: number;
  active: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  const from = gridToIso(fromPos[0], fromPos[1]);
  const to = gridToIso(toPos[0], toPos[1]);

  // Midpoint routing — creates the right-angle elbow feel
  const midX = from.x + (to.x - from.x) * 0.6;
  const midY = from.y + (to.y - from.y) * 0.4;

  const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  useEffect(() => {
    if (!pathRef.current || !glowRef.current) return;
    const length = pathRef.current.getTotalLength();

    // Draw-on animation
    gsap.set([pathRef.current, glowRef.current], {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.to([pathRef.current, glowRef.current], {
      strokeDashoffset: 0,
      duration: 1.2,
      delay: 0.5 + index * 0.2,
      ease: "power2.inOut",
    });

    // Pulse animation along path
    if (pulseRef.current && pathRef.current) {
      const pathEl = pathRef.current;
      gsap.to(
        { t: 0 },
        {
          t: 1,
          duration: 2.5,
          delay: 1.5 + index * 0.3,
          repeat: -1,
          repeatDelay: 1.5,
          ease: "power1.inOut",
          onUpdate: function () {
            const t = this.targets()[0].t;
            const point = pathEl.getPointAtLength(t * length);
            gsap.set(pulseRef.current, { cx: point.x, cy: point.y, opacity: 1 });
          },
          onRepeat: () => {
            gsap.set(pulseRef.current, { opacity: 0 });
          },
        }
      );
    }
  }, [index]);

  const filterId = `neon-glow-${index}`;

  return (
    <g>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <path
        ref={glowRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 6 : 4}
        strokeLinecap="round"
        opacity={active ? 0.4 : 0.15}
        filter={`url(#${filterId})`}
      />

      {/* Core line */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 3 : 2}
        strokeLinecap="round"
        opacity={active ? 0.9 : 0.5}
      />

      {/* Traveling pulse */}
      <circle
        ref={pulseRef}
        r={4}
        fill={color}
        opacity={0}
        filter={`url(#${filterId})`}
      />
    </g>
  );
}

// ── 3D Isometric Glass Cube Node ────────────────────────────────────────────

function IsoCube({
  node,
  index,
  isActive,
  onClick,
  onHover,
}: {
  node: WorkflowNode;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const pos = gridToIso(node.gridPos[0], node.gridPos[1]);

  useEffect(() => {
    if (!cubeRef.current) return;
    gsap.fromTo(
      cubeRef.current,
      { y: 60, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.2 + index * 0.15,
        ease: "back.out(1.6)",
      }
    );
  }, [index]);

  return (
    <div
      ref={cubeRef}
      className={`iso-node ${isActive ? "iso-node--active" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        "--node-color": node.color,
        "--node-glow": `${node.color}60`,
        "--node-glow-strong": `${node.color}aa`,
      } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Underglow reflection */}
      <div className="iso-node__underglow" />

      {/* The 3D cube */}
      <div className="iso-node__cube">
        {/* Top face */}
        <div className="iso-node__face iso-node__face--top">
          <div className="iso-node__icon">
            <i className={`fa-solid ${node.icon}`} />
          </div>
        </div>
        {/* Front face */}
        <div className="iso-node__face iso-node__face--front" />
        {/* Right face */}
        <div className="iso-node__face iso-node__face--right" />
      </div>

      {/* Floating label (black pill) */}
      <div className="iso-node__label">
        <span className="iso-node__label-text">{node.label}</span>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface WorkflowDiagramProps {
  config?: WorkflowConfig;
}

export default function WorkflowDiagram({
  config = THT_PIPELINE,
}: WorkflowDiagramProps) {
  const [activeNode, setActiveNode] = useState<WorkflowNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleNode = useCallback(
    (node: WorkflowNode) => {
      setActiveNode((prev) => (prev?.id === node.id ? null : node));
    },
    []
  );

  // Calculate SVG viewBox from node positions
  const positions = config.nodes.map((n) => gridToIso(n.gridPos[0], n.gridPos[1]));
  const minX = Math.min(...positions.map((p) => p.x)) - 100;
  const maxX = Math.max(...positions.map((p) => p.x)) + 100;
  const minY = Math.min(...positions.map((p) => p.y)) - 60;
  const maxY = Math.max(...positions.map((p) => p.y)) + 60;

  const nodeMap = Object.fromEntries(config.nodes.map((n) => [n.id, n]));

  return (
    <section className="iso-diagram" ref={containerRef}>
      <div className="iso-diagram__header">
        <h2 className="iso-diagram__title">{config.title}</h2>
        <p className="iso-diagram__subtitle">{config.subtitle}</p>
      </div>

      <div className="iso-diagram__scene">
        {/* Isometric grid background */}
        <div className="iso-diagram__grid" />

        {/* SVG layer for neon tube connectors */}
        <svg
          className="iso-diagram__svg"
          viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {config.edges.map((edge, i) => {
            const fromNode = nodeMap[edge.from];
            const toNode = nodeMap[edge.to];
            if (!fromNode || !toNode) return null;
            const isActive =
              activeNode?.id === edge.from || activeNode?.id === edge.to;
            // Use the "to" node color for the tube
            return (
              <NeonTube
                key={`${edge.from}-${edge.to}`}
                fromPos={fromNode.gridPos}
                toPos={toNode.gridPos}
                color={toNode.color}
                index={i}
                active={isActive}
              />
            );
          })}
        </svg>

        {/* Node layer */}
        <div className="iso-diagram__nodes">
          {config.nodes.map((node, i) => (
            <IsoCube
              key={node.id}
              node={node}
              index={i}
              isActive={activeNode?.id === node.id}
              onClick={() => toggleNode(node)}
              onHover={(h) => setHoveredId(h ? node.id : null)}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {activeNode && (
        <DetailPanel node={activeNode} onClose={() => setActiveNode(null)} />
      )}
    </section>
  );
}

// ── Detail Panel ────────────────────────────────────────────────────────────

function DetailPanel({
  node,
  onClose,
}: {
  node: WorkflowNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [node.id]);

  return (
    <div
      ref={panelRef}
      className="iso-diagram__detail"
      style={{ borderLeftColor: node.color }}
    >
      <div className="iso-diagram__detail-header">
        <div>
          <h3 style={{ color: node.color }}>
            <i
              className={`fa-solid ${node.icon}`}
              style={{ marginRight: 10 }}
            />
            {node.label}
          </h3>
          <span className="iso-diagram__detail-id">{node.subtitle}</span>
        </div>
        <button className="iso-diagram__detail-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <p className="iso-diagram__detail-desc">{node.description}</p>

      <div className="iso-diagram__detail-grid">
        <div className="iso-diagram__detail-col">
          <h4>Tech Stack</h4>
          <ul>
            {node.tech.map((t) => (
              <li key={t}>
                <i className="fa-solid fa-microchip" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="iso-diagram__detail-col">
          <h4>Inputs</h4>
          <ul>
            {node.inputs.map((inp) => (
              <li key={inp}>
                <i className="fa-solid fa-arrow-right-to-bracket" /> {inp}
              </li>
            ))}
          </ul>
        </div>
        <div className="iso-diagram__detail-col">
          <h4>Outputs</h4>
          <ul>
            {node.outputs.map((o) => (
              <li key={o}>
                <i className="fa-solid fa-arrow-right-from-bracket" /> {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
