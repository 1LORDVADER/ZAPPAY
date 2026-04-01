import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const LEGAL_PAGES = {
  "terms-of-service": {
    title: "Terms of Service",
    file: "/terms-of-service.md",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    file: "/privacy-policy.md",
  },
  "refund-policy": {
    title: "Refund Policy",
    file: "/refund-policy.md",
  },
  "age-verification-policy": {
    title: "Age Verification Policy",
    file: "/age-verification-policy.md",
  },
  "prohibited-use-policy": {
    title: "Prohibited Use Policy",
    file: "/prohibited-use-policy.md",
  },
};

export default function LegalPage() {
  const [, params] = useRoute("/legal/:page");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageKey = params?.page as keyof typeof LEGAL_PAGES;
  const pageInfo = LEGAL_PAGES[pageKey];

  useEffect(() => {
    if (!pageInfo) {
      setError("Page not found");
      setLoading(false);
      return;
    }

    fetch(pageInfo.file)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page");
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageInfo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !pageInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Page not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ZAPPAY Logo"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{pageInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }: { children?: React.ReactNode }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }: { children?: React.ReactNode }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }: { children?: React.ReactNode }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }: { children?: React.ReactNode }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }: { children?: React.ReactNode }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }: { children?: React.ReactNode }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                ),
                li: ({ children }: { children?: React.ReactNode }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }: { children?: React.ReactNode }) => (
                  <strong className="font-bold text-slate-900">{children}</strong>
                ),
                a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-8 border-slate-200" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/legal/terms-of-service"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/privacy-policy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/refund-policy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/age-verification-policy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Age Verification
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/prohibited-use-policy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Prohibited Use
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Email: hello@zappayus.co</li>
                <li>Phone: 1-800-ZAPPAY-1</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About ZAPPAY</h3>
              <p className="text-sm text-slate-300">
                ZAPPAY is a payment processor engineered for the cannabis industry. We facilitate legal transactions between licensed farmers, dispensaries, and consumers — we do not sell products. Just 5.2% per transaction.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>© 2026 ZAPPAY. All rights reserved.</p>
            <p className="mt-2">
              For legal adult use only in states where cannabis is legal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
