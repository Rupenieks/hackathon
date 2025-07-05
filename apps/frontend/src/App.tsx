import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useAnalyzeDomain } from "./hooks/useAnalyzeDomain";

function App() {
  const [domain, setDomain] = useState("");
  const analyzeDomain = useAnalyzeDomain();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    analyzeDomain.mutate({ companyUrl: domain });
  };

  if (analyzeDomain.isSuccess) {
    // Log the data to the console for debugging
    // eslint-disable-next-line no-console
    console.log(analyzeDomain.data);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Search Analytics
        </h1>
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
      {analyzeDomain.isSuccess && (
        <pre className="mt-8 w-full max-w-2xl bg-muted p-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(analyzeDomain.data, null, 2)}
        </pre>
      )}
      {analyzeDomain.isError && (
        <div className="mt-4 text-red-500">
          {(analyzeDomain.error as Error).message}
        </div>
      )}
    </div>
  );
}

export default App;
