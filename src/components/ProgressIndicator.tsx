import React from "react";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface ProgressIndicatorProps {
  /** 진행 단계들 */
  steps: ProgressStep[];
  /** 컴팩트 모드 */
  compact?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.completed 
                ? "bg-green-500 text-white" 
                : step.current 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {step.completed ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step.completed ? "bg-green-500" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed 
                  ? "bg-green-500 text-white" 
                  : step.current 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {step.completed ? "✓" : index + 1}
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  step.completed || step.current ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step.completed ? "bg-green-500" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
