import Head from "next/head";
import WorkflowDiagram, { THT_PIPELINE } from "@/components/WorkflowDiagram";

export default function WorkflowDemo() {
  return (
    <>
      <Head>
        <title>Interactive Pipeline Demo | The Innovative Native</title>
        <meta
          name="description"
          content="Explore the THT automation pipeline — an interactive diagram showing how AI-generated construction timelapses are built end-to-end."
        />
      </Head>

      <main
        style={{
          background: "var(--quaternary-color)",
          minHeight: "100vh",
          paddingTop: "40px",
        }}
      >
        <WorkflowDiagram config={THT_PIPELINE} />
      </main>
    </>
  );
}
