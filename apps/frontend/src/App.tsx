import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useAnalyzeDomain } from "./hooks/useAnalyzeDomain";
import { useDomainComparison } from "./hooks/useDomainComparison";
import { Results } from "./components/Results";
import { LocaleSelector } from "./components/LocaleSelector";
import { Comparison } from "./components/Comparison";
import { DomainComparison } from "./components/DomainComparison";
import { QuestionOptimization } from "./components/QuestionOptimization";
import { calculateRankedCompanies } from "./utils/analysis";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

function App() {
  const [domain, setDomain] = useState("");
  const [locale, setLocale] = useState("international");
  const [step, setStep] = useState(0); // 0 = results, 1 = comparison, 2 = final step with tabs
  const analyzeDomain = useAnalyzeDomain();
  const [comparisonData, setComparisonData] = useState({
    analyzedDomain: "",
    competitorDomains: [] as string[],
    locale,
  });

  const domainComparison = useDomainComparison(comparisonData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    analyzeDomain.mutate({ companyUrl: domain, locale });
    setStep(0);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    } else {
      analyzeDomain.reset();
      setDomain("");
    }
  };

  const handleDomainComparison = () => {
    if (!analyzeDomain.data) return;

    const rankedCompanies = calculateRankedCompanies(
      analyzeDomain.data.agentResponses || []
    );
    const analyzedDomain = analyzeDomain.data.data?.domain || "";

    // Get top 3 competitors that are above the analyzed domain
    const analyzedCompanyRank = rankedCompanies.findIndex(
      (company) => company.domain === analyzedDomain
    );

    const topCompetitors = rankedCompanies
      .slice(0, Math.min(3, analyzedCompanyRank >= 0 ? analyzedCompanyRank : 3))
      .map((company) => company.domain)
      .filter((domain) => domain !== analyzedDomain);

    // Update the domain comparison hook with the actual data and start the analysis
    setComparisonData({
      analyzedDomain,
      competitorDomains: topCompetitors,
      locale,
    });
    domainComparison.analyzeDomainComparison();
    setStep(2);
  };

  if (analyzeDomain.isSuccess) {
    // Log the data to the console for debugging
    // eslint-disable-next-line no-console
    console.log(analyzeDomain.data);
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!analyzeDomain.isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md space-y-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4 text-center"
              >
                AI Search Analytics
              </motion.h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter company domain (e.g. peec.ai)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <LocaleSelector value={locale} onValueChange={setLocale} />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={analyzeDomain.isPending}
                >
                  {analyzeDomain.isPending ? "Analyzing..." : "Analyze"}
                </Button>
              </form>
              {analyzeDomain.isError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-center"
                >
                  {(analyzeDomain.error as Error).message}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={step === 0 ? "results" : "comparison"}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {step === 0 ? (
              <Results
                data={analyzeDomain.data}
                onBack={handleBack}
                locale={locale}
                onNext={() => setStep(1)}
              />
            ) : step === 1 ? (
              <Comparison
                data={analyzeDomain.data}
                onBack={handleBack}
                onNext={handleDomainComparison}
                locale={locale}
              />
            ) : (
              <div className="min-h-screen w-full max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <Button onClick={handleBack} variant="outline">
                    ← Back
                  </Button>
                </div>
                <Tabs defaultValue="domain-comparison" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="domain-comparison">
                      Domain Comparison
                    </TabsTrigger>
                    <TabsTrigger value="question-optimization">
                      Question Optimization
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="domain-comparison">
                    {domainComparison.isLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">
                          Analyzing domains with Puppeteer and comparing with
                          AI...
                        </p>
                      </div>
                    ) : domainComparison.data ? (
                      <DomainComparison data={domainComparison.data} />
                    ) : domainComparison.error ? (
                      <div className="space-y-4">
                        <p className="text-red-500">{domainComparison.error}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Loading...</p>
                    )}
                  </TabsContent>
                  <TabsContent value="question-optimization">
                    <QuestionOptimization
                      originalData={analyzeDomain.data}
                      targetDomain={analyzeDomain.data.data?.domain || ""}
                      onBack={handleBack}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
