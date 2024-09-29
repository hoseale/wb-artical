export default function Home() {
  const apis = [
    {
      name: "头条频道文章列表",
      path: "/api/toutiao/listFeed",
      method: "GET",
      query: (
        <div>
          <div>channel_id: 频道id 例如军事：3189398960</div>
          <div>max_behot_time: 文章时间，例如：1724137391</div>
        </div>
      ),
      response: <div>data: 文章列表数据</div>,
      test: "/api/toutiao/listFeed?channel_id=3189398960&max_behot_time=1724137391",
    },
    {
      name: "头条文章详情",
      path: "/api/toutiao/detail",
      method: "GET",
      query: (
        <div>
          <div>id: 文章id,例如：7403926506739417640</div>
        </div>
      ),
      response: <div>html</div>,
      test: "/api/toutiao/detail?id=7403926506739417640",
    },
    {
      name: "头条文章详情json",
      path: "/api/toutiao/detailJson",
      method: "GET",
      query: (
        <div>
          <div>id: 文章id,例如：7403926506739417640</div>
        </div>
      ),
      response: <div>html + css</div>,
      test: "/api/toutiao/detailJson?id=7403926506739417640",
    },
    {
      name: "用户文章列表",
      path: "/api/toutiao/userArtical",
      method: "GET",
      query: (
        <div>
          <div>userToken: 用户token</div>
          <div>isToday: 是否是今天文章，true是, (不传时为全部文章，结合max_behot_time用)</div>
          <div>max_behot_time: 最大时间，不传或者传0为当前时间最新文章 例如：1724137391</div>
        </div>
      ),
      response: <div>传了isToday返回列表，不传返回分页形式。read_count阅读量 comment_count评论量 发布时间publish_time 等</div>,
      test: "/api/toutiao/userArtical?userToken=MS4wLjABAAAA61L7UigS1t1gDwhOqkAzjO4mkeZaKmL_khO5RDxkAItwuxxgyWTm7L92Lsx5dSwi",
    },
  ];
  return (
    <main className="flex min-h-screen flex-col p-24">
      {apis.map((api, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold">{api.name}</h2>
          <div className="text-blue-500">{api.path}</div>
          <div>
            <span className="font-bold">请求方法</span>
            <span className="ml-2">{api.method}</span>
          </div>
          <div className="font-bold">请求参数</div>
          {api.query}
          <div className="font-bold">返回数据</div>
          {api.response}
          <div className="font-bold">例子</div>

          <a href={api.test} className="text-gray-500" target="_blank">
            {api.test}
          </a>
        </div>
      ))}
    </main>
  );
}
