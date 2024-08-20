import { type NextRequest } from "next/server";
import {getNewPage} from "@/utils/browser";
import queryParams from "@/utils/queryParams";
import * as yup from "yup";

type Props = {
  // 频道
  channel_id: string;
  // 最大时间
  max_behot_time: string;
};

const schema = yup.object({
  channel_id: yup.string().required(),
  max_behot_time: yup.string().required(),
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

  const page = await getNewPage()

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      const ls = ["api/pc/list/feed", "sdk-glue.js", "bdms.js"];
      if (ls.find((item) => req.url().includes(item))) {
        req.continue();
      } else {
        req.abort();
      }
    }
  });

  await page.goto(`https://www.toutiao.com`), { waitUntil: "networkidle2" };

  const result = await page.evaluate(async (data: Props) => {
    return new Promise((resolve) => {
      const param = {
        channel_id: data.channel_id,
        max_behot_time: data.max_behot_time,
        offset: "0",
        category: "pc_profile_channel",
        client_extra_params: `{"short_video_item":"filter"}`,
        aid: "24",
        app_name: "toutiao_web",
      };

      fetch(
        `https://www.toutiao.com/api/pc/list/feed?` +
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

  return Response.json({
    status: 0,
    result: result
  });
}
