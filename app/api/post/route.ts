import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import { revalidateTag } from "next/cache";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_SECRET ?? "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
  accessSecret: process.env.TWITTER_TOKEN_SECRET ?? "",
});

const getDayOfYear = () => Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

const sendTrackOfDay = async () => { 
  const tracks = [
    {
      "name": "Discoteca",
      "link": "https://open.spotify.com/track/5z5v5S83TnXCDRFVuz9A37?si=c027e79a1e5f4d7f"
    },
    {
      "name": "Fly High",
      "link": "https://open.spotify.com/track/1rPR4fhHszuxEsXJlWgEAM?si=a2577f32e3414ab1"
    },
    {
      "name": "GPT Beat",
      "link": "https://open.spotify.com/track/2YRVX4lWQYSdDEbuUgJCXb?si=fcf4ce1e7ec34121"
    },
    {
      "name": "Moises Again ...",
      "link": "https://open.spotify.com/track/3Q7y3wKLbGgu0V4BcSET1b?si=ef08402e48c94474"
    },
    {
      "name": "Angles - 128 BPM",
      "link": "https://open.spotify.com/track/4fydAE1pCOpWSlF6cHCafM?si=80c99c5af3dd4d8c"
    },
    {
      "name": "el techno",
      "link": "https://open.spotify.com/track/7K8AV1gm5UgUr5kL8LKneJ?si=d7d9cd9639c041df"
    },
    {
      "name": "Tsunami",
      "link": "https://open.spotify.com/track/5unxnWzikVXeuYdjPkEk98?si=7096e21525014a3a"
    },
    {
      "name": "Triggered",
      "link": "https://open.spotify.com/track/3MrdQROwqElVgSaESuuIGW?si=d85c138577de4666"
    },
    {
      "name": "Floating - 125 BPM",
      "link": "https://open.spotify.com/track/4m05p0A2nQA5XX3OTbe5LX?si=efc45b73af544e33"
    }
  ];

  const trackIndex = getDayOfYear() % tracks.length;
  const track = tracks[trackIndex];
  console.log(track);

  const message = `I also make music ;)\n\n${track.link}`;

  const res = await twitterClient.v2.tweet(message);
  console.log(res);
}

const sendMediumArticle = async () => { 
  
  const articles = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@moises.trejo0"
  )
    .then((res) => res.json())
    .then(async (data: any) => {
      
     return data.items

    });
    console.log(articles)

    const articleIndex = getDayOfYear() % articles.length;
    const article = articles[articleIndex];
  
    const timestamp = new Date().toDateString();
    const message = `One of my medium articles:\n\n${article.title}\n\n${article.link}\n\n${timestamp}`;
  
    const res = await twitterClient.v2.tweet(message);
    console.log(res);
  
}

const sendProjectOfDay = async () => {
  const projectData = await axios.get(
    "https://raw.githubusercontent.com/mtrejo0/moisestrejo.com/master/src/information/p5jsProjects.json",
  );
  const projects = projectData.data;

  const projectIndex = getDayOfYear() % projects.length;
  const project = projects[projectIndex];

  project.date = new Date().toDateString();
  project.link = `https://moisestrejo.com/${project.id}`;
  const message = `
${project.name}
${project.description.join(" ")}

${project.link}
${project.date}
  `;

  revalidateTag("posts");

  let gifURL = project.href;
  const id = gifURL?.split("embed/")[1];
  gifURL = `https://media4.giphy.com/media/${id}/giphy.gif`;

  const mediaData = await axios.get(gifURL, { responseType: "arraybuffer" });
  const gifBuffer = Buffer.from(mediaData.data);

  const mediaUpload = await twitterClient.v1.uploadMedia(Buffer.from(gifBuffer.buffer), {
    mimeType: "image/gif",
  });

  const res = await twitterClient.v2.tweet(message, {
    media: { media_ids: [mediaUpload] },
  });

  return res;
}

export async function GET(req: Request) {
  try {

    await sendProjectOfDay();

    const r = await sendMediumArticle();
    console.log(r)
    return new Response(JSON.stringify({ message: "Yay" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    return new Response(
      JSON.stringify({ msg: "Failed to retrieve user data" }),
      { status: 500 },
    );
  }
}
