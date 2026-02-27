import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface FilterState {
  thcMin: number;
  thcMax: number;
  cbdMin: number;
  cbdMax: number;
  strainTypes: string[];
  effects: string[];
  categories: string[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const STRAIN_TYPES = ["Indica", "Sativa", "Hybrid"];
const EFFECTS = [
  "Relaxing",
  "Energizing",
  "Pain Relief",
  "Sleep Aid",
  "Focus",
  "Creativity",
  "Euphoric",
  "Uplifting",
];
const CATEGORIES = ["flower", "edibles", "concentrates", "pre-rolls", "vapes"];

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      thcMin: 0,
      thcMax: 40,
      cbdMin: 0,
      cbdMax: 30,
      strainTypes: [],
      effects: [],
      categories: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const activeFilterCount =
    (localFilters.thcMin > 0 || localFilters.thcMax < 40 ? 1 : 0) +
    (localFilters.cbdMin > 0 || localFilters.cbdMax < 30 ? 1 : 0) +
    localFilters.strainTypes.length +
    localFilters.effects.length +
    localFilters.categories.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Product Filters</DialogTitle>
          <DialogDescription>
            Find the perfect cannabis product with precision filtering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* THC Percentage */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">THC Percentage</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12">{localFilters.thcMin}%</span>
              <Slider
                min={0}
                max={40}
                step={1}
                value={[localFilters.thcMin, localFilters.thcMax]}
                onValueChange={([min, max]) =>
                  setLocalFilters({ ...localFilters, thcMin: min, thcMax: max })
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">{localFilters.thcMax}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Filter products by THC content (0-40%)
            </p>
          </div>

          {/* CBD Percentage */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">CBD Percentage</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12">{localFilters.cbdMin}%</span>
              <Slider
                min={0}
                max={30}
                step={1}
                value={[localFilters.cbdMin, localFilters.cbdMax]}
                onValueChange={([min, max]) =>
                  setLocalFilters({ ...localFilters, cbdMin: min, cbdMax: max })
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">{localFilters.cbdMax}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Filter products by CBD content (0-30%)
            </p>
          </div>

          {/* Strain Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Strain Type</Label>
            <div className="flex flex-wrap gap-2">
              {STRAIN_TYPES.map((type) => (
                <Badge
                  key={type}
                  variant={localFilters.strainTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      strainTypes: toggleArrayFilter(localFilters.strainTypes, type),
                    })
                  }
                >
                  {type}
                  {localFilters.strainTypes.includes(type) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Desired Effects</Label>
            <div className="flex flex-wrap gap-2">
              {EFFECTS.map((effect) => (
                <Badge
                  key={effect}
                  variant={localFilters.effects.includes(effect) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      effects: toggleArrayFilter(localFilters.effects, effect),
                    })
                  }
                >
                  {effect}
                  {localFilters.effects.includes(effect) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Product Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={localFilters.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      categories: toggleArrayFilter(localFilters.categories, category),
                    })
                  }
                >
                  {category}
                  {localFilters.categories.includes(category) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
