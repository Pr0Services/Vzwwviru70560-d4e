// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — LAYOUT COMPONENTS
// Container, Stack, Grid, Flex, Divider, Spacer
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, type HTMLAttributes, type CSSProperties } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type JustifyContent = 
  | 'start' 
  | 'center' 
  | 'end' 
  | 'between' 
  | 'around' 
  | 'evenly';

// =============================================================================
// SPACING SCALE
// =============================================================================

const spacingScale: Record<SpacingValue, string> = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// =============================================================================
// CONTAINER COMPONENT
// =============================================================================

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum width */
  size?: ContainerSize;
  
  /** Center horizontally */
  centered?: boolean;
  
  /** Horizontal padding */
  paddingX?: SpacingValue;
  
  /** Vertical padding */
  paddingY?: SpacingValue;
  
  /** As element */
  as?: 'div' | 'section' | 'main' | 'article' | 'aside' | 'header' | 'footer';
}

const containerSizes: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',    // 640px
  md: 'max-w-screen-md',    // 768px
  lg: 'max-w-screen-lg',    // 1024px
  xl: 'max-w-screen-xl',    // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  full: 'max-w-full',
};

/**
 * Container Component
 * 
 * @example
 * ```tsx
 * <Container size="lg" paddingX={4}>
 *   <p>Centered content</p>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      size = 'xl',
      centered = true,
      paddingX = 4,
      paddingY = 0,
      as: Component = 'div',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    return (
      <Component
        ref={ref}
        className={`
          w-full
          ${containerSizes[size]}
          ${centered ? 'mx-auto' : ''}
          ${className}
        `}
        style={{
          paddingLeft: spacingScale[paddingX],
          paddingRight: spacingScale[paddingX],
          paddingTop: spacingScale[paddingY],
          paddingBottom: spacingScale[paddingY],
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// =============================================================================
// STACK COMPONENT
// =============================================================================

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  
  /** Gap between items */
  gap?: SpacingValue;
  
  /** Align items */
  align?: AlignItems;
  
  /** Justify content */
  justify?: JustifyContent;
  
  /** Wrap items */
  wrap?: boolean;
  
  /** Inline stack */
  inline?: boolean;
  
  /** Divider between items */
  divider?: React.ReactNode;
}

const alignMap: Record<AlignItems, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const directionMap: Record<NonNullable<StackProps['direction']>, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

/**
 * Stack Component (VStack/HStack)
 * 
 * @example
 * ```tsx
 * <Stack direction="column" gap={4} align="center">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  function Stack(
    {
      direction = 'column',
      gap = 4,
      align = 'stretch',
      justify = 'start',
      wrap = false,
      inline = false,
      divider,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    // Handle dividers
    let content = children;
    if (divider && React.Children.count(children) > 1) {
      const childArray = React.Children.toArray(children);
      content = childArray.reduce<React.ReactNode[]>((acc, child, index) => {
        if (index > 0) {
          acc.push(
            <React.Fragment key={`divider-${index}`}>
              {divider}
            </React.Fragment>
          );
        }
        acc.push(child);
        return acc;
      }, []);
    }

    return (
      <div
        ref={ref}
        className={`
          ${inline ? 'inline-flex' : 'flex'}
          ${directionMap[direction]}
          ${alignMap[align]}
          ${justifyMap[justify]}
          ${wrap ? 'flex-wrap' : 'flex-nowrap'}
          ${className}
        `}
        style={{
          gap: spacingScale[gap],
          ...style,
        }}
        {...props}
      >
        {content}
      </div>
    );
  }
);

/**
 * VStack - Vertical Stack shorthand
 */
export const VStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>(
  function VStack(props, ref) {
    return <Stack ref={ref} direction="column" {...props} />;
  }
);

/**
 * HStack - Horizontal Stack shorthand
 */
export const HStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>(
  function HStack(props, ref) {
    return <Stack ref={ref} direction="row" {...props} />;
  }
);

// =============================================================================
// GRID COMPONENT
// =============================================================================

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  
  /** Gap between items */
  gap?: SpacingValue;
  
  /** Row gap */
  rowGap?: SpacingValue;
  
  /** Column gap */
  columnGap?: SpacingValue;
  
  /** Align items */
  align?: AlignItems;
  
  /** Justify items */
  justify?: 'start' | 'center' | 'end' | 'stretch';
  
  /** Auto-fit columns */
  autoFit?: boolean;
  
  /** Minimum column width for auto-fit */
  minChildWidth?: string;
}

