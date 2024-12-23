import { type FC, type PropsWithChildren } from "react";
import puppeteer, { type Browser } from "puppeteer";

// 声明全局的类型
declare global {
  namespace globalThis {
    var browser: Browser;
    // 请求次数
    var requestCount: number
  }

  type ReactFC<T = {}> = React.FC<PropsWithChildren<T>>;
}

export {};
