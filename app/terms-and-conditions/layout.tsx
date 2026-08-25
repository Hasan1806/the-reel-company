import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | The Reel Company",
  description:
    "Read the Terms & Conditions governing the use of The Reel Company website, services, content and related interactions.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
