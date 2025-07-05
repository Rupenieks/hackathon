import React from "react";
import type { DomainComparisonResponse } from "../types/api";

interface DomainComparisonProps {
  data: DomainComparisonResponse["data"];
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({ data }) => {
  if (!data) return null;

  const { analyzedDomain, competitorAnalyses, overallInsights } = data;

  return (
    <div className="space-y-6">
      {/* Overall Insights */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="font-semibold text-lg">Overall Analysis Insights</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {overallInsights}
        </p>
      </div>

      {/* Our Domain Analysis */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🏠</span>
          <h3 className="font-semibold text-lg">{analyzedDomain.domain}</h3>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Page Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Title:</strong> {analyzedDomain.title}
                </p>
                <p>
                  <strong>Description:</strong> {analyzedDomain.description}
                </p>
                <p>
                  <strong>Content Length:</strong>{" "}
                  {analyzedDomain.content.length.toLocaleString()} characters
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Load Time:</strong>{" "}
                  {analyzedDomain.performance.loadTime}ms
                </p>
                <p>
                  <strong>DOM Content Loaded:</strong>{" "}
                  {analyzedDomain.performance.domContentLoaded.toFixed(2)}ms
                </p>
                <p>
                  <strong>Scripts:</strong> {analyzedDomain.resources.scripts}
                </p>
                <p>
                  <strong>Images:</strong> {analyzedDomain.resources.images}
                </p>
              </div>
            </div>
          </div>

          {/* Content Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">
                Content Strengths
              </h4>
              <ul className="space-y-2">
                {analyzedDomain.analysis.contentStrengths.map(
                  (strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-600">
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {analyzedDomain.analysis.contentWeaknesses.map(
                  (weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">⚠</span>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Performance Analysis */}
          <div>
            <h4 className="font-semibold mb-3">Performance Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {analyzedDomain.analysis.performanceAnalysis}
            </p>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">
                SEO Recommendations
              </h4>
              <ul className="space-y-2">
                {analyzedDomain.analysis.seoRecommendations.map(
                  (rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">🔧</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-600">
                Content Recommendations
              </h4>
              <ul className="space-y-2">
                {analyzedDomain.analysis.contentRecommendations.map(
                  (rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">📝</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Competitor Analysis</h3>
        {competitorAnalyses.map((competitor, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card text-card-foreground shadow p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🏢</span>
              <h4 className="font-semibold text-lg">{competitor.domain}</h4>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Page Information</h5>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Title:</strong> {competitor.title}
                    </p>
                    <p>
                      <strong>Description:</strong> {competitor.description}
                    </p>
                    <p>
                      <strong>Content Length:</strong>{" "}
                      {competitor.content.length.toLocaleString()} characters
                    </p>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Performance Metrics</h5>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Load Time:</strong>{" "}
                      {competitor.performance.loadTime}ms
                    </p>
                    <p>
                      <strong>DOM Content Loaded:</strong>{" "}
                      {competitor.performance.domContentLoaded.toFixed(2)}ms
                    </p>
                    <p>
                      <strong>Scripts:</strong> {competitor.resources.scripts}
                    </p>
                    <p>
                      <strong>Images:</strong> {competitor.resources.images}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-blue-600">
                    Key Differences from Our Domain
                  </h5>
                  <ul className="space-y-2">
                    {competitor.analysis.keyDifferences.map((diff, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">⚡</span>
                        <span className="text-sm">{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-green-600">
                    Competitor Strengths
                  </h5>
                  <ul className="space-y-2">
                    {competitor.analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-red-600">
                    Competitor Weaknesses
                  </h5>
                  <ul className="space-y-2">
                    {competitor.analysis.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-purple-600">
                    Lessons We Can Learn
                  </h5>
                  <ul className="space-y-2">
                    {competitor.analysis.lessonsLearned.map((lesson, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">🎓</span>
                        <span className="text-sm">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Performance Comparison */}
              <div className="border-t pt-4">
                <h5 className="font-semibold mb-3">Performance Comparison</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Load Time:</strong>
                    </p>
                    <p className="text-muted-foreground">
                      {competitor.performance.loadTime}ms vs{" "}
                      {analyzedDomain.performance.loadTime}ms
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Content Length:</strong>
                    </p>
                    <p className="text-muted-foreground">
                      {competitor.content.length.toLocaleString()} vs{" "}
                      {analyzedDomain.content.length.toLocaleString()} chars
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
