import { calculatorGroups } from '@/lib/calculator-groups';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fin-calcs.com';

  // Home page
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ];

  // Group pages
  calculatorGroups.forEach((group) => {
    routes.push({
      url: `${baseUrl}/calculators/${group.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    });

    // Calculator pages within each group
    group.calculators.forEach((calculator) => {
      routes.push({
        url: `${baseUrl}${calculator.path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    });
  });

  return routes;
}