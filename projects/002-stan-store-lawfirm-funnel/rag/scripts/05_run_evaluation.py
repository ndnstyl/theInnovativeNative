#!/usr/bin/env python3
"""
Cerebro Legal RAG - Evaluation Runner

Runs gold questions against the RAG system and computes pass/fail metrics
per the evaluation harness specification.

Usage:
    python 05_run_evaluation.py --practice-area bankruptcy
    python 05_run_evaluation.py --all
    python 05_run_evaluation.py --question-id bk-001

Requirements:
    pip install requests python-dotenv

Environment Variables:
    CEREBRO_WEBHOOK_URL - n8n webhook URL for the RAG system
    CEREBRO_API_KEY - Optional API key for webhook authentication
"""

import os
import json
import argparse
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from pathlib import Path

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("Warning: requests not installed. Run: pip install requests")

# Constants
SCRIPT_DIR = Path(__file__).parent
GOLD_QUESTIONS_DIR = SCRIPT_DIR.parent / "gold_questions"
REPORTS_DIR = SCRIPT_DIR.parent / "evaluation_reports"

# Default webhook (user must configure)
DEFAULT_WEBHOOK_URL = os.getenv("CEREBRO_WEBHOOK_URL", "")


class EvaluationResult:
    """Container for a single evaluation result."""

    def __init__(self, question_id: str, practice_area: str):
        self.question_id = question_id
        self.practice_area = practice_area
        self.query = ""
        self.response = ""
        self.citations_found = []
        self.citations_expected = []
        self.citations_pass = False
        self.elements_found = []
        self.elements_expected = []
        self.elements_pass = False
        self.excluded_terms_found = []
        self.excluded_terms_expected = []
        self.exclusions_pass = True
        self.overall_pass = False
        self.error = None
        self.response_time_ms = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "question_id": self.question_id,
            "practice_area": self.practice_area,
            "query": self.query,
            "overall_pass": self.overall_pass,
            "citations": {
                "expected": self.citations_expected,
                "found": self.citations_found,
                "pass": self.citations_pass,
            },
            "elements": {
                "expected": self.elements_expected,
                "found": self.elements_found,
                "pass": self.elements_pass,
            },
            "exclusions": {
                "expected_absent": self.excluded_terms_expected,
                "found_present": self.excluded_terms_found,
                "pass": self.exclusions_pass,
            },
            "response_time_ms": self.response_time_ms,
            "error": self.error,
        }


