import puppeteer, { Browser } from "puppeteer";
import UserAgent from "user-agents";
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// 获取浏览器对象
export default async function getBrowser(force?: boolean): Promise<Browser> {
  if (!force && globalThis.browser) {
    return globalThis.browser;
  } else {
    // puppeteer.use(StealthPlugin());
    if (globalThis.browser) {
      await globalThis.browser.close();
    }
    globalThis.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return globalThis.browser;
  }
}

const MAX_REQUESTS = 400; // 设置最大请求次数

// 获取行新的页面
export async function getNewPage() {
  // 超过MAX_REQUESTS，重新创建浏览器
  const reload =
    !!globalThis.requestCount && globalThis.requestCount > MAX_REQUESTS;
    
  if (reload) {
    globalThis.requestCount = 0;
  }

  let browser = await getBrowser(reload);

  globalThis.requestCount = (globalThis.requestCount || 0) + 1;

  const str = genUserAgent();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(str);
    return page;
  } catch (error) {
    browser = await getBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(str);
    return page;
  }
}

export function genUserAgent() {
  const PC = ["Win32", "MacIntel"];
  // 随机取一个
  const os = PC[Math.floor(Math.random() * PC.length)];
  const userAgent = new UserAgent({ platform: os });
  return userAgent.toString();
}