/**
 * Grid Component
 * 
 * @example
 * ```tsx
 * <Grid columns={3} gap={4}>
 *   <Box>1</Box>
 *   <Box>2</Box>
 *   <Box>3</Box>
 * </Grid>
 * 
 * // Responsive
 * <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
 *   ...
 * </Grid>
 * 
 * // Auto-fit
 * <Grid autoFit minChildWidth="200px" gap={4}>
 *   ...
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  function Grid(
    {
      columns = 1,
      gap = 4,
      rowGap,
      columnGap,
      align,
      justify,
      autoFit = false,
      minChildWidth = '250px',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    const getGridTemplateColumns = (): string => {
      if (autoFit) {
        return `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`;
      }

      if (typeof columns === 'number') {
        return `repeat(${columns}, minmax(0, 1fr))`;
      }

      // For responsive columns, we'll use CSS variables with media queries
      return `repeat(var(--grid-cols, 1), minmax(0, 1fr))`;
    };

    const responsiveStyles: CSSProperties = {};
    
    if (typeof columns === 'object') {
      // We'll handle this with Tailwind classes instead
    }

    const getColumnClasses = (): string => {
      if (autoFit || typeof columns === 'number') return '';

      const classes: string[] = [];
      if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
      if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
      if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
      if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
      
      return classes.join(' ');
    };

    return (
      <div
        ref={ref}
        className={`
          grid
          ${typeof columns === 'number' && !autoFit ? `grid-cols-${columns}` : ''}
          ${getColumnClasses()}
          ${align ? alignMap[align] : ''}
          ${justify ? `justify-items-${justify}` : ''}
          ${className}
        `}
        style={{
          gridTemplateColumns: autoFit ? getGridTemplateColumns() : undefined,
          gap: spacingScale[gap],
          rowGap: rowGap !== undefined ? spacingScale[rowGap] : undefined,
          columnGap: columnGap !== undefined ? spacingScale[columnGap] : undefined,
          ...responsiveStyles,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// GRID ITEM COMPONENT
// =============================================================================

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span */
  colSpan?: number | 'full';
  
  /** Row span */
  rowSpan?: number;
  
  /** Column start */
  colStart?: number;
  
  /** Row start */
  rowStart?: number;
}

/**
 * Grid Item Component
 * 
 * @example
 * ```tsx
 * <Grid columns={3}>
 *   <GridItem colSpan={2}>Wide item</GridItem>
 *   <GridItem>Normal item</GridItem>
 * </Grid>
 * ```
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  function GridItem(
    {
      colSpan,
      rowSpan,
      colStart,
      rowStart,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    const getSpanClass = () => {
      if (colSpan === 'full') return 'col-span-full';
      if (colSpan) return `col-span-${colSpan}`;
      return '';
    };

    return (
      <div
        ref={ref}
        className={`
          ${getSpanClass()}
          ${rowSpan ? `row-span-${rowSpan}` : ''}
          ${colStart ? `col-start-${colStart}` : ''}
          ${rowStart ? `row-start-${rowStart}` : ''}
          ${className}
        `}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// BOX COMPONENT
// =============================================================================

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding */
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  
  /** Margin */
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  
  /** Background */
  bg?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'transparent';
  
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /** Shadow */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Border */
  border?: boolean;
  
  /** As element */
  as?: keyof JSX.IntrinsicElements;
}

const bgMap: Record<NonNullable<BoxProps['bg']>, string> = {
  primary: 'bg-[var(--color-bg-primary)]',
  secondary: 'bg-[var(--color-bg-secondary)]',
  tertiary: 'bg-[var(--color-bg-tertiary)]',
  accent: 'bg-[var(--color-brand-primary)]',
  transparent: 'bg-transparent',
};

const roundedMap: Record<NonNullable<BoxProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

const shadowMap: Record<NonNullable<BoxProps['shadow']>, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

/**
 * Box Component
 * 
 * @example
 * ```tsx
 * <Box p={4} bg="secondary" rounded="lg" shadow="md">
 *   Content
 * </Box>
 * ```
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>(
  function Box(
    {
      p, px, py, pt, pr, pb, pl,
      m, mx, my, mt, mr, mb, ml,
      bg,
      rounded,
      shadow,
      border = false,
      as: Component = 'div',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    const paddingStyle: CSSProperties = {};
    const marginStyle: CSSProperties = {};

    if (p !== undefined) paddingStyle.padding = spacingScale[p];
    if (px !== undefined) {
      paddingStyle.paddingLeft = spacingScale[px];
      paddingStyle.paddingRight = spacingScale[px];
    }
    if (py !== undefined) {
      paddingStyle.paddingTop = spacingScale[py];
      paddingStyle.paddingBottom = spacingScale[py];
    }
    if (pt !== undefined) paddingStyle.paddingTop = spacingScale[pt];
    if (pr !== undefined) paddingStyle.paddingRight = spacingScale[pr];
    if (pb !== undefined) paddingStyle.paddingBottom = spacingScale[pb];
    if (pl !== undefined) paddingStyle.paddingLeft = spacingScale[pl];

    if (m !== undefined) marginStyle.margin = spacingScale[m];
    if (mx !== undefined) {
      marginStyle.marginLeft = spacingScale[mx];
      marginStyle.marginRight = spacingScale[mx];
    }
    if (my !== undefined) {
      marginStyle.marginTop = spacingScale[my];
      marginStyle.marginBottom = spacingScale[my];
    }
    if (mt !== undefined) marginStyle.marginTop = spacingScale[mt];
    if (mr !== undefined) marginStyle.marginRight = spacingScale[mr];
    if (mb !== undefined) marginStyle.marginBottom = spacingScale[mb];
    if (ml !== undefined) marginStyle.marginLeft = spacingScale[ml];

    return (
      <Component
        ref={ref as any}
        className={`
          ${bg ? bgMap[bg] : ''}
          ${rounded ? roundedMap[rounded] : ''}
          ${shadow ? shadowMap[shadow] : ''}
          ${border ? 'border border-[var(--color-border-default)]' : ''}
          ${className}
        `}
        style={{
          ...paddingStyle,
          ...marginStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// =============================================================================
// DIVIDER COMPONENT
// =============================================================================

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Variant */
  variant?: 'solid' | 'dashed' | 'dotted';
  
  /** Color */
  color?: 'default' | 'subtle' | 'strong';
  
  /** With label */
  label?: React.ReactNode;
  
  /** Label position */
  labelPosition?: 'left' | 'center' | 'right';
  
  /** Spacing around */
  spacing?: SpacingValue;
}

