import { Input } from './ui/input';
import { Label } from './ui/label';

interface BaseCalculatorInputProps {
  id: string;
  label: string;
  type: string;
}

interface NumericCalculatorInputProps extends BaseCalculatorInputProps {
  type: 'number' | 'currency' | 'percent';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface TextCalculatorInputProps extends BaseCalculatorInputProps {
  type: 'text';
  value: string;
  onChange: (value: string) => void;
}

type CalculatorInputProps = NumericCalculatorInputProps | TextCalculatorInputProps;

export function CalculatorInput(props: CalculatorInputProps) {
  const { id, label, type } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'text') {
      (props as TextCalculatorInputProps).onChange(e.target.value);
    } else {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        (props as NumericCalculatorInputProps).onChange(value);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {type === 'currency' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
        )}
        <Input
          id={id}
          type={type === 'text' ? 'text' : 'number'}
          value={props.value}
          onChange={handleChange}
          min={type !== 'text' ? props.min : undefined}
          max={type !== 'text' ? props.max : undefined}
          step={type !== 'text' ? props.step ?? (type === 'percent' ? 0.1 : 1) : undefined}
          className={type === 'currency' ? 'pl-7' : undefined}
        />
        {type === 'percent' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        )}
      </div>
    </div>
  );
}