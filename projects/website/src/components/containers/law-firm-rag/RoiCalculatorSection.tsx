import React, { useState, useCallback, useEffect } from 'react';
import type { PracticeArea, FirmInputs, RoiResults } from '@/types/roi-calculator';
import { PRACTICE_AREAS, BENCHMARKS, WIZARD_STEPS } from '@/data/roi-benchmarks';
import { calculateRoi } from '@/lib/roi-calculations';
import InputField from '@/components/containers/law-firm-roi/InputField';
import LivePreview from '@/components/containers/law-firm-roi/LivePreview';
import AnimatedCounter from '@/components/containers/law-firm-roi/AnimatedCounter';
import gsap from 'gsap';

interface RoiCalculatorSectionProps {
  openCalendly: () => void;
}

const DEFAULT_INPUTS: FirmInputs = BENCHMARKS.bankruptcy;

const RoiCalculatorSection = ({ openCalendly }: RoiCalculatorSectionProps) => {
  const [practiceArea, setPracticeArea] = useState<PracticeArea | null>(null);
  const [inputs, setInputs] = useState<FirmInputs>(DEFAULT_INPUTS);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<RoiResults>(() => calculateRoi(DEFAULT_INPUTS));

  useEffect(() => {
    setResults(calculateRoi(inputs));
  }, [inputs]);

  const handlePracticeSelect = useCallback((area: PracticeArea) => {
    setPracticeArea(area);
    setInputs({ ...BENCHMARKS[area] });
    setCurrentStep(0);
    setShowResults(false);
    setTimeout(() => {
      document.getElementById('roi-wizard')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleInputChange = useCallback((key: string, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
      setTimeout(() => {
        const els = document.querySelectorAll('.roi-results__animate');
        gsap.fromTo(els, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        });
      }, 50);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep, showResults]);

  const step = WIZARD_STEPS[currentStep];
  const maxPhase = Math.max(...results.phases.map((p) => p.annualRoi), 1);
  const allInsights = results.phases.flatMap((p) => p.insights);

  return (
    <>
      {/* Practice Area Selector */}
      <section className="section roi-practice-selector fade-wrapper" id="practice-selector">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <h2 className="title title-anim">Calculate Your ROI</h2>
              <p className="roi-practice-selector__subtitle fade-top">
                Select your practice area and we&apos;ll pre-fill industry benchmarks. Adjust any number to match your firm.
              </p>
            </div>
          </div>
          <div className="row g-4 mt-3 justify-content-center">
            {PRACTICE_AREAS.map((area) => (
              <div key={area.id} className="col-12 col-md-4">
                <button
                  className={`roi-practice-selector__card fade-top${practiceArea === area.id ? ' roi-practice-selector__card--active' : ''}`}
                  onClick={() => handlePracticeSelect(area.id)}
                  type="button"
                >
                  <div className="roi-practice-selector__card-icon">
                    <i className={area.icon}></i>
                  </div>
                  <h4>{area.label}</h4>
                  <p>{area.description}</p>
                  {practiceArea === area.id && (
                    <span className="roi-practice-selector__check">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Wizard */}
      {practiceArea && !showResults && (
        <section className="section roi-wizard" id="roi-wizard">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="roi-wizard__card">
                  {/* Progress */}
                  <div className="roi-wizard__progress">
                    {WIZARD_STEPS.map((s, i) => (
                      <button
                        key={i}
                        className={`roi-wizard__step-dot${i === currentStep ? ' roi-wizard__step-dot--active' : ''}${i < currentStep ? ' roi-wizard__step-dot--done' : ''}`}
                        onClick={() => setCurrentStep(i)}
                        type="button"
                        aria-label={`Step ${i + 1}: ${s.title}`}
                      >
                        <span className="roi-wizard__step-num">
                          {i < currentStep ? <i className="fa-solid fa-check"></i> : i + 1}
                        </span>
                        <span className="roi-wizard__step-label">{s.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Step Content */}
                  <div className="roi-wizard__content">
                    <div className="roi-wizard__step-header">
                      <div className="roi-wizard__step-icon">
                        <i className={step.icon}></i>
                      </div>
                      <div>
                        <h3 className="roi-wizard__step-title">{step.title}</h3>
                        <p className="roi-wizard__step-subtitle">{step.subtitle}</p>
                      </div>
                    </div>

                    <div className="roi-wizard__fields">
                      {step.fields.map((field) => (
                        <InputField
                          key={field.key}
                          field={field}
                          value={inputs[field.key]}
                          onChange={handleInputChange}
                        />
                      ))}
                    </div>

                    <div className="roi-wizard__nav">
                      <button
                        className="btn btn--secondary"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        type="button"
                      >
                        <i className="fa-solid fa-arrow-left"></i> Back
                      </button>
                      <button className="btn btn--primary" onClick={handleNext} type="button">
                        {currentStep === WIZARD_STEPS.length - 1 ? (
                          <>See My ROI <i className="fa-solid fa-chart-line"></i></>
                        ) : (
                          <>Next <i className="fa-solid fa-arrow-right"></i></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="col-12 col-lg-4 d-none d-lg-block">
                <LivePreview results={results} isComplete={false} />
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="d-lg-none">
              <div className="roi-wizard__mobile-preview">
                <span>Estimated ROI:</span>
                <span className="roi-wizard__mobile-total">
                  ${Math.round(results.totalAnnualRoi).toLocaleString()}/yr
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Dashboard */}
      {showResults && (
        <section className="section roi-results" id="roi-results">
          <div className="container">
            {/* Total */}
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center roi-results__animate">
                <span className="roi-results__badge">Your Projected ROI</span>
                <div className="roi-results__total">
                  <AnimatedCounter value={results.totalAnnualRoi} prefix="$" />
                  <span className="roi-results__per-year">/year</span>
                </div>
                <p className="roi-results__monthly">
                  That&apos;s <strong><AnimatedCounter value={results.totalMonthlyRoi} prefix="$" /></strong>/month
                  in recovered revenue and saved time.
                </p>
              </div>
            </div>

            {/* Phase Cards */}
            <div className="row g-4 mt-4">
              {results.phases.map((phase, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3 roi-results__animate">
                  <div className="roi-results__phase-card">
                    <h4 className="roi-results__phase-name">{phase.shortName}</h4>
                    <div className="roi-results__phase-value">
                      <AnimatedCounter value={phase.annualRoi} prefix="$" />
                    </div>
                    <div className="roi-results__phase-bar">
                      <div
                        className="roi-results__phase-bar-fill"
                        style={{ width: `${(phase.annualRoi / maxPhase) * 100}%` }}
                      ></div>
                    </div>
                    <p className="roi-results__phase-label">{phase.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            {allInsights.length > 0 && (
              <div className="row justify-content-center mt-5">
                <div className="col-12 col-lg-8 roi-results__animate">
                  <div className="roi-results__insights">
                    <h3><i className="fa-solid fa-magnifying-glass-chart"></i> Key Insights</h3>
                    <ul>
                      {allInsights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Scenarios */}
            <div className="row justify-content-center mt-5">
              <div className="col-12 col-lg-10 roi-results__animate">
                <h3 className="text-center mb-4">Implementation Scenarios</h3>
                <div className="roi-results__scenarios">
                  {results.scenarios.map((s, i) => (
                    <div key={i} className={`roi-results__scenario${i === 1 ? ' roi-results__scenario--recommended' : ''}`}>
                      {i === 1 && <span className="roi-results__scenario-badge">Recommended</span>}
                      <h4>{s.label}</h4>
                      <div className="roi-results__scenario-cost">${s.cost.toLocaleString()}</div>
                      <div className="roi-results__scenario-stats">
                        <div>
                          <span className="roi-results__scenario-value">{s.paybackMonths.toFixed(1)}</span>
                          <span className="roi-results__scenario-label">months payback</span>
                        </div>
                        <div>
                          <span className="roi-results__scenario-value">{s.roiMultiple.toFixed(1)}x</span>
                          <span className="roi-results__scenario-label">ROI multiple</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="row justify-content-center mt-5">
              <div className="col-12 col-lg-8 text-center roi-results__animate">
                <div className="roi-results__cta">
                  <h3>Ready to Recover That Revenue?</h3>
                  <p>
                    Your firm has <strong>${Math.round(results.totalAnnualRoi).toLocaleString()}/year</strong> in recoverable
                    value. Let&apos;s build the system to capture it.
                  </p>
                  <div className="roi-results__cta-buttons">
                    <button className="btn btn--primary btn--large" onClick={openCalendly} type="button">
                      Book Discovery Call <i className="fa-solid fa-calendar"></i>
                    </button>
                    <a
                      href="https://stan.store/theinnovativenative"
                      className="btn btn--secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Browse Solutions <i className="fa-solid fa-store"></i>
                    </a>
                  </div>
                  <div className="roi-results__trust-items">
                    <span><i className="fa-solid fa-shield-halved"></i> No commitment required</span>
                    <span><i className="fa-solid fa-clock"></i> 30-minute call</span>
                    <span><i className="fa-solid fa-lock"></i> Your data stays private</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="text-center mt-4 roi-results__animate">
              <button className="btn btn--secondary" onClick={handleBack} type="button">
                <i className="fa-solid fa-arrow-left"></i> Adjust My Numbers
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default RoiCalculatorSection;
