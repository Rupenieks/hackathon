import { motion } from "framer-motion";
import { ArrowLeft, Play, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useQuestionOptimization } from "../hooks/useQuestionOptimization";
import type { CompanyAnalysisResponse } from "../types/api";

interface QuestionOptimizationProps {
  originalData: CompanyAnalysisResponse;
  targetDomain: string;
  onBack: () => void;
}

export function QuestionOptimization({
  originalData,
  targetDomain,
  onBack,
}: QuestionOptimizationProps) {
  const {
    optimizeQuestions,
    isLoading,
    currentIteration,
    results,
    isComplete,
    reset,
  } = useQuestionOptimization();

  const handleStartOptimization = async () => {
    try {
      await optimizeQuestions({
        targetDomain,
        originalQuestions: originalData.searchQuestions || [],
        currentResults: originalData,
      });
    } catch (error) {
      console.error("Failed to start optimization:", error);
    }
  };

  const handleContinueOptimization = async () => {
    try {
      const lastResult = results[results.length - 1];
      if (!lastResult) return;

      const usedQuestions = results.flatMap((r) => r?.newQuestions || []);

      await optimizeQuestions({
        targetDomain,
        originalQuestions: originalData.searchQuestions || [],
        usedQuestions,
        currentResults: {
          success: true,
          agentResponses: lastResult.agentResponses,
        },
        iteration: results.length + 1,
      });
    } catch (error) {
      console.error("Failed to continue optimization:", error);
    }
  };

  const getTotalMentions = (agentResponses: any[]) => {
    return agentResponses.reduce((total, response) => {
      return total + (response.recommendations?.length || 0);
    }, 0);
  };

  const getTargetMentions = (agentResponses: any[]) => {
    return agentResponses.reduce((total, response) => {
      const mentions =
        response.recommendations?.filter(
          (rec: any) => rec.domain === targetDomain
        ).length || 0;
      return total + mentions;
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4"></div>
        <h2 className="text-3xl font-bold mb-2">Question Optimization</h2>
        <p className="text-muted-foreground">
          Recursively optimize search questions to improve visibility for{" "}
          {targetDomain}
        </p>
      </motion.div>

      {/* Initial State */}
      {results.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate optimized search questions to improve visibility for
                your domain. This will run 3 iterations automatically.
              </p>
              <Button
                onClick={handleStartOptimization}
                size="lg"
                className="w-full"
              >
                Start Optimization
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div>
              <h3 className="text-lg font-semibold">Optimizing Questions</h3>
              <p className="text-muted-foreground">
                Iteration {currentIteration} of 3 - Generating new questions...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {results.map((result, index) => {
            if (!result) return null;

            const totalMentions = getTotalMentions(result.agentResponses);
            const targetMentions = getTargetMentions(result.agentResponses);
            const hitRate =
              totalMentions > 0 ? (targetMentions / totalMentions) * 100 : 0;
            const isImproving = result.analysis?.isImproving || false;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        Iteration {result.iteration}
                        {isImproving ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={isImproving ? "default" : "secondary"}>
                          {hitRate?.toFixed(1)}% hit rate
                        </Badge>
                        <Badge variant="outline">
                          {targetMentions} mentions
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Analysis Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Mentions:
                        </span>
                        <span className="ml-2 font-medium">
                          {totalMentions}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Target Mentions:
                        </span>
                        <span className="ml-2 font-medium">
                          {targetMentions}
                        </span>
                      </div>
                      {result.analysis && (
                        <>
                          <div>
                            <span className="text-muted-foreground">
                              Change:
                            </span>
                            <span
                              className={`ml-2 font-medium ${result.analysis.targetMentionsChange > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {result.analysis.targetMentionsChange > 0
                                ? "+"
                                : ""}
                              {result.analysis.targetMentionsChange}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Hit Rate Change:
                            </span>
                            <span
                              className={`ml-2 font-medium ${result.analysis.hitRateChange > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {result.analysis.hitRateChange > 0 ? "+" : ""}
                              {result.analysis.hitRateChange.toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* New Questions */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        New Questions Generated:
                      </h4>
                      <div className="space-y-2">
                        {result.newQuestions.map((question, qIndex) => (
                          <div
                            key={qIndex}
                            className="text-sm p-2 bg-muted rounded"
                          >
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Company Results */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        Top Companies Found:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.agentResponses
                          .flatMap(
                            (response) =>
                              response.recommendations?.slice(0, 5) || []
                          )
                          .map((company, cIndex) => (
                            <div
                              key={cIndex}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                                company.domain === targetDomain
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-muted"
                              }`}
                            >
                              <img
                                src={`https://cdn.brandfetch.io/${company.domain}/w/400/h/400?c=1idN2eYLKB0hVXPuRKG`}
                                alt={company.companyName}
                                className="w-4 h-4 rounded-full object-contain bg-white border"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                              <span className="font-medium">
                                {company.companyName}
                              </span>
                              {company.domain === targetDomain && (
                                <Badge variant="default" className="text-xs">
                                  Target
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Continue Button */}
          {isComplete && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    Optimization complete! Would you like to continue with more
                    iterations?
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleContinueOptimization} size="lg">
                      Continue Optimization
                    </Button>
                    <Button onClick={reset} variant="outline" size="lg">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
