import { MemorySequencePage } from './app.po';

describe('memory-sequence App', () => {
  let page: MemorySequencePage;

  beforeEach(() => {
    page = new MemorySequencePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
