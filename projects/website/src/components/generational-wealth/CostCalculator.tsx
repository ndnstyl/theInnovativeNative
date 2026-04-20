import React, { useState, useEffect, useRef } from "react";

interface CostCalculatorProps {
  mode: "eqip" | "budget";
}

const LOAN_LIMIT = 272200;

function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

const CostCalculator = ({ mode }: CostCalculatorProps) => {
  const [amount, setAmount] = useState("");
  const [acreage, setAcreage] = useState("");
  const [pricePerAcre, setPricePerAcre] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculate = () => {
    if (mode === "eqip") {
      const n = parseFloat(amount.replace(/[^0-9.]/g, ""));
      if (isNaN(n) || n <= 0) { setResult(null); return; }
      setResult({
        "75% reimbursement": formatCurrency(n * 0.75),
        "90% reimbursement": formatCurrency(n * 0.90),
        "Your out-of-pocket (75%)": formatCurrency(n * 0.25),
        "Your out-of-pocket (90%)": formatCurrency(n * 0.10),
      });
    } else {
      const acres = parseFloat(acreage.replace(/[^0-9.]/g, ""));
      const price = parseFloat(pricePerAcre.replace(/[^0-9.]/g, ""));
      if (isNaN(acres) || isNaN(price) || acres <= 0 || price <= 0) {
        setResult(null);
        return;
      }
      const landCost = acres * price;
      const remaining = LOAN_LIMIT - landCost;
      setResult({
        "Land cost": formatCurrency(landCost),
        "Remaining budget": remaining > 0 ? formatCurrency(remaining) : "$0",
        "Over budget by": remaining < 0 ? formatCurrency(Math.abs(remaining)) : "—",
        "USDA loan limit": formatCurrency(LOAN_LIMIT),
      });
    }
  };

  const debounce = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(calculate, 300);
  };

  useEffect(() => {
    debounce();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, acreage, pricePerAcre]);

  return (
    <div className="gw-calculator">
      {mode === "eqip" ? (
        <>
          <div className="gw-calculator__heading">EQIP Reimbursement Calculator</div>
          <div className="gw-calculator__row">
            <label className="gw-calculator__label">Total project cost ($)</label>
            <input
              type="number"
              className="gw-calculator__input"
              placeholder="e.g. 20000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>
        </>
      ) : (
        <>
          <div className="gw-calculator__heading">Budget Calculator</div>
          <div className="gw-calculator__row">
            <label className="gw-calculator__label">Acreage</label>
            <input
              type="number"
              className="gw-calculator__input"
              placeholder="e.g. 40"
              value={acreage}
              onChange={(e) => setAcreage(e.target.value)}
              min="0"
            />
          </div>
          <div className="gw-calculator__row">
            <label className="gw-calculator__label">Price per acre ($)</label>
            <input
              type="number"
              className="gw-calculator__input"
              placeholder="e.g. 4000"
              value={pricePerAcre}
              onChange={(e) => setPricePerAcre(e.target.value)}
              min="0"
            />
          </div>
        </>
      )}
      {result && (
        <div className="gw-calculator__results">
          {Object.entries(result).map(([label, value]) => (
            <div key={label} className="gw-calculator__result-row">
              <span className="gw-calculator__result-label">{label}</span>
              <span className="gw-calculator__result-value">{value}</span>
            </div>
          ))}
        </div>
      )}
      <p className="gw-calculator__note">
        {mode === "eqip"
          ? "Rates shown are typical EQIP reimbursements. Your actual rate depends on your practice and eligibility. Verify with your local NRCS office."
          : `Based on a $${LOAN_LIMIT.toLocaleString()} USDA direct loan limit. Actual limits vary by county and loan type.`}
      </p>
    </div>
  );
};

export default CostCalculator;
