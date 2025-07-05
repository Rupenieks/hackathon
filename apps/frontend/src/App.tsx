import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useAnalyzeDomain } from "./hooks/useAnalyzeDomain";
import { Results } from "./components/Results";

function App() {
  const [domain, setDomain] = useState("");
  const analyzeDomain = useAnalyzeDomain();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    analyzeDomain.mutate({ companyUrl: domain });
  };

  const handleBack = () => {
    analyzeDomain.reset();
    setDomain("");
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
            key="results"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Results data={analyzeDomain.data} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
