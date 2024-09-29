import { type NextRequest } from "next/server";
import {getNewPage} from "@/utils/browser";
import queryParams from "@/utils/queryParams";
import * as yup from "yup";
import dayjs from "dayjs";

type Props = {
  // 用户token
  userToken: string;
  // 是否是今日文章
  isToday: string;
  // 最大时间
  max_behot_time: string;
};

const schema = yup.object({
  userToken: yup.string().required(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = queryParams<Props>(searchParams);
  try {
    await schema.validate(query);
  } catch (error:any) {
    return Response.json({
      status: -1,
      errorMessage: error.message,
    });
  }

  // 今日文章
  if (query.isToday == 'true') {
    query.max_behot_time = '0'
  }

  const page = await getNewPage()

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      const ls = ["api/pc/list/user/feed", "sdk-glue.js", "bdms.js"];
      if (ls.find((item) => req.url().includes(item))) {
        req.continue();
      } else {
        req.abort();
      }
    }
  });

  await page.goto(`https://www.toutiao.com`), { waitUntil: "networkidle2" };

  let result:any = await page.evaluate(async (data: Props) => {
    return new Promise((resolve) => {
      const param = {
        category: "pc_profile_article",
        token: data.userToken,
        max_behot_time: data.max_behot_time || "0",
        aid: "24",
        app_name: "toutiao_web",
      };

      fetch(
        `https://www.toutiao.com/api/pc/list/user/feed?` +
          new URLSearchParams(param).toString(),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          resolve(JSON.stringify(error));
        });
    });
  }, query);

  page.close();

  // 今日文章
  if (query.isToday == 'true') {
    const list = result.data || [];
    // 过滤出今天发布的文章的文章，文章发布时间字段为publish_time:1727579868
    const todayList = list.filter((item:any) => {
      return dayjs(item.publish_time * 1000).isSame(dayjs(), "day");
    });
    result = todayList;
  }

  return Response.json({
    status: 0,
    result: result
  });
}
