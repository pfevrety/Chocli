import puppeteer from "puppeteer";

export interface Istore {}

export class Store implements Store {
  page: puppeteer.Page | undefined;
  constructor() {
    this.setup();
  }

  async setup(): Promise<void> {
    const browser = await puppeteer.launch();
    this.page = await browser.newPage();
  }

  async getTopPackage(): Promise<any> {
    const page = await this.page?.goto("https://community.chocolatey.org/packages");

    return page;
  }
}
