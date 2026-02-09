import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import {
  CookieCategory,
  COOKIE_CATEGORY_LABELS,
  COOKIE_CATEGORY_DESCRIPTIONS,
  COMMON_COOKIES,
  type CookieEntry,
} from './types.ts';

interface CookieInventoryProps {
  cookies: CookieEntry[];
  onUpdate: (cookies: CookieEntry[]) => void;
  selectedCategories: CookieCategory[];
  onCategoriesChange: (categories: CookieCategory[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const EMPTY_COOKIE = (category: CookieCategory): Omit<CookieEntry, 'id'> => ({
  name: '',
  provider: '',
  purpose: '',
  duration: '',
  type: 'first_party',
  category,
});

export function CookieInventory({
  cookies,
  onUpdate,
  selectedCategories,
  onCategoriesChange,
}: CookieInventoryProps) {
  const [expandedCategory, setExpandedCategory] = useState<CookieCategory | null>(null);

  function toggleCategory(cat: CookieCategory) {
    if (selectedCategories.includes(cat)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== cat));
      onUpdate(cookies.filter((c) => c.category !== cat));
      if (expandedCategory === cat) setExpandedCategory(null);
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  }

  function toggleExpand(cat: CookieCategory) {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  }

  function addCookie(category: CookieCategory) {
    const entry: CookieEntry = { id: generateId(), ...EMPTY_COOKIE(category) };
    onUpdate([...cookies, entry]);
  }

  function addCommonCookies(category: CookieCategory) {
    const common = COMMON_COOKIES[category] ?? [];
    const existingNames = new Set(cookies.filter((c) => c.category === category).map((c) => c.name));
    const newCookies = common
      .filter((c) => !existingNames.has(c.name))
      .map((c) => ({ id: generateId(), ...c }));
    if (newCookies.length > 0) {
      onUpdate([...cookies, ...newCookies]);
    }
  }

  function removeCookie(id: string) {
    onUpdate(cookies.filter((c) => c.id !== id));
  }

  function updateCookie(id: string, field: keyof Omit<CookieEntry, 'id' | 'category'>, value: string) {
    onUpdate(
      cookies.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  }

  const categoryCookies = (cat: CookieCategory) => cookies.filter((c) => c.category === cat);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold mb-1">Cookie Categories</h2>
        <p className="text-xs text-muted-foreground">
          Select the categories of cookies your website uses, then add specific cookies for each category.
        </p>
      </div>

      <div className="space-y-2">
        {Object.values(CookieCategory).map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          const isExpanded = expandedCategory === cat;
          const catCookies = categoryCookies(cat);

          return (
            <div key={cat} className="rounded-lg border border-border">
              {/* Category header */}
              <div className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <button
                  type="button"
                  onClick={() => isSelected && toggleExpand(cat)}
                  disabled={!isSelected}
                  className="flex flex-1 items-center gap-2 text-left disabled:opacity-50"
                >
                  {isSelected && isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <span className="text-sm font-medium">{COOKIE_CATEGORY_LABELS[cat]}</span>
                    {isSelected && catCookies.length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({catCookies.length} cookie{catCookies.length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Expanded category: description + cookie list */}
              {isSelected && isExpanded && (
                <div className="border-t border-border px-3 pb-3 pt-2 space-y-3">
                  <p className="text-xs text-muted-foreground">{COOKIE_CATEGORY_DESCRIPTIONS[cat]}</p>

                  {/* Cookie entries */}
                  {catCookies.map((cookie) => (
                    <div key={cookie.id} className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Cookie Details</span>
                        <button
                          type="button"
                          onClick={() => removeCookie(cookie.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Cookie name (e.g., _ga)"
                          value={cookie.name}
                          onChange={(e) => updateCookie(cookie.id, 'name', e.target.value)}
                          className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground"
                        />
                        <input
                          type="text"
                          placeholder="Provider (e.g., Google Analytics)"
                          value={cookie.provider}
                          onChange={(e) => updateCookie(cookie.id, 'provider', e.target.value)}
                          className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Purpose"
                        value={cookie.purpose}
                        onChange={(e) => updateCookie(cookie.id, 'purpose', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Duration (e.g., 1 year, Session)"
                          value={cookie.duration}
                          onChange={(e) => updateCookie(cookie.id, 'duration', e.target.value)}
                          className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground"
                        />
                        <select
                          value={cookie.type}
                          onChange={(e) => updateCookie(cookie.id, 'type', e.target.value)}
                          className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
                        >
                          <option value="first_party">First Party</option>
                          <option value="third_party">Third Party</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addCookie(cat)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent/50"
                    >
                      <Plus className="h-3 w-3" />
                      Add Cookie
                    </button>
                    {(COMMON_COOKIES[cat]?.length ?? 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => addCommonCookies(cat)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent/50"
                      >
                        <Sparkles className="h-3 w-3" />
                        Add Common Cookies
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
