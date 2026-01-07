/**
 * CHE·NU™ - Theme Switcher Component
 * 
 * Beautiful theme switcher with:
 * - 4 theme buttons
 * - Visual preview
 * - Smooth animations
 * - Tooltips
 */

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { themeList, ThemeId, getThemeIcon } from './themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// THEME SWITCHER (DROPDOWN VERSION)
// ═══════════════════════════════════════════════════════════════════════════

export const ThemeSwitcher: React.FC = () => {
  const { theme, themeId, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 transition-all"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">{theme.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">
            Choose Theme
          </div>
          {themeList.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="cursor-pointer px-3 py-2 rounded-lg mb-1"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getThemeIcon(t.id)}</span>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.atmosphere}</div>
                  </div>
                </div>
                {themeId === t.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THEME SWITCHER (INLINE BUTTONS VERSION)
// ═══════════════════════════════════════════════════════════════════════════

export const ThemeSwitcherInline: React.FC = () => {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
      {themeList.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={`${t.name} - ${t.atmosphere}`}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-all
            ${
              themeId === t.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="mr-1.5">{getThemeIcon(t.id)}</span>
          {t.name}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THEME SWITCHER (COMPACT ICONS VERSION)
// ═══════════════════════════════════════════════════════════════════════════

export const ThemeSwitcherCompact: React.FC = () => {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-white rounded-lg border">
      {themeList.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={`${t.name} - ${t.atmosphere}`}
          className={`
            w-10 h-10 rounded-md text-lg transition-all
            flex items-center justify-center
            ${
              themeId === t.id
                ? 'bg-blue-500 text-white shadow-md scale-110'
                : 'bg-gray-100 hover:bg-gray-200'
            }
          `}
        >
          {getThemeIcon(t.id)}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THEME PREVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════

interface ThemePreviewCardProps {
  themeId: ThemeId;
  onClick?: () => void;
  isActive?: boolean;
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  themeId,
  onClick,
  isActive,
}) => {
  const t = themeList.find((theme) => theme.id === themeId)!;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 transition-all text-left
        hover:shadow-lg hover:scale-105
        ${
          isActive
            ? 'border-blue-500 shadow-md'
            : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getThemeIcon(t.id)}</span>
          <div className="font-bold text-lg">{t.name}</div>
        </div>
        {isActive && <Check className="w-5 h-5 text-green-600" />}
      </div>

      {/* Atmosphere */}
      <div className="text-sm text-gray-600 mb-3">{t.atmosphere}</div>

      {/* Color Preview */}
      <div className="flex gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: t.colors.bgPrimary }}
        />
        <div
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: t.colors.accentPrimary }}
        />
        <div
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: t.colors.textPrimary }}
        />
      </div>

      {/* Radius Preview */}
      <div className="text-xs text-gray-500">
        Radius: {t.radius.md} • Shadow: {t.shadows.sm.split(' ')[1]}
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THEME GRID SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

export const ThemeGridSelector: React.FC = () => {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {themeList.map((t) => (
        <ThemePreviewCard
          key={t.id}
          themeId={t.id}
          onClick={() => setTheme(t.id)}
          isActive={themeId === t.id}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default ThemeSwitcher;
