import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { calculateRankedCompanies } from "../utils/analysis";
import { preparePieChartData } from "../utils/chartData";
import { PieChart } from "./charts/PieChart";
import type { CompanyAnalysisResponse } from "../types/api";

interface ResultsProps {
  data: CompanyAnalysisResponse;
  onBack: () => void;
}

export function Results({ data, onBack }: ResultsProps) {
  const rankedCompanies = calculateRankedCompanies(data.agentResponses || []);

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
        <h2 className="text-3xl font-bold mb-2">Analysis Results</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis with rankings and visualizations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Rankings Table</TabsTrigger>
            <TabsTrigger value="charts">Question Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            <div className="bg-card rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead className="text-center">Mentions</TableHead>
                    <TableHead className="text-center">% of Mentions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedCompanies.map((company, index) => (
                    <motion.tr
                      key={company.companyName}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <img
                          src={`https://cdn.brandfetch.io/${company.domain}/w/400/h/400?c=1idN2eYLKB0hVXPuRKG`}
                          alt={company.companyName}
                          className="w-8 h-8 rounded-full object-contain bg-white border"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                        {company.companyName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.domain}
                      </TableCell>
                      <TableCell className="text-center">
                        {company.mentionCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">
                            {company.percentageMentions.toFixed(1)}%
                          </span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${company.percentageMentions}%`,
                              }}
                              transition={{
                                delay: 0.8 + index * 0.1,
                                duration: 0.5,
                              }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-6">
            <div className="space-y-12">
              {data.agentResponses?.map((response, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-card rounded-lg border p-8"
                >
                  <PieChart
                    data={preparePieChartData(response)}
                    title={response.question}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