class EvaluationRunner:
    """Runs evaluation against Cerebro RAG system."""

    def __init__(self, webhook_url: str, api_key: Optional[str] = None):
        self.webhook_url = webhook_url
        self.api_key = api_key
        self.results: List[EvaluationResult] = []

    def load_gold_questions(self, practice_area: str) -> List[Dict[str, Any]]:
        """Load gold questions for a practice area."""
        file_path = GOLD_QUESTIONS_DIR / f"{practice_area}_gold_questions.json"

        if not file_path.exists():
            raise FileNotFoundError(f"Gold questions not found: {file_path}")

        with open(file_path) as f:
            data = json.load(f)

        return data.get("questions", [])

    def call_rag_webhook(self, query: str) -> Tuple[str, int]:
        """
        Call the n8n webhook with a query and return response text and time.

        Returns:
            Tuple of (response_text, response_time_ms)
        """
        if not REQUESTS_AVAILABLE:
            raise RuntimeError("requests library not available")

        if not self.webhook_url:
            raise ValueError("CEREBRO_WEBHOOK_URL not configured")

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {"query": query}

        start_time = datetime.now()
        response = requests.post(
            self.webhook_url,
            json=payload,
            headers=headers,
            timeout=60,
        )
        elapsed_ms = int((datetime.now() - start_time).total_seconds() * 1000)

        response.raise_for_status()

        # Parse response - adjust based on actual webhook response format
        result = response.json()

        # Handle different response formats
        if isinstance(result, dict):
            # Common formats: {"response": "..."}, {"answer": "..."}, {"text": "..."}
            response_text = (
                result.get("response") or
                result.get("answer") or
                result.get("text") or
                result.get("output") or
                json.dumps(result)
            )
        else:
            response_text = str(result)

        return response_text, elapsed_ms

    def check_citations(
        self,
        response: str,
        must_cite: List[str]
    ) -> Tuple[List[str], bool]:
        """
        Check if response contains required citations.

        Returns:
            Tuple of (found_citations, all_found)
        """
        found = []
        response_lower = response.lower()

        for citation in must_cite:
            # Normalize citation for matching
            citation_lower = citation.lower()

            # Check for exact match or partial match
            # Handle case numbers, statute sections, etc.
            if citation_lower in response_lower:
                found.append(citation)
            else:
                # Try alternative formats
                # "Field v. Mans" might appear as "Field v Mans" or "Field vs. Mans"
                alt_citation = citation_lower.replace("v.", "v").replace(" v ", " vs ")
                if alt_citation in response_lower:
                    found.append(citation)
                # Check for case citation numbers (e.g., "516 U.S. 59")
                elif self._extract_citation_number(citation) in response:
                    found.append(citation)

        all_found = len(found) >= len(must_cite) * 0.5  # At least 50% of citations
        return found, all_found

    def _extract_citation_number(self, citation: str) -> str:
        """Extract the reporter citation (e.g., '516 U.S. 59') from a full citation."""
        # Match patterns like "516 U.S. 59", "831 F.2d 395", etc.
        match = re.search(r'\d+\s+[A-Z][A-Za-z.]+\s*\d*[a-z]*\s+\d+', citation)
        return match.group() if match else ""

    def check_elements(
        self,
        response: str,
        must_include: List[str]
    ) -> Tuple[List[str], bool]:
        """
        Check if response contains required elements.

        Returns:
            Tuple of (found_elements, all_found)
        """
        found = []
        response_lower = response.lower()

        for element in must_include:
            element_lower = element.lower()

            # Check for element presence (allow some flexibility)
            if element_lower in response_lower:
                found.append(element)
            else:
                # Check for key words from the element
                words = element_lower.split()
                if len(words) > 2:
                    # Check if most key words are present
                    matches = sum(1 for w in words if len(w) > 3 and w in response_lower)
                    if matches >= len(words) * 0.6:
                        found.append(element)

        all_found = len(found) >= len(must_include) * 0.8  # At least 80% of elements
        return found, all_found

    def check_exclusions(
        self,
        response: str,
        must_not_say: List[str]
    ) -> Tuple[List[str], bool]:
        """
        Check that response does NOT contain excluded terms.

        Returns:
            Tuple of (found_exclusions, none_found)
        """
        if not must_not_say:
            return [], True

        found = []
        response_lower = response.lower()

        for term in must_not_say:
            if term.lower() in response_lower:
                found.append(term)

        none_found = len(found) == 0
        return found, none_found

    def evaluate_question(self, question: Dict[str, Any]) -> EvaluationResult:
        """Evaluate a single gold question."""
        result = EvaluationResult(
            question_id=question["id"],
            practice_area=question.get("practice_area", "unknown"),
        )
        result.query = question["query"]
        result.citations_expected = question.get("must_cite", [])
        result.elements_expected = question.get("must_include_elements", [])
        result.excluded_terms_expected = question.get("must_not_say", [])

        try:
            # Call the RAG system
            response_text, response_time = self.call_rag_webhook(question["query"])
            result.response = response_text
            result.response_time_ms = response_time

            # Check citations
            result.citations_found, result.citations_pass = self.check_citations(
                response_text,
                result.citations_expected
            )

            # Check elements
            result.elements_found, result.elements_pass = self.check_elements(
                response_text,
                result.elements_expected
            )

            # Check exclusions
            result.excluded_terms_found, result.exclusions_pass = self.check_exclusions(
                response_text,
                result.excluded_terms_expected
            )

            # Overall pass requires all checks to pass
            result.overall_pass = (
                result.citations_pass and
                result.elements_pass and
                result.exclusions_pass
            )

        except Exception as e:
            result.error = str(e)
            result.overall_pass = False

        return result

    def run_evaluation(
        self,
        practice_area: str,
        question_id: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> List[EvaluationResult]:
        """
        Run evaluation for a practice area.

        Args:
            practice_area: The practice area to evaluate
            question_id: Optional specific question ID to evaluate
            limit: Optional limit on number of questions

        Returns:
            List of evaluation results
        """
        questions = self.load_gold_questions(practice_area)

        if question_id:
            questions = [q for q in questions if q["id"] == question_id]
            if not questions:
                raise ValueError(f"Question not found: {question_id}")

        if limit:
            questions = questions[:limit]

        results = []
        for i, question in enumerate(questions, 1):
            print(f"  [{i}/{len(questions)}] Evaluating {question['id']}...")
            result = self.evaluate_question(question)
            result.practice_area = practice_area
            results.append(result)

            status = "PASS" if result.overall_pass else "FAIL"
            print(f"    {status}: citations={result.citations_pass}, elements={result.elements_pass}, exclusions={result.exclusions_pass}")

        self.results.extend(results)
        return results

    def compute_metrics(self, results: List[EvaluationResult]) -> Dict[str, Any]:
        """Compute aggregate metrics from evaluation results."""
        if not results:
            return {}

        total = len(results)
        passed = sum(1 for r in results if r.overall_pass)

        citation_pass = sum(1 for r in results if r.citations_pass)
        element_pass = sum(1 for r in results if r.elements_pass)
        exclusion_pass = sum(1 for r in results if r.exclusions_pass)

        avg_response_time = sum(r.response_time_ms for r in results) / total if total > 0 else 0
        errors = sum(1 for r in results if r.error)

        return {
            "total_questions": total,
            "overall_pass_rate": round(passed / total, 4) if total > 0 else 0,
            "citation_pass_rate": round(citation_pass / total, 4) if total > 0 else 0,
            "element_pass_rate": round(element_pass / total, 4) if total > 0 else 0,
            "exclusion_pass_rate": round(exclusion_pass / total, 4) if total > 0 else 0,
            "avg_response_time_ms": round(avg_response_time, 2),
            "error_count": errors,
            "failures": [
                {"id": r.question_id, "reason": self._failure_reason(r)}
                for r in results if not r.overall_pass
            ],
        }

    def _failure_reason(self, result: EvaluationResult) -> str:
        """Generate a human-readable failure reason."""
        reasons = []
        if result.error:
            return f"Error: {result.error}"
        if not result.citations_pass:
            missing = set(result.citations_expected) - set(result.citations_found)
            reasons.append(f"Missing citations: {list(missing)[:3]}")
        if not result.elements_pass:
            missing = set(result.elements_expected) - set(result.elements_found)
            reasons.append(f"Missing elements: {list(missing)[:3]}")
        if not result.exclusions_pass:
            reasons.append(f"Contains excluded terms: {result.excluded_terms_found}")
        return "; ".join(reasons) if reasons else "Unknown"

    def generate_report(
        self,
        results: List[EvaluationResult],
        output_path: Optional[Path] = None,
    ) -> str:
        """Generate a markdown evaluation report."""
        metrics = self.compute_metrics(results)

        # Group by practice area
        by_area = {}
        for r in results:
            if r.practice_area not in by_area:
                by_area[r.practice_area] = []
            by_area[r.practice_area].append(r)

        lines = [
            "# Cerebro Legal RAG - Evaluation Report",
            "",
            f"**Generated**: {datetime.now().isoformat()}",
            f"**Total Questions**: {metrics.get('total_questions', 0)}",
            "",
            "## Summary Metrics",
            "",
            "| Metric | Value |",
            "|--------|-------|",
            f"| Overall Pass Rate | {metrics.get('overall_pass_rate', 0):.1%} |",
            f"| Citation Pass Rate | {metrics.get('citation_pass_rate', 0):.1%} |",
            f"| Element Pass Rate | {metrics.get('element_pass_rate', 0):.1%} |",
            f"| Exclusion Pass Rate | {metrics.get('exclusion_pass_rate', 0):.1%} |",
            f"| Avg Response Time | {metrics.get('avg_response_time_ms', 0):.0f}ms |",
            f"| Errors | {metrics.get('error_count', 0)} |",
            "",
        ]

        # Per practice area breakdown
        for area, area_results in by_area.items():
            area_metrics = self.compute_metrics(area_results)
            lines.extend([
                f"## {area.replace('_', ' ').title()}",
                "",
                f"- Questions: {area_metrics.get('total_questions', 0)}",
                f"- Pass Rate: {area_metrics.get('overall_pass_rate', 0):.1%}",
                "",
            ])

        # Failures section
        if metrics.get("failures"):
            lines.extend([
                "## Failures",
                "",
                "| Question ID | Reason |",
                "|-------------|--------|",
            ])
            for f in metrics["failures"][:20]:  # Limit to 20 failures
                reason = f["reason"][:80] + "..." if len(f["reason"]) > 80 else f["reason"]
                lines.append(f"| {f['id']} | {reason} |")
            lines.append("")

        # Release gate assessment
        lines.extend([
            "## Release Gate Assessment",
            "",
        ])

        # Check against thresholds from evaluation harness
        citation_ok = metrics.get("citation_pass_rate", 0) == 1.0
        element_ok = metrics.get("element_pass_rate", 0) >= 0.98
        exclusion_ok = metrics.get("exclusion_pass_rate", 0) == 1.0

        if citation_ok and element_ok and exclusion_ok:
            lines.append("**PASS**: All release gates met.")
        else:
            lines.append("**FAIL**: Release gates not met:")
            if not citation_ok:
                lines.append(f"- Citation integrity: {metrics.get('citation_pass_rate', 0):.1%} (required: 100%)")
            if not element_ok:
                lines.append(f"- Faithfulness: {metrics.get('element_pass_rate', 0):.1%} (required: >= 98%)")
            if not exclusion_ok:
                lines.append(f"- Exclusion compliance: {metrics.get('exclusion_pass_rate', 0):.1%} (required: 100%)")

        report = "\n".join(lines)

        if output_path:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "w") as f:
                f.write(report)

        return report