/**
 * Divider Component
 * 
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="Or" />
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  function Divider(
    {
      orientation = 'horizontal',
      variant = 'solid',
      color = 'default',
      label,
      labelPosition = 'center',
      spacing = 4,
      className = '',
      style,
      ...props
    },
    ref
  ) {
    const colorMap: Record<NonNullable<DividerProps['color']>, string> = {
      default: 'border-[var(--color-border-default)]',
      subtle: 'border-[var(--color-border-subtle)]',
      strong: 'border-[var(--color-border-strong)]',
    };

    const variantMap: Record<NonNullable<DividerProps['variant']>, string> = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    if (label && orientation === 'horizontal') {
      return (
        <div
          className={`
            flex items-center
            ${className}
          `}
          style={{
            marginTop: spacingScale[spacing],
            marginBottom: spacingScale[spacing],
            ...style,
          }}
        >
          <div
            className={`
              flex-1 border-t
              ${colorMap[color]}
              ${variantMap[variant]}
              ${labelPosition === 'left' ? 'max-w-8' : ''}
              ${labelPosition === 'right' ? '' : ''}
            `}
          />
          <span className="px-3 text-sm text-[var(--color-text-tertiary)]">
            {label}
          </span>
          <div
            className={`
              flex-1 border-t
              ${colorMap[color]}
              ${variantMap[variant]}
              ${labelPosition === 'right' ? 'max-w-8' : ''}
              ${labelPosition === 'left' ? '' : ''}
            `}
          />
        </div>
      );
    }

    if (orientation === 'vertical') {
      return (
        <div
          ref={ref as any}
          role="separator"
          aria-orientation="vertical"
          className={`
            self-stretch border-l
            ${colorMap[color]}
            ${variantMap[variant]}
            ${className}
          `}
          style={{
            marginLeft: spacingScale[spacing],
            marginRight: spacingScale[spacing],
            ...style,
          }}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={`
          w-full border-t
          ${colorMap[color]}
          ${variantMap[variant]}
          ${className}
        `}
        style={{
          marginTop: spacingScale[spacing],
          marginBottom: spacingScale[spacing],
          ...style,
        }}
        {...props}
      />
    );
  }
);

// =============================================================================
// SPACER COMPONENT
// =============================================================================

export interface SpacerProps {
  /** Size (fixed) */
  size?: SpacingValue;
  
  /** Flex grow (auto-fill) */
  flex?: boolean;
}

/**
 * Spacer Component
 * 
 * @example
 * ```tsx
 * <HStack>
 *   <Logo />
 *   <Spacer /> {/* Takes up remaining space *\/}
 *   <NavLinks />
 * </HStack>
 * 
 * <VStack>
 *   <Item />
 *   <Spacer size={8} />
 *   <Item />
 * </VStack>
 * ```
 */
export function Spacer({ size, flex = true }: SpacerProps): JSX.Element {
  if (size !== undefined) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: spacingScale[size],
          height: spacingScale[size],
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={flex ? 'flex-1' : ''}
    />
  );
}

// =============================================================================
// CENTER COMPONENT
// =============================================================================

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Inline center */
  inline?: boolean;
}

/**
 * Center Component
 * 
 * @example
 * ```tsx
 * <Center>
 *   <Logo />
 * </Center>
 * ```
 */
export const Center = forwardRef<HTMLDivElement, CenterProps>(
  function Center({ inline = false, className = '', children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`
          ${inline ? 'inline-flex' : 'flex'}
          items-center justify-center
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  Container,
  Stack,
  VStack,
  HStack,
  Grid,
  GridItem,
  Box,
  Divider,
  Spacer,
  Center,
};
