const HOME_URL = 'http://localhost:5173/';

const searchCharacter = async (name: string) => {
  const searchInput = await page.waitForSelector('input[placeholder="Search character name"]');
  await searchInput.type(name);
};

const selectCharacter = async (id: number) => {
  const characterElement = await page.waitForSelector(`[data-test-id="character-select-${id}"]`);
  await characterElement.click();
};

const selectResident = async (id: number, type: 'origin' | 'location') => {
  const residentElement = await page.waitForSelector(`[data-test-id="${type}-resident-${id}"]`);
  await residentElement.click();
};

const assertSelectedCharacterName = async (name: string) => {
  const selectedCharacterNameElement = await page.waitForSelector('[data-test-id="selected-character-name"]');
  await expect(await (await selectedCharacterNameElement.getProperty('textContent')).jsonValue()).toBe(name);
};

describe('Home Page', () => {
  beforeEach(async () => {
    await page.goto(HOME_URL);
  });

  it('should be titled "Rick and Morty Character Viewer"', async () => {
    await expect(page.title()).resolves.toMatch('Rick and Morty Character Viewer');
  });

  it('should be able to select characters', async () => {
    await selectCharacter(2);
    await expect(page.url()).toBe(`${HOME_URL}?selected=2`);
    await assertSelectedCharacterName('Morty Smith');
  });

  it('should be able to search characters', async () => {
    await searchCharacter('meeseeks');
    await selectCharacter(242);
    await expect(page.url()).toBe(`${HOME_URL}?query=meeseeks&page=1&selected=242`);
    await assertSelectedCharacterName('Mr. Meeseeks');
  });

  it('should be able to select characters from origin residents', async () => {
    await searchCharacter('poopy');
    await selectCharacter(635);
    await selectResident(625, 'origin');
    await expect(page.url()).toBe(`${HOME_URL}?query=poopy&page=1&selected=625`);
    await assertSelectedCharacterName('Storylord');
  });

  it('should be able to select characters from location residents', async () => {
    await searchCharacter('john');
    await selectCharacter(183);
    await selectResident(91, 'location');
    await expect(page.url()).toBe(`${HOME_URL}?query=john&page=1&selected=91`);
    await assertSelectedCharacterName('David Letterman');
  });

  it('should be able to view episode tooltip', async () => {
    const episodeTextElement = await page.waitForSelector('[data-test-id="episode-text-S01E03"]');
    await episodeTextElement.hover();
    const episodeTooltipElement = await page.waitForSelector('[data-test-id="episode-tooltip-S01E03"]');
    await expect(await (await episodeTooltipElement.getProperty('textContent')).jsonValue()).toBe('S01E03');
  });

  it('should be able to go to first page', async () => {
    await page.goto(`${HOME_URL}?page=10`);
    const buttonElement = await page.waitForSelector('[data-test-id="first-page-button"]:not([disabled])');
    await buttonElement.click();
    await expect(page.url()).toBe(`${HOME_URL}?page=1`);
  });

  it('should be able to go to previous page', async () => {
    await page.goto(`${HOME_URL}?page=10`);
    const buttonElement = await page.waitForSelector('[data-test-id="previous-page-button"]:not([disabled])');
    await buttonElement.click();
    await expect(page.url()).toBe(`${HOME_URL}?page=9`);
  });

  it('should be able to go to next page', async () => {
    await page.goto(`${HOME_URL}?page=10`);
    const buttonElement = await page.waitForSelector('[data-test-id="next-page-button"]:not([disabled])');
    await buttonElement.click();
    await expect(page.url()).toBe(`${HOME_URL}?page=11`);
  });

  it('should be able to go to last page', async () => {
    await page.goto(`${HOME_URL}?page=10`);
    const buttonElement = await page.waitForSelector('[data-test-id="last-page-button"]:not([disabled])');
    await buttonElement.click();
    await expect(page.url()).toBe(`${HOME_URL}?page=42`);
  });
});