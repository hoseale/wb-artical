import { type NextRequest } from "next/server";
import { getNewPage } from "@/utils/browser";
import queryParams from "@/utils/queryParams";
import * as yup from "yup";

type Props = {
  // 文章id
  id: string;
};

const schema = yup.object({
  id: yup.string().required(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = queryParams<Props>(searchParams);
  try {
    await schema.validate(query);
  } catch (error: any) {
    return Response.json({
      status: -1,
      errorMessage: error.message,
    });
  }

  const page = await getNewPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      // const ls = ["api/pc/list/feed", "sdk-glue.js", "bdms.js"];
      // if (ls.find((item) => req.url().includes(item))) {
      //   req.continue();
      // } else {
      //   req.abort();
      // }
      req.abort();
    }
  });

  await page.goto(`https://www.toutiao.com/article/${query.id}`),
    { waitUntil: "networkidle2" };

  const result = await page.evaluate(async () => {
    let links:any = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    links = links.map((link:any) => link.href);

    const videoBox = document.getElementsByClassName("tt-video-box");
    const len = videoBox.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        videoBox[i].setAttribute('class', 'tt-video-box xgplayer')
      }
    }
    
    return {
      content: document.getElementsByClassName("article-content")[0].outerHTML,
      css: links,
    };
  }, query);

  return Response.json({
    status: 0,
    result: {
      html: `${result.content}`,
      css: result.css
    },
  });
  
}
