import { test, expect } from '@playwright/test';

test('portfolio presents the supplied AI profile and all CV sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Kamal Abrar.', exact: true })).toBeVisible();
  await expect(page.getByText('AI Engineer & IT Developer', { exact: true })).toBeVisible();
  for (const id of ['about', 'skills', 'projects', 'playground', 'experience', 'community', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByText('3.64', { exact: true })).toBeVisible();
  await expect(page.getByText('English · Intermediate')).toBeVisible();
  await expect(page.getByText('Spanish · Basic')).toBeVisible();
  await expect(page.getByRole('link', { name: /Visit UPJ Chatbot/ })).toHaveAttribute('href', 'https://chatbot.upjhub.com/');
  await expect(page.getByRole('link', { name: /Visit NusaQuest/ })).toHaveAttribute('href', 'https://nusaquest.com/home');
  await expect(page.getByRole('link', { name: /Visit HIMA SIF/ })).toHaveAttribute('href', 'https://himasif.org/');
  await expect(page.getByRole('link', { name: /Visit UPJ SIF/ })).toHaveAttribute('href', 'https://upj-sif.com/mainpage');
});

test('mini game opens on demand with canvas and touch controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Play shooter/ })).toBeVisible();
  await page.getByRole('button', { name: /Play shooter/ }).click();
  await expect(page.locator('#playground')).toBeVisible();
  await expect(page.locator('#playground canvas')).toBeVisible();
  await expect(page.getByTestId('best-score')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move fighter up' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move fighter down' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fire weapons' })).toBeVisible();
  await page.getByRole('button', { name: 'Fire weapons' }).click();
  await expect(page.getByTestId('score')).toHaveText('0');
  await expect(page.getByTestId('lives')).toHaveText('3 / 3');
});
