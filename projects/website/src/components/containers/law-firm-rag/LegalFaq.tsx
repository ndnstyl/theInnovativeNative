import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";

const faqItems = [
  {
    question: "What is the actual mechanism that prevents hallucinated citations?",
    answer: "Architecture, not prompting. Cerebro uses a three-gate verification pipeline: (1) The LLM only receives text chunks retrieved from your firm's verified document corpus — it has zero access to the internet, public models, or external knowledge. (2) Every citation in the generated answer is cross-referenced against the documents table using our validate_citations() function. If a cited case doesn't exist in your corpus, it's flagged. (3) Every query generates a complete audit trail — the exact chunks retrieved, their scores, and every citation produced. Stanford's 2024 study found Harvey AI hallucinates at 17-34%. Cerebro's architecture has maintained 100% citation integrity across all testing because it generates exclusively from retrieved documents, not from model memory."
  },
  {
    question: "If the system does produce an incorrect answer and I rely on it in a filing, who is liable?",
    answer: "You are. That's the honest answer, and any AI vendor who tells you otherwise is misleading you. Under ABA Model Rule 1.1, the attorney has a non-delegable duty of competence — including competence in the technology used. Every Cerebro answer includes a mandatory 'Verification Required' flag. This is a hard architectural constraint, not a suggestion. You must verify citations, read the source, and apply professional judgment. What Cerebro does provide: a complete audit trail that documents your research methodology. If a court questions your process, you can produce the exact retrieval path — query, retrieved chunks, relevance scores, citations, and source documents. That's fundamentally more defensible than 'I asked ChatGPT.'"
  },
  {
    question: "Where does my client's data go? Does it train your models?",
    answer: "Your documents are stored in an isolated PostgreSQL database dedicated exclusively to your firm. No data is shared between firms. No data is sent to OpenAI, Anthropic, or any third-party for model training. The embedding model processes your text into numerical vectors — it does not store or retain your content. The LLM receives only the retrieved chunks for answer generation — it does not retain conversation history or use your queries for improvement. Infrastructure is SOC 2 Type II certified with AES-256 encryption at rest and TLS 1.3 in transit. Regarding the February 2026 SDNY ruling on AI privilege: Cerebro's outputs are research tools, similar to Westlaw search results. Your work product doctrine applies to your analysis of the outputs, not the outputs themselves."
  },
  {
    question: "Can I Shepardize the cases Cerebro returns?",
    answer: "Not through Cerebro. This is a known limitation we disclose upfront. Cerebro retrieves cases from your corpus and ranks by authority and relevance, but it does not verify whether a case has been subsequently overruled, distinguished, or questioned. You must independently verify citation status through Westlaw, LexisNexis, or other citator services. Cerebro and Westlaw serve different purposes and complement each other — Westlaw searches published law, Cerebro searches your firm's internal work product. We're transparent about this because trust is earned through honesty, not marketing claims."
  },
  {
    question: "If opposing counsel challenges my research as AI-generated, what's my audit trail?",
    answer: "Every Cerebro query generates a complete, timestamped record: the exact query submitted, the practice area searched, all chunk IDs retrieved with their similarity scores, the reranked results with relevance scores, every citation generated, the model used, and the response latency. You can produce: 'I queried my firm's private research system with [query]. It retrieved these [N] document chunks from our verified case corpus, ranked by authority and relevance. It generated this answer citing these specific documents from our own files. Here is the full retrieval path.' This is not 'I Googled it.' This is documented, reproducible, evidence-based legal research from your firm's own institutional knowledge."
  },
  {
    question: "Why should I trust a startup over Westlaw or Lexis who have been doing this for 40 years?",
    answer: "You shouldn't stop using Westlaw or Lexis. Cerebro is not a replacement for published case law research — it's a complement. Westlaw and Lexis search the same published law that every other firm searches. Cerebro searches knowledge that only your firm has: your briefs, your motions, your outcomes, your strategies. That's the knowledge trapped in closed files that nobody has time to dig through. When you ask Westlaw 'What does the law say about relief from stay?', every firm gets the same answer. When you ask Cerebro, you get 'Here's how WE argued relief from stay last time, and we won.' That institutional memory is your competitive advantage, and no enterprise platform can replicate it."
  },
  {
    question: "What does the $2,500 pilot include, and what happens after?",
    answer: "The $2,500 is a one-time setup fee covering: ingestion of your firm's case files into the Cerebro corpus, configuration for your practice areas, 90-day access for up to 5 attorneys, 500 queries per month, and a dedicated implementation specialist for weeks 1-2. After the pilot, ongoing access is $500/month for up to 10 users — month-to-month, no annual contract. If Cerebro doesn't meet the agreed benchmarks during the pilot (100% citation integrity, sub-15-second responses, relevant results for your practice area), the $2,500 is fully refundable. Compare: Harvey AI runs $1,000+ per user per month. Westlaw AI is $200-500+ per user per month with annual commitment."
  },
  {
    question: "How does this comply with ABA ethics rules on AI use?",
    answer: "ABA Formal Opinion 512 (2024) permits attorneys to use AI tools provided they: (1) understand how the tool works, (2) review and verify AI-generated output, (3) protect client confidentiality, and (4) comply with applicable law. Cerebro's architecture directly enables all four: (1) The three-gate retrieval pipeline is documented and explainable. (2) Every answer includes 'Verification Required' and links to source documents. (3) Private RAG with firm-isolated databases and no third-party data sharing. (4) Full audit trail for court disclosure requirements. Growing jurisdictions require AI disclosure in filings. Cerebro's audit trail provides the exact documentation courts are starting to demand."
  },
];

const LegalFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="section lfr-faq fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              FAQ
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Questions Worth Asking
            </h2>
            <p className="lfr-faq__subtitle fade-top">
              The answers that matter before you decide.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="accordion" id="legalFaqAccordion">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`accordion-item lfr-faq__item fade-top ${activeIndex === index ? 'lfr-faq__item--active' : ''}`}
                >
                  <h5 className="accordion-header">
                    <button
                      className={`accordion-button ${activeIndex !== index ? 'collapsed' : ''}`}
                      onClick={() => toggleFaq(index)}
                      type="button"
                      aria-expanded={activeIndex === index}
                    >
                      {item.question}
                      <span className="faq-icon">
                        <i className={`fa-solid ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                      </span>
                    </button>
                  </h5>
                  <div
                    className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default LegalFaq;