def run_offline_validation(practice_area: str, question_id: Optional[str] = None):
    """
    Run offline validation without calling the webhook.
    Validates gold question structure and outputs summary.
    """
    print(f"\nOffline Validation Mode (no webhook configured)")
    print("=" * 60)

    file_path = GOLD_QUESTIONS_DIR / f"{practice_area}_gold_questions.json"

    if not file_path.exists():
        print(f"Error: Gold questions not found: {file_path}")
        return

    with open(file_path) as f:
        data = json.load(f)

    questions = data.get("questions", [])
    if question_id:
        questions = [q for q in questions if q["id"] == question_id]

    print(f"Practice Area: {practice_area}")
    print(f"Version: {data.get('version', 'unknown')}")
    print(f"Total Questions: {len(questions)}")
    print("")

    # Categorize questions
    categories = {}
    for q in questions:
        cat = q.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

    print("Categories:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    print("")

    # Validate structure
    issues = []
    for q in questions:
        if not q.get("query"):
            issues.append(f"{q['id']}: missing query")
        if not q.get("must_cite"):
            issues.append(f"{q['id']}: missing must_cite")
        if not q.get("must_include_elements"):
            issues.append(f"{q['id']}: missing must_include_elements")

    if issues:
        print("Validation Issues:")
        for issue in issues[:10]:
            print(f"  - {issue}")
    else:
        print("Validation: PASSED (all questions have required fields)")

    # Sample output
    if questions:
        print("")
        print("Sample Question:")
        q = questions[0]
        print(f"  ID: {q['id']}")
        print(f"  Query: {q['query'][:80]}...")
        print(f"  Must Cite: {q.get('must_cite', [])[:2]}")
        print(f"  Elements: {len(q.get('must_include_elements', []))} required")
        print(f"  Exclusions: {q.get('must_not_say', [])}")


def main():
    parser = argparse.ArgumentParser(
        description="Run Cerebro Legal RAG evaluation against gold questions"
    )
    parser.add_argument(
        "--practice-area",
        choices=["bankruptcy", "criminal_procedure", "administrative"],
        help="Practice area to evaluate",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Evaluate all practice areas",
    )
    parser.add_argument(
        "--question-id",
        help="Evaluate a specific question ID (e.g., bk-001)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        help="Limit number of questions per practice area",
    )
    parser.add_argument(
        "--webhook-url",
        default=DEFAULT_WEBHOOK_URL,
        help="n8n webhook URL for the RAG system",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=REPORTS_DIR,
        help="Directory for evaluation reports",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate gold questions without calling webhook",
    )

    args = parser.parse_args()

    # Determine practice areas to evaluate
    if args.all:
        practice_areas = ["bankruptcy", "criminal_procedure", "administrative"]
    elif args.practice_area:
        practice_areas = [args.practice_area]
    elif args.question_id:
        # Infer practice area from question ID
        prefix = args.question_id.split("-")[0]
        practice_map = {"bk": "bankruptcy", "cp": "criminal_procedure", "ad": "administrative"}
        if prefix in practice_map:
            practice_areas = [practice_map[prefix]]
        else:
            print(f"Cannot infer practice area from question ID: {args.question_id}")
            return
    else:
        parser.print_help()
        return

    # Dry run mode
    if args.dry_run or not args.webhook_url:
        for pa in practice_areas:
            run_offline_validation(pa, args.question_id)
        return

    # Initialize runner
    runner = EvaluationRunner(
        webhook_url=args.webhook_url,
        api_key=os.getenv("CEREBRO_API_KEY"),
    )

    # Run evaluations
    all_results = []
    for pa in practice_areas:
        print(f"\n{'='*60}")
        print(f"Evaluating: {pa}")
        print(f"{'='*60}")

        try:
            results = runner.run_evaluation(
                practice_area=pa,
                question_id=args.question_id,
                limit=args.limit,
            )
            all_results.extend(results)
        except Exception as e:
            print(f"Error evaluating {pa}: {e}")

    # Generate report
    if all_results:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = args.output_dir / f"evaluation_{timestamp}.md"

        report = runner.generate_report(all_results, report_path)
        print(f"\n{'='*60}")
        print("EVALUATION COMPLETE")
        print(f"{'='*60}")
        print(report)

        if report_path.exists():
            print(f"\nReport saved to: {report_path}")

        # Also save raw results as JSON
        results_path = args.output_dir / f"evaluation_{timestamp}.json"
        with open(results_path, "w") as f:
            json.dump(
                {
                    "timestamp": datetime.now().isoformat(),
                    "metrics": runner.compute_metrics(all_results),
                    "results": [r.to_dict() for r in all_results],
                },
                f,
                indent=2,
            )
        print(f"Raw results saved to: {results_path}")


if __name__ == "__main__":
    main()
