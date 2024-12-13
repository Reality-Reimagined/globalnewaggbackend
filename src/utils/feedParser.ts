import type { Article, FeedSource } from '../types';

class BrowserRSSParser {
  async parseURL(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      return this.parseDocument(xmlDoc);
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      throw error;
    }
  }

  private parseDocument(xmlDoc: Document): any {
    // Try RSS 2.0 format first
    let items = this.parseRSS2(xmlDoc);
    
    // If no items found, try Atom format
    if (items.length === 0) {
      items = this.parseAtom(xmlDoc);
    }

    return { items };
  }

  private parseRSS2(xmlDoc: Document): any[] {
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    return items.map(item => this.parseItem(item));
  }

  private parseAtom(xmlDoc: Document): any[] {
    const entries = Array.from(xmlDoc.querySelectorAll('entry'));
    return entries.map(entry => ({
      title: this.getElementText(entry, 'title'),
      link: this.getElementAttribute(entry, 'link', 'href') || '',
      pubDate: this.getElementText(entry, 'published') || this.getElementText(entry, 'updated'),
      content: this.getElementText(entry, 'content') || this.getElementText(entry, 'summary'),
      contentSnippet: this.getElementText(entry, 'summary'),
      guid: this.getElementText(entry, 'id'),
      categories: Array.from(entry.querySelectorAll('category')).map(cat => 
        cat.getAttribute('term') || cat.textContent || ''
      ),
      isoDate: new Date(
        this.getElementText(entry, 'published') || 
        this.getElementText(entry, 'updated') || ''
      ).toISOString(),
    }));
  }

  private parseItem(item: Element): any {
    return {
      title: this.getElementText(item, 'title'),
      link: this.getElementText(item, 'link'),
      pubDate: this.getElementText(item, 'pubDate'),
      content: this.getContent(item),
      contentSnippet: this.getElementText(item, 'description'),
      guid: this.getElementText(item, 'guid') || this.getElementText(item, 'link'),
      categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || ''),
      isoDate: new Date(this.getElementText(item, 'pubDate') || '').toISOString(),
      media: this.getMediaContent(item),
      thumbnail: this.getMediaThumbnail(item),
    };
  }

  private getContent(item: Element): string {
    // Try different content elements in order of preference
    const contentElements = [
      'content:encoded',
      'content',
      'description',
      'summary'
    ];

    for (const elementName of contentElements) {
      try {
        const content = item.getElementsByTagName(elementName)[0]?.textContent;
        if (content) return content;
      } catch (error) {
        continue;
      }
    }

    return '';
  }

  private getElementText(parent: Element, tagName: string): string {
    try {
      const element = parent.getElementsByTagName(tagName)[0];
      return element?.textContent || '';
    } catch (error) {
      return '';
    }
  }

  private getElementAttribute(parent: Element, tagName: string, attr: string): string {
    try {
      const element = parent.getElementsByTagName(tagName)[0];
      return element?.getAttribute(attr) || '';
    } catch (error) {
      return '';
    }
  }

  private getMediaContent(item: Element): { $: { url: string } } | undefined {
    try {
      const mediaContent = Array.from(item.getElementsByTagName('media:content'))[0] ||
                          Array.from(item.getElementsByTagName('enclosure'))[0];
      const url = mediaContent?.getAttribute('url');
      return url ? { $: { url } } : undefined;
    } catch (error) {
      return undefined;
    }
  }

  private getMediaThumbnail(item: Element): { $: { url: string } } | undefined {
    try {
      const thumbnail = Array.from(item.getElementsByTagName('media:thumbnail'))[0];
      const url = thumbnail?.getAttribute('url');
      return url ? { $: { url } } : undefined;
    } catch (error) {
      return undefined;
    }
  }
}

export const parser = new BrowserRSSParser();