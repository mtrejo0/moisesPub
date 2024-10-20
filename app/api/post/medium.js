export const sendMediumArticle = async () => { 
  
  const articles = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@moises.trejo0"
  )
    .then((res) => res.json())
    .then(async (data: any) => {
      
     return data.items

    });
    const articleIndex = getDayOfYear() % articles.length;
    const article = articles[articleIndex];
  
    const timestamp = new Date().toDateString();
    const message = `One of my medium articles:

${article.title}

${article.link}

#medium #writing

${timestamp}`;
  
    const res = await twitterClient.v2.tweet(message);
    console.log(res);
  
}