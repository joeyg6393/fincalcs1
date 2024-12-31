interface CalculatorResultProps {
  label: string;
  value: string;
  highlighted?: boolean;
}

export function CalculatorResult({
  label,
  value,
  highlighted = false,
}: CalculatorResultProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={`text-xl font-semibold ${
          highlighted ? 'text-green-600 dark:text-green-400' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}