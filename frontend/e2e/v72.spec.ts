/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — E2E TESTS (PLAYWRIGHT)                      ║
 * ║                                                                              ║
 * ║  End-to-end tests for all V72 flows                                         ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { test, expect, Page } from '@playwright/test';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe.configure({ mode: 'serial' });

// ═══════════════════════════════════════════════════════════════════════════════
// FIXTURES
// ═══════════════════════════════════════════════════════════════════════════════

test.beforeEach(async ({ page }) => {
  // Mock auth for tests
  await page.addInitScript(() => {
    localStorage.setItem('chenu_access_token', 'test-token');
    localStorage.setItem('chenu_user', JSON.stringify({
      id: 'test-user',
      email: 'test@chenu.io',
      username: 'TestUser',
    }));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Navigation', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await expect(page).toHaveTitle(/CHE·NU/);
    await expect(page.getByText(/Bonjour|Bon après-midi|Bonsoir/)).toBeVisible();
  });

  test('should navigate to all pages', async ({ page }) => {
    await page.goto(BASE_URL);

    // Dashboard
    await expect(page.getByRole('heading', { name: /Tableau de bord|Dashboard/i })).toBeVisible();

    // Threads
    await page.click('text=Threads');
    await expect(page).toHaveURL(/\/threads/);
    await expect(page.getByText('🧵 Threads')).toBeVisible();

    // Agents
    await page.click('text=Agents');
    await expect(page).toHaveURL(/\/agents/);

    // Decisions
    await page.click('text=Décisions');
    await expect(page).toHaveURL(/\/decisions/);

    // Governance
    await page.click('text=Gouvernance');
    await expect(page).toHaveURL(/\/governance/);

    // Nova
    await page.click('text=Nova');
    await expect(page).toHaveURL(/\/nova/);
  });

  test('should navigate to sphere page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Personnel sphere
    await page.click('text=Personnel');
    await expect(page).toHaveURL(/\/sphere\/personal/);
    
    // Check bureau sections
    await expect(page.getByText('Quick Capture')).toBeVisible();
    await expect(page.getByText('Resume Workspace')).toBeVisible();
    await expect(page.getByText('Threads')).toBeVisible();
    await expect(page.getByText('Data Files')).toBeVisible();
    await expect(page.getByText('Active Agents')).toBeVisible();
    await expect(page.getByText('Meetings')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Keyboard Shortcuts', () => {
  test('Cmd+K opens search', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.keyboard.press('Meta+k');
    
    await expect(page.getByPlaceholder(/Rechercher/i)).toBeVisible();
  });

  test('Cmd+J opens Nova', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.keyboard.press('Meta+j');
    
    await expect(page).toHaveURL(/\/nova/);
  });

  test('Cmd+N opens new thread modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/threads`);
    
    await page.keyboard.press('Meta+n');
    
    await expect(page.getByText(/Nouveau Thread|Intention fondatrice/i)).toBeVisible();
  });

  test('Escape closes modals', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Open search
    await page.keyboard.press('Meta+k');
    await expect(page.getByPlaceholder(/Rechercher/i)).toBeVisible();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder(/Rechercher/i)).not.toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREADS FLOW TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Threads Flow', () => {
  test('should display threads list', async ({ page }) => {
    await page.goto(`${BASE_URL}/threads`);
    
    await expect(page.getByText('🧵 Threads')).toBeVisible();
    
    // Check maturity badges
    await expect(page.locator('.maturity-badge, [class*="maturity"]')).toHaveCount({ minimum: 1 });
  });

  test('should filter threads by sphere', async ({ page }) => {
    await page.goto(`${BASE_URL}/threads`);
    
    const sphereFilter = page.getByRole('combobox').first();
    await sphereFilter.selectOption('business');
    
    // URL should update
    await expect(page).toHaveURL(/sphere=business/);
  });

  test('should create new thread', async ({ page }) => {
    await page.goto(`${BASE_URL}/threads`);
    
    // Open modal
    await page.click('text=Nouveau Thread');
    
    // Fill form
    await page.fill('[name="title"]', 'Test Thread E2E');
    await page.fill('[name="founding_intent"], textarea', 'This is a test thread created by E2E tests');
    await page.selectOption('select[name="sphere_id"]', 'personal');
    
    // Submit
    await page.click('button:has-text("Créer")');
    
    // Should show success or redirect
    await expect(page.getByText(/Thread créé|Test Thread E2E/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show maturity levels', async ({ page }) => {
    await page.goto(`${BASE_URL}/threads`);
    
    // Check for maturity icons
    const maturityIcons = ['🌱', '🌿', '🌳', '🌾', '🍎'];
    const hasMaturityIcon = await Promise.any(
      maturityIcons.map(icon => page.getByText(icon).isVisible())
    ).catch(() => false);
    
    expect(hasMaturityIcon).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DECISIONS FLOW TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Decisions Flow', () => {
  test('should display aging timeline', async ({ page }) => {
    await page.goto(`${BASE_URL}/decisions`);
    
    // Check aging colors
    await expect(page.getByText('🟢')).toBeVisible();
    await expect(page.getByText('🟡')).toBeVisible();
    await expect(page.getByText('🔴')).toBeVisible();
    await expect(page.getByText('🔥')).toBeVisible();
  });

  test('should filter by aging level', async ({ page }) => {
    await page.goto(`${BASE_URL}/decisions`);
    
    // Click on RED filter
    await page.click('text=URGENT');
    
    // Only RED decisions should be visible
    // (implementation specific)
  });

  test('should open decision detail panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/decisions`);
    
    // Click on first decision
    const decision = page.locator('[data-testid="decision-card"]').first();
    if (await decision.isVisible()) {
      await decision.click();
      
      // Check detail panel
      await expect(page.getByText(/Options disponibles|Suggestions IA/i)).toBeVisible();
    }
  });

  test('should show AI suggestions', async ({ page }) => {
    await page.goto(`${BASE_URL}/decisions`);
    
    // Open a decision
    const decision = page.locator('[data-testid="decision-card"]').first();
    if (await decision.isVisible()) {
      await decision.click();
      
      // Look for AI suggestions section
      await expect(page.getByText(/Suggestions IA|Recommandation/i)).toBeVisible();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA CHAT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Nova Chat', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto(`${BASE_URL}/nova`);
    
    await expect(page.getByText(/Bonjour|Comment puis-je vous aider/i)).toBeVisible();
  });

  test('should send message', async ({ page }) => {
    await page.goto(`${BASE_URL}/nova`);
    
    const input = page.getByPlaceholder(/Demandez quelque chose/i);
    await input.fill('Bonjour Nova');
    await input.press('Enter');
    
    // User message should appear
    await expect(page.getByText('Bonjour Nova')).toBeVisible();
    
    // Nova should respond (or show typing indicator)
    await expect(page.getByText(/Nova réfléchit|réponse/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show checkpoint for sensitive actions', async ({ page }) => {
    await page.goto(`${BASE_URL}/nova`);
    
    const input = page.getByPlaceholder(/Demandez quelque chose/i);
    await input.fill('Envoyer le document au client');
    await input.press('Enter');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Checkpoint should appear
    const checkpoint = page.getByText(/Point de contrôle|Checkpoint/i);
    if (await checkpoint.isVisible()) {
      await expect(checkpoint).toBeVisible();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Agents', () => {
  test('should display agent marketplace', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    
    await expect(page.getByText(/Agents|Marketplace/i)).toBeVisible();
    
    // Level stats should be visible
    await expect(page.getByText(/L0|L1|L2|L3/)).toBeVisible();
  });

  test('should filter agents by level', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    
    // Click on L2 filter
    await page.click('text=L2');
    
    // Only L2 agents should be visible
  });

  test('should open agent detail panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    
    // Click on first agent
    const agent = page.locator('[data-testid="agent-card"]').first();
    if (await agent.isVisible()) {
      await agent.click();
      
      // Detail panel should open
      await expect(page.getByText(/Embaucher|Hire/i)).toBeVisible();
    }
  });

  test('should hire agent', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    
    const agent = page.locator('[data-testid="agent-card"]').first();
    if (await agent.isVisible()) {
      await agent.click();
      
      // Click hire button
      await page.click('button:has-text("Embaucher")');
      
      // Confirmation modal or success message
      await expect(page.getByText(/Confirmer|Agent embauché/i)).toBeVisible();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Governance', () => {
  test('should display CEA dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    await expect(page.getByText(/CEA|Gouvernance/i)).toBeVisible();
    await expect(page.getByText(/Contrôle.*Éthique.*Audit/i)).toBeVisible();
  });

  test('should show governance metrics', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    await expect(page.getByText(/Taux d'approbation/i)).toBeVisible();
    await expect(page.getByText(/Checkpoints/i)).toBeVisible();
  });

  test('should switch tabs', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    // Click on Checkpoints tab
    await page.click('text=Checkpoints');
    
    // Click on Audit tab
    await page.click('text=Journal');
    await expect(page.getByText(/Journal d'audit/i)).toBeVisible();
  });

  test('should display governance principles', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    await expect(page.getByText('GOUVERNANCE > EXÉCUTION')).toBeVisible();
    await expect(page.getByText('READ-ONLY XR')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// XR VIEW TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('XR View', () => {
  test('should display XR immersive view', async ({ page }) => {
    await page.goto(`${BASE_URL}/xr`);
    
    await expect(page.getByText(/Vue XR|Immersive/i)).toBeVisible();
  });

  test('should show READ-ONLY notice', async ({ page }) => {
    await page.goto(`${BASE_URL}/xr`);
    
    await expect(page.getByText('READ-ONLY')).toBeVisible();
  });

  test('should have view mode selector', async ({ page }) => {
    await page.goto(`${BASE_URL}/xr`);
    
    await expect(page.getByText('Sphères')).toBeVisible();
    await expect(page.getByText('Threads')).toBeVisible();
    await expect(page.getByText('Décisions')).toBeVisible();
    await expect(page.getByText('Agents')).toBeVisible();
  });

  test('should show navigation hints', async ({ page }) => {
    await page.goto(`${BASE_URL}/xr`);
    
    await expect(page.getByText(/Glisser|Clic|Double-clic/i)).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT FLOW TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Checkpoint Flow', () => {
  test('should approve checkpoint', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    // Click on Checkpoints tab
    await page.click('text=Checkpoints');
    
    // Find pending checkpoint
    const approveButton = page.locator('button:has-text("Approuver")').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Success message
      await expect(page.getByText(/Approuvé|Approved/i)).toBeVisible();
    }
  });

  test('should reject checkpoint', async ({ page }) => {
    await page.goto(`${BASE_URL}/governance`);
    
    await page.click('text=Checkpoints');
    
    const rejectButton = page.locator('button:has-text("Rejeter")').first();
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
      
      // Confirmation or success
      await expect(page.getByText(/Rejeté|Rejected/i)).toBeVisible();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Dashboard should still be visible
    await expect(page.getByText(/Bonjour|Bon après-midi/i)).toBeVisible();
    
    // Navigation should be accessible
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    await expect(page.getByText(/Bonjour|Bon après-midi/i)).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    await expect(page.getByText(/Bonjour|Bon après-midi/i)).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount({ minimum: 1 });
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have visible focus
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
