import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  CMYK,
  cmykToRGB,
  cmykToRGBObject,
  getTextColorForBackground,
  parseCMYK,
  toCMYKString,
} from "@/lib/colorUtils.ts";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Shirt } from "lucide-react";

export function CMYKColorField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}) {
  const [cmyk, setCmyk] = useState<CMYK>(parseCMYK(value));

  // Synchronize local cmyk state with external value prop changes
  useEffect(() => {
    setCmyk(parseCMYK(value));
  }, [value]);

  useEffect(() => {
    if (!disabled && onChange) {
      onChange(toCMYKString(cmyk));
    }
  }, [cmyk]);

  const rgb = cmykToRGBObject(cmyk);
  const textColor = getTextColorForBackground(rgb);

  if (disabled) {
    return (
      <div
        title={toCMYKString(cmyk)}
        className="flex items-center justify-center"
      >
        <Shirt
          className="h-8 w-8 drop-shadow"
          style={{ color: cmykToRGB(cmyk) }}
        />
      </div>
    );
  }

  const update = (key: keyof CMYK, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setCmyk((prev) => ({ ...prev, [key]: num }));
  };

  return (
    <div className="space-y-1">
      <div
        className="grid grid-cols-4 gap-2 rounded px-2 py-1"
        style={{
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
          color: textColor,
        }}
      >
        {(["c", "m", "y", "k"] as const).map((key) => (
          <CMYKChannelInput
            key={key}
            label={
              key === "c"
                ? "Cyan"
                : key === "m"
                  ? "Magenta"
                  : key === "y"
                    ? "Yellow"
                    : "Black"
            }
            value={cmyk[key]}
            onChange={(val) => update(key, val.toString())}
          />
        ))}
      </div>
    </div>
  );
}

type CMYKChannel = "Cyan" | "Magenta" | "Yellow" | "Black";

const colorMap: Record<CMYKChannel, string> = {
  Cyan: "#00b7e8",
  Magenta: "#e01e93",
  Yellow: "#f8e71c",
  Black: "#1c1c1c",
};

export function CMYKChannelInput({
  label,
  value,
  onChange,
}: {
  label: CMYKChannel;
  value: number;
  onChange: (val: number) => void;
}) {
  const color = colorMap[label];

  return (
    <div className="space-y-2">
      <div className="relative">
        <Label
          className="absolute top-0 left-0 flex h-full items-center rounded-l px-2 text-sm font-semibold text-white"
          style={{ color: color }}
        >
          {label}
        </Label>
        <Input
          type="number"
          className="w-full rounded border py-1 pr-2 pl-[4.5rem] text-right text-sm"
          min={0}
          max={100}
          value={value}
          onChange={(e) =>
            onChange(Math.min(100, Math.max(0, Number(e.target.value))))
          }
          style={{ color }}
        />
      </div>
      <Slider
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={([val]) => onChange(val)}
        className="w-full"
      />
    </div>
  );
}
