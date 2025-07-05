import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";
import { calculateRankedCompanies, getBaseDomain } from "../utils/analysis";
import type { CompanyAnalysisResponse } from "../types/api";

interface ComparisonProps {
  data: CompanyAnalysisResponse;
  onBack: () => void;
  onNext: () => void;
  locale?: string;
}

export function Comparison({ data, onBack, onNext, locale }: ComparisonProps) {
  const rankedCompanies = calculateRankedCompanies(data.agentResponses || []);
  const analyzedDomain = data.data?.domain || "";

  console.log("Analyzed domain", analyzedDomain);
  console.log("Ranked companies", rankedCompanies);

  // Find the rank of the analyzed domain using normalized domain comparison
  const analyzedCompanyRank = rankedCompanies.findIndex(
    (company) => getBaseDomain(company.domain) === getBaseDomain(analyzedDomain)
  );

  const isInTop10 = analyzedCompanyRank >= 0 && analyzedCompanyRank < 10;
  const rankColor = isInTop10 ? "text-green-600" : "text-red-600";
  const rankIcon = isInTop10 ? TrendingUp : TrendingDown;
  const rankText =
    analyzedCompanyRank >= 0 ? `#${analyzedCompanyRank + 1}` : "Not ranked";

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
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl font-bold">Ranking Comparison</h2>
          {locale && locale !== "international" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
              <span>🌍</span>
              <span className="font-medium capitalize">{locale}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground mb-6">
          How {analyzedDomain} performs against top competitors
          {locale && locale !== "international" && (
            <span className="ml-1">in {locale} market</span>
          )}
        </p>

        {/* Your Domain Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg border p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold">Your Domain</h3>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${rankColor} bg-muted`}
            >
              {isInTop10 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{rankText}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={`https://cdn.brandfetch.io/${analyzedDomain}/w/400/h/400?c=1idN2eYLKB0hVXPuRKG`}
              alt={analyzedDomain}
              className="w-16 h-16 rounded-lg object-contain bg-white border"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <h4 className="text-lg font-semibold">{analyzedDomain}</h4>
              <p className="text-muted-foreground">
                {isInTop10
                  ? "Great ranking! Your domain is performing well against competitors."
                  : "Your domain needs improvement to compete with top performers."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top 10 Competitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">Top 10 Competitors</h3>
          <div className="grid gap-4">
            {rankedCompanies.slice(0, 10).map((company, index) => (
              <motion.div
                key={company.companyName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`bg-card rounded-lg border p-4 ${
                  getBaseDomain(company.domain) ===
                  getBaseDomain(analyzedDomain)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <img
                        src={`https://cdn.brandfetch.io/${company.domain}/w/400/h/400?c=1idN2eYLKB0hVXPuRKG`}
                        alt={company.companyName}
                        className="w-12 h-12 rounded-lg object-contain bg-white border"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{company.companyName}</h4>
                      <p className="text-muted-foreground">{company.domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {company.mentionCount} mentions
                    </div>
                    <div className="text-sm font-medium">
                      {company.percentageMentions.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="px-8 py-3 text-lg font-medium"
          >
            Analyze SEO Differences
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
