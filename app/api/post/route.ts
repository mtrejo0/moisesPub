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

const sendProjectOfDay = async () => {
  const projectData = await axios.get(
    "https://raw.githubusercontent.com/mtrejo0/moisestrejo.com/master/src/information/p5jsProjects.json",
  );
  const projects = projectData.data;

  // Generate a random index instead of using getDayOfYear
  const projectIndex = Math.floor(Math.random() * projects.length);
  const project = projects[projectIndex];

  project.date = new Date().toDateString();
  project.link = `https://moisestrejo.com/${project.id}`;
  const message = `
${project.name}
${project.description.join(" ")}

${project.link}

#${project.id} #p5js #generativeart #moisestrejo

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
const sendExternalApp = async () => {
  const externalAppData = await axios.get(
    "https://raw.githubusercontent.com/mtrejo0/moisestrejo.com/master/src/information/externalApps.json",
  );
  const externalApps = externalAppData.data;

  const appIndex = Math.floor(Math.random() * externalApps.length);
  const app = externalApps[appIndex];

  app.date = new Date().toDateString();
  const message = `
${app.name}
${app.description}

moisestrejo.com/${app.id}

Built with: ${app.resources}

#${app.id} #app #showcase #moisestrejo

${app.date}

${app.video && `https://www.youtube.com/watch?v=${app.video}`}
  `;

  revalidateTag("posts");

  const res = await twitterClient.v2.tweet(message);

  return res;
}

export async function GET(req: Request) {
  try {
    await sendProjectOfDay();
    await sendExternalApp();

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