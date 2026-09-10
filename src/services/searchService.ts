import { SearchResultItem } from '../types';
import { siteContent } from '../data/siteContent';

// Interface defining the search service provider contract
export interface SearchProvider {
  search(query: string, category?: string): Promise<SearchResultItem[]>;
}

// Built-in ALLORA Discovery Index: indexes our tools, movies, social networks + web catalog
const buildLocalCatalog = (): SearchResultItem[] => {
  const items: SearchResultItem[] = [];

  // Index Tools
  siteContent.essentialTools.forEach(tool => {
    items.push({
      id: `tool-${tool.id}`,
      title: tool.name,
      description: tool.shortDescription,
      category: 'Essential Tools',
      sourceDomain: 'allora.app/tools',
      url: `#tools-${tool.id}`,
      tags: tool.tags,
      type: 'tool',
    });
  });

  // Index Movies
  siteContent.movies.forEach(movie => {
    items.push({
      id: `movie-${movie.id}`,
      title: `${movie.title} (${movie.releaseYear})`,
      description: movie.shortDescription,
      category: 'Movies',
      sourceDomain: 'cinema.allora.app',
      url: `#movies-${movie.id}`,
      rating: movie.rating,
      tags: movie.genre,
      type: 'movie',
    });
  });

  // Index Social
  siteContent.socialPlatforms.forEach(social => {
    items.push({
      id: `social-${social.id}`,
      title: `${social.name} Platform`,
      description: social.shortDescription,
      category: 'Social Media',
      sourceDomain: new URL(social.url).hostname,
      url: social.url,
      tags: [social.name, 'Social', 'Community'],
      type: 'social',
    });
  });

  // Index Web discoveries (realistic web catalog items for rich general queries like 'sci-fi', 'weather', 'news', 'calculator')
  const webCatalog: SearchResultItem[] = [
    {
      id: 'web-1',
      title: 'Top Sci-Fi Cinematography & Visual Arts 2026',
      description: 'Comprehensive analysis of cinematic lighting, world-building, and digital set extensions in modern cinema.',
      category: 'Movies',
      sourceDomain: 'filmjournal.org',
      url: 'https://filmjournal.org',
      rating: 9.3,
      tags: ['Sci-Fi', 'Cinema', 'Guide'],
      type: 'external',
    },
    {
      id: 'web-2',
      title: 'Modern Web Performance & Client-Side Utility Architecture',
      description: 'How modern zero-latency in-browser web utilities replace heavy server-dependent web applications.',
      category: 'Essential Tools',
      sourceDomain: 'devtech.io/insights',
      url: 'https://devtech.io',
      tags: ['Engineering', 'Performance', 'Tools'],
      type: 'external',
    },
    {
      id: 'web-3',
      title: 'Next-Generation Social Media Protocols and Creator Economies',
      description: 'A deep dive into decentralization, algorithmic transparency, and how communities are organizing online.',
      category: 'Social Media',
      sourceDomain: 'technetwork.media',
      url: 'https://technetwork.media',
      tags: ['Social', 'Trends', 'Creators'],
      type: 'external',
    },
    {
      id: 'web-4',
      title: 'Real-Time QR & Barcode Matrix Standards',
      description: 'Official ISO specifications for high-density error-correction matrix codes and contactless transmission.',
      category: 'Essential Tools',
      sourceDomain: 'standards.iso.org',
      url: 'https://iso.org',
      tags: ['QR Code', 'Matrix', 'Documentation'],
      type: 'external',
    },
    {
      id: 'web-5',
      title: 'Cyberpunk & Speculative Fiction Literature Archive',
      description: 'Historical archive and contemporary database of cyberpunk media, literature, and visual design styles.',
      category: 'Movies',
      sourceDomain: 'cyberarchive.net',
      url: 'https://cyberarchive.net',
      rating: 8.8,
      tags: ['Cyberpunk', 'Media', 'Literature'],
      type: 'external',
    },
  ];

  return [...items, ...webCatalog];
};

class AlloraSearchService implements SearchProvider {
  private catalog: SearchResultItem[] = buildLocalCatalog();

  /**
   * Search method:
   * Ready for real search API integration (Google Custom Search, Bing Web Search, or Supabase full-text search).
   * Currently queries the robust, categorized ALLORA indexed catalog.
   */
  async search(query: string, category: string = 'All'): Promise<SearchResultItem[]> {
    // Simulate natural network latency for responsive UI feel
    await new Promise(resolve => setTimeout(resolve, 240));

    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    let results = this.catalog.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
      const matchDomain = item.sourceDomain.toLowerCase().includes(cleanQuery);
      return matchTitle || matchDesc || matchTags || matchDomain;
    });

    // If exact keyword match yielded few results, do partial token match
    if (results.length === 0) {
      const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);
      results = this.catalog.filter(item => {
        const fullText = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.sourceDomain}`.toLowerCase();
        return tokens.some(token => fullText.includes(token));
      });
    }

    // Filter by Category if specified
    if (category && category !== 'All') {
      results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    return results;
  }
}

export const searchService = new AlloraSearchService();
