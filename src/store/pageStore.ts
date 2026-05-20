import { create } from 'zustand';
import { API_BASE } from '@/config/api';

// ==========================================
// COMPLETE TYPE DEFINITIONS
// ==========================================

export interface PageHeroSection {
    over_title: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link?: string;
    image_url: string;
}

export interface AboutSection {
    section_title: string;
    description_1: string;
    description_2: string;
    quote: string;
    image_url: string;
}

export interface AboutSectionTwo {
    is_enabled: boolean;
    title: string;
    description_p1: string;
    description_p2: string;
    quote: string;
    image_1: string;
    image_2: string;
}

export interface HeritageSection {
    section_title: string;
    section_subtitle: string;
    features: Array<{
        icon?: string;
        title: string;
        description: string;
    }>;
}

export interface HeritageFeaturesSection {
    is_enabled: boolean;
    section_title: string;
    section_subtitle: string;
    features: Array<{
        title: string;
        description: string;
    }>;
}

export interface MastersVoiceSection {
    is_enabled: boolean;
    label?: string;
    quote: string;
    name?: string;
    designation?: string;
    description: string;
    image_url: string;
    over_title?: string;
    title?: string;
    weaver_name?: string;
    weaver_role?: string;
    stat_number?: string;
    stat_label?: string;
    experience_badge?: {
        number: string;
        text: string;
    };
}

export interface TrustedHeritageSection {
    is_enabled?: boolean;
    badge_text: string;
    title?: string;
    description?: string;
    overline?: string;
    headline?: string;
    trust_cards?: Array<{
        title: string;
        description: string;
    }>;
    cards?: Array<{
        title: string;
        text: string;
    }>;
    feature_pills?: string[];
}

export interface OccasionSection {
    section_tag: string;
    section_title: string;
    section_description: string;
}

export interface Occasion {
    occasion_id: number;
    name: string;
    slug: string;
    title: string;
    description: string;
    image_url: string;
    button_text: string;
    redirect_url: string;
    sort_order: number;
    is_active: boolean;
}

export interface FeaturedProductsSection {
    is_enabled: boolean;
    section_tag: string;
    section_title: string;
    section_description: string;
}

export interface NarrativeSection {
    is_enabled: boolean;
    quote: string;
    author: string;
}

export interface NewsletterSection {
    is_enabled: boolean;
    title?: string;
    subtitle?: string;
    placeholder?: string;
    button_text?: string;
}

export interface TestimonialsSection {
    is_enabled: boolean;
}

export interface TrustBadgesSection {
    is_enabled: boolean;
    badges: Array<{
        title: string;
        icon: string;
    }>;
}

export interface ContactCard {
    type: string;
    title: string;
    subtitle: string;
    value: string;
    action_text: string;
    action_link: string;
    icon: string;
}

export interface ContactCardsSection {
    section_title: string;
    cards: ContactCard[];
}

export interface ContactFormField {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    options?: string[];
    required: boolean;
}

export interface ContactFormSection {
    is_enabled: boolean;
    section_title: string;
    section_subtitle: string;
    fields: ContactFormField[];
    submit_button_text: string;
}

export interface ThemeSettings {
    primary_color: string;
    background_style: string;
}

export interface CustomContent {
    html: string;
}

export interface SEOData {
    meta_title: string;
    meta_description: string;
    og_image: string;
    canonical_url: string;
}

export interface PageItem {
    page_id?: string;
    title: string;
    slug: string;
    hero_section?: PageHeroSection;
    banner_image?: string;
    content?: string;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    status?: string;
    seo?: SEOData;
    
    // About page sections
    about_section?: AboutSection;
    heritage_section?: HeritageSection;
    trusted_heritage_section?: TrustedHeritageSection;
    masters_voice_section?: MastersVoiceSection;
    testimonial_section?: TestimonialsSection;
    newsletter_section?: NewsletterSection;
    theme_settings?: ThemeSettings;
    custom_html_section?: CustomContent;
    
    // Heritage page sections
    about_section_two?: AboutSectionTwo;
    heritage_features_section?: HeritageFeaturesSection;
    testimonials_section?: TestimonialsSection;
    custom_content?: CustomContent;
    
    // Occasions page sections
    occasion_section?: OccasionSection;
    occasions?: Occasion[];
    featured_products_section?: FeaturedProductsSection;
    narrative_section?: NarrativeSection;

    // Contact page sections
    trust_badges_section?: TrustBadgesSection;
    contact_cards_section?: ContactCardsSection;
    contact_form_section?: ContactFormSection;
}

