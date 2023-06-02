import { useState } from "react";
import {
  CalculatePoliciesReturnType,
  calculatePolicies,
} from "../lib/allowance";
import {PolicyInput2} from "./PolicyInput";

export default function PoliciesForm() {
  const [policies, setPolicies] = useState([]);
  const [workspace, setWorkspace] = useState({ fiscal_year_start_month: 0 });
  const [inputDate, setInputDate] = useState(new Date());

  const [result, setResult] = useState<CalculatePoliciesReturnType | null>(
    null
  );

  const handleSubmit = () => {
    const result = calculatePolicies(policies, workspace, inputDate);
    setResult(result);
  };
  const addPolicy = () => setPolicies(old => [
    ...old,
    {
      policy: {
        id: "",
        name: "",
        accrual_month: 0,
        policy_amount: 0,
        accrual_cycle: false,
        cycle_on_employment_start: false,
        policy_duration: null,
        upfront_allocation: false,
        allowance_type_id: "",
      },
      policy_start_date: new Date(),
    },
  ]);

  return (
    <div>
      <h2>Eingabeformular</h2>
      <form onSubmit={handleSubmit}>
        {policies.map((policy, i) => (
          <PolicyInput2
            key={i}
            index={i}
            policy={policy}
            setPolicy={newPolicy => {
              setPolicies(old => old.map((p, j) => i === j ? newPolicy : p));
            }}
          />
        ))}
        <button type="button" onClick={addPolicy}>Add Policy</button>
        <input type="number" onChange={(e) => setWorkspace({fiscal_year_start_month: parseInt(e.target.value)})} placeholder="Fiscal Year Start Month"/>
        <input type="date" onChange={(e) => setInputDate(new Date(e.target.value))} placeholder="Input Date"/>
        <button type="submit">Berechnen</button>
      </form>

      {result && (
        <div>
          <h2>Ergebnis</h2>
          <p>Policies: {result.policies}</p>
          <p>Past Allowance: {result.past_allowance}</p>
          <p>Expiration: {result.expiration}</p>
          {/* Sie können hier eine Map-Funktion verwenden, um durch alle Ereignisse in den Ergebnissen zu gehen und sie entsprechend anzuzeigen */}
          {result.events.map((event, index) => (
            <div key={index}>
              <p>Policy Name: {event.policy_name}</p>
              <p>Date: {event.date.toString()}</p>
              <p>Amount: {event.amount}</p>
              <p>Expiration: {event.expiration?.toString() || "None"}</p>
              <p>Remaining: {event.remaining}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
