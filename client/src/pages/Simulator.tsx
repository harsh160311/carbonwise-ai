import { useEffect } from 'react';
import { useCarbonData } from '../hooks/useCarbonData';
import { useSimulator } from '../hooks/useSimulator';
import { SimulatorControls } from '../components/simulator/SimulatorControls';
import { SimulationResults } from '../components/simulator/SimulationResults';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { CarbonInput } from '../types';

export function Simulator() {
  const { latestEntry } = useCarbonData();
  const { input, currentResult, savings, savingsPercentage, updateField, resetToInput } =
    useSimulator(latestEntry?.input);

  useEffect(() => {
    if (latestEntry?.input) {
      resetToInput(latestEntry.input);
    }
  }, [latestEntry?.input, resetToInput]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Carbon Reduction Simulator
        </h1>
        <p className="text-slate-500">
          Adjust sliders to see how lifestyle changes affect your carbon footprint in real time.
        </p>
      </div>

      {!latestEntry && (
        <Card className="mb-8">
          <div className="py-8 text-center">
            <p className="mb-4 text-slate-500">
              Calculate your carbon footprint first to use the simulator with your actual data.
            </p>
            <Button onClick={() => window.location.href = '/calculator'}>
              Go to Calculator
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <SimulatorControls
              input={input}
              onFieldChange={(category, field, value) =>
                updateField(category as keyof CarbonInput, field as never, value)
              }
            />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <SimulationResults
            currentResult={currentResult}
            savings={savings}
            savingsPercentage={savingsPercentage}
          />
        </div>
      </div>
    </div>
  );
}
