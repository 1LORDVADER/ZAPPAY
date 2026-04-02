/**
 * AI Strain Recommendations Component
 * Allows users to input their desired effects and get AI-powered product recommendations.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const EFFECT_OPTIONS = [
  "Relaxation", "Sleep", "Pain Relief", "Anxiety Relief", "Focus",
  "Creativity", "Energy", "Euphoria", "Appetite", "Mood Boost",
];

const CATEGORY_OPTIONS = [
  { value: "any", label: "Any Category" },
  { value: "flower", label: "Flower" },
  { value: "edibles", label: "Edibles" },
  { value: "concentrates", label: "Concentrates" },
  { value: "pre-rolls", label: "Pre-Rolls" },
  { value: "vapes", label: "Vapes" },
  { value: "hemp", label: "Hemp / CBD" },
];

const THC_OPTIONS = [
  { value: "any", label: "Any THC Level" },
  { value: "low", label: "Low (0–10%)" },
  { value: "medium", label: "Medium (10–20%)" },
  { value: "high", label: "High (20%+)" },
];

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "experienced", label: "Experienced" },
];

type RecommendationInput = {
  desiredEffects: string[];
  preferredCategory: "flower" | "edibles" | "concentrates" | "pre-rolls" | "vapes" | "hemp" | "any";
  thcPreference: "low" | "medium" | "high" | "any";
  experienceLevel: "beginner" | "intermediate" | "experienced";
};

export function StrainRecommendations() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [input, setInput] = useState<RecommendationInput>({
    desiredEffects: [],
    preferredCategory: "any",
    thcPreference: "any",
    experienceLevel: "intermediate",
  });

  const { data, isLoading, refetch } = (trpc as any).recommendations.getStrainRecommendations.useQuery(
    input,
    { enabled: false } // only run when user explicitly requests
  );

  const toggleEffect = (effect: string) => {
    setInput((prev) => ({
      ...prev,
      desiredEffects: prev.desiredEffects.includes(effect)
        ? prev.desiredEffects.filter((e) => e !== effect)
        : prev.desiredEffects.length < 5
        ? [...prev.desiredEffects, effect]
        : prev.desiredEffects,
    }));
  };

  const handleGetRecommendations = async () => {
    if (input.desiredEffects.length === 0) return;
    setHasSearched(true);
    refetch();
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-900">AI Strain Advisor</CardTitle>
              <CardDescription>
                Tell us what you need — we'll find the right match
              </CardDescription>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0 space-y-5">
              {/* Desired Effects */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Desired Effects <span className="text-slate-400 font-normal">(select up to 5)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {EFFECT_OPTIONS.map((effect) => (
                    <button
                      key={effect}
                      onClick={() => toggleEffect(effect)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        input.desiredEffects.includes(effect)
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={input.preferredCategory}
                    onChange={(e) =>
                      setInput((prev) => ({ ...prev, preferredCategory: e.target.value as any }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">THC Level</label>
                  <select
                    value={input.thcPreference}
                    onChange={(e) =>
                      setInput((prev) => ({ ...prev, thcPreference: e.target.value as any }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {THC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Experience</label>
                  <select
                    value={input.experienceLevel}
                    onChange={(e) =>
                      setInput((prev) => ({ ...prev, experienceLevel: e.target.value as any }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleGetRecommendations}
                disabled={input.desiredEffects.length === 0 || isLoading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding your perfect strains...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Recommendations
                  </>
                )}
              </Button>

              {/* Results */}
              {hasSearched && !isLoading && data && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {data.reasoning && (
                    <p className="text-sm text-slate-600 italic border-l-4 border-blue-300 pl-3">
                      {data.reasoning}
                    </p>
                  )}

                  {data.recommendations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No matching products found for your preferences. Try adjusting your selections.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.recommendations.map((rec: any, idx: number) => (
                        <Link key={rec.productId} href={`/product/${rec.productId}`}>
                          <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-semibold text-slate-800 text-sm">
                                  {rec.productName}
                                </span>
                                {rec.product?.category && (
                                  <Badge variant="secondary" className="capitalize text-xs">
                                    {rec.product.category}
                                  </Badge>
                                )}
                                {rec.product?.thcPercentage && (
                                  <Badge className="bg-green-100 text-green-700 text-xs border border-green-200">
                                    THC {rec.product.thcPercentage}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {rec.matchReason}
                              </p>
                            </div>
                            {rec.product?.photos ? (
                              <img
                                src={(() => {
                                  try {
                                    const photos =
                                      typeof rec.product.photos === "string"
                                        ? JSON.parse(rec.product.photos)
                                        : rec.product.photos;
                                    return Array.isArray(photos) ? photos[0] : rec.product.photos;
                                  } catch {
                                    return rec.product.photos;
                                  }
                                })()}
                                alt={rec.productName}
                                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Leaf className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
