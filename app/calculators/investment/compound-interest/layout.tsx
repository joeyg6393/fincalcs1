import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | fin-calcs.com',
  description: 'Calculate how your investments grow over time with compound interest. See the power of compound growth with our easy-to-use calculator.',
};

export default function CompoundInterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}