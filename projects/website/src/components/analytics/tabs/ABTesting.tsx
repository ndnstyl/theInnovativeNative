import React from 'react';
import ABTestCard from '../ABTestCard';
import ScoreCard from '../ScoreCard';

interface ABTestVariant {
  starts: number;
  completes: number;
  leads: number;
  completionRate: number;
  leadRate: number;
}

interface ABTest {
  quizId: string;
  quizName: string;
  variantA: ABTestVariant;
  variantB: ABTestVariant;
  lift: number;
  confidence: number;
  status: string;
  daysRunning: number;
}

interface ABTestingProps {
  abTests: {
    quizzes: ABTest[];
  };
}

const ABTesting: React.FC<ABTestingProps> = ({ abTests }) => {
  const totalTests = abTests.quizzes.length;
  const winningTests = abTests.quizzes.filter(
    (t) => t.status === 'variant_b_winning' || t.status === 'variant_a_winning'
  ).length;
  const avgLift = totalTests > 0
    ? (abTests.quizzes.reduce((sum, t) => sum + t.lift, 0) / totalTests).toFixed(1)
    : '0';
  const avgConfidence = totalTests > 0
    ? (abTests.quizzes.reduce((sum, t) => sum + t.confidence, 0) / totalTests).toFixed(1)
    : '0';

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--4">
          <ScoreCard title="Total Tests" value={totalTests} format="number" />
          <ScoreCard title="Winning Tests" value={winningTests} format="number" />
          <ScoreCard title="Avg Lift" value={`${avgLift}%`} />
          <ScoreCard title="Avg Confidence" value={`${avgConfidence}%`} />
        </div>
      </div>

      <div className="analytics__section">
        {abTests.quizzes.map((test) => (
          <ABTestCard
            key={test.quizId}
            testName={test.quizName}
            variantA={test.variantA}
            variantB={test.variantB}
            lift={test.lift}
            confidence={test.confidence}
            status={test.status}
            daysRunning={test.daysRunning}
          />
        ))}
      </div>
    </div>
  );
};

export default ABTesting;