interface PageState {
    pages: Record<string, PageItem | null>;
    loading: Record<string, boolean>;
    errors: Record<string, string | null>;
    fetchPageBySlug: (slug: string) => Promise<PageItem | null>;
    fetchContactPage: () => Promise<PageItem | null>;
    clearPage: (slug: string) => void;
}

const API_BASE_URL = API_BASE;

export const usePageStore = create<PageState>((set, get) => ({
    pages: {},
    loading: {},
    errors: {},

    fetchPageBySlug: async (slug: string): Promise<PageItem | null> => {
        // Check if already loading
        if (get().loading[slug]) return null;
        
        // Return cached page if exists
        const currentPages = get().pages;
        if (currentPages[slug] !== undefined) return currentPages[slug];

        set(state => ({ 
            loading: { ...state.loading, [slug]: true },
            errors: { ...state.errors, [slug]: null }
        }));
        
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`[PageStore] Page not found: ${slug}`);
                    set(state => ({
                        pages: { ...state.pages, [slug]: null },
                        loading: { ...state.loading, [slug]: false },
                        errors: { ...state.errors, [slug]: 'Page not found' }
                    }));
                    return null;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json() as { success: boolean; data: PageItem; message?: string };
            
            if (result.success && result.data) {
                const pageData = result.data;
                
                // Parse JSON string fields if they exist
                const jsonFields: (keyof PageItem)[] = [
                    'hero_section', 'about_section', 'heritage_section', 
                    'trusted_heritage_section', 'masters_voice_section', 
                    'theme_settings', 'newsletter_section', 'testimonial_section',
                    'testimonials_section', 'occasion_section', 'featured_products_section',
                    'narrative_section', 'about_section_two', 'heritage_features_section',
                    'custom_content', 'custom_html_section', 'trust_badges_section',
                    'contact_cards_section', 'contact_form_section'
                ];
                
                for (const field of jsonFields) {
                    const value = pageData[field];
                    if (value && typeof value === 'string') {
                        try {
                            try {
                                (pageData[field] as unknown) = JSON.parse(value);
                            } catch (e) {
                                // Try cleaning invalid single quote escapes (e.g. \')
                                const cleaned = value.replace(/\\'/g, "'");
                                (pageData[field] as unknown) = JSON.parse(cleaned);
                            }
                        } catch (e) {
                            console.warn(`Failed to parse ${String(field)} for page ${slug}`);
                        }
                    }
                }
                
                set(state => ({
                    pages: { ...state.pages, [slug]: pageData },
                    loading: { ...state.loading, [slug]: false }
                }));
                return pageData;
            } else {
                throw new Error(result.message || 'Failed to fetch page');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load page';
            console.error(`[PageStore] Error fetching slug '${slug}':`, err);
            set(state => ({
                pages: { ...state.pages, [slug]: null },
                loading: { ...state.loading, [slug]: false },
                errors: { ...state.errors, [slug]: errorMessage }
            }));
            return null;
        }
    },

    fetchContactPage: async (): Promise<PageItem | null> => {
        const slug = 'contact-us';
        if (get().loading[slug]) return null;
        const currentPages = get().pages;
        if (currentPages[slug] !== undefined) return currentPages[slug];

        set(state => ({
            loading: { ...state.loading, [slug]: true },
            errors: { ...state.errors, [slug]: null }
        }));

        try {
            const response = await fetch(`${API_BASE_URL}/contact-us`);
            if (!response.ok) {
                if (response.status === 404) {
                    set(state => ({
                        pages: { ...state.pages, [slug]: null },
                        loading: { ...state.loading, [slug]: false },
                        errors: { ...state.errors, [slug]: 'Page not found' }
                    }));
                    return null;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json() as { success: boolean; data: PageItem; message?: string };
            if (result.success && result.data) {
                set(state => ({
                    pages: { ...state.pages, [slug]: result.data },
                    loading: { ...state.loading, [slug]: false }
                }));
                return result.data;
            }
            throw new Error(result.message || 'Failed to fetch contact page');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load page';
            set(state => ({
                pages: { ...state.pages, [slug]: null },
                loading: { ...state.loading, [slug]: false },
                errors: { ...state.errors, [slug]: errorMessage }
            }));
            return null;
        }
    },

    clearPage: (slug: string): void => {
        set(state => {
            const { [slug]: _, ...remainingPages } = state.pages;
            const { [slug]: __, ...remainingLoading } = state.loading;
            const { [slug]: ___, ...remainingErrors } = state.errors;
            return {
                pages: remainingPages,
                loading: remainingLoading,
                errors: remainingErrors
            };
        });
    }
}));