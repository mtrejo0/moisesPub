import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import { revalidateTag } from "next/cache";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_SECRET ?? "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
  accessSecret: process.env.TWITTER_TOKEN_SECRET ?? "",
});




const sendRandomTrack = async () => { 


  const tracks = [
    {
      "name": "Discoteca",
      "link": "https://open.spotify.com/track/5z5v5S83TnXCDRFVuz9A37?si=c027e79a1e5f4d7f"
    },
    {
      "name": "Fly High",
      "link": "https://open.spotify.com/track/1rPR4fhHszuxEsXJlWgEAM?si=a2577f32e3414ab1"
    }
  ]

  const track = tracks[Math.floor(Math.random() * tracks.length)]
  console.log(track)

  const message = `I also make music ;)\n\n${track.name}\n${track.link}`


  const res = await twitterClient.v2.tweet(message);

  console.log(res)

  
}



export async function GET(req: Request) {
  try {
    console.log("Starting Twitter API client initialization.");

    const projectData = await axios.get(
      "https://raw.githubusercontent.com/mtrejo0/moisestrejo.com/master/src/information/p5jsProjects.json",
    );
    const projects = projectData.data;

    // Select a random project from the list
    const randomProject = projects[Math.floor(Math.random() * projects.length)];

    // Add the current date to the project data
    randomProject.date = new Date().toISOString();

    randomProject.link = `https://moisestrejo.com/${randomProject.id}`;
    const message = `
${randomProject.name}
${randomProject.description.join(" ")}

${randomProject.link}
${randomProject.date}
        `;

    revalidateTag("posts");

    let gifURL = randomProject.href;
    const id = gifURL.split("embed/")[1];

    gifURL = `https://media4.giphy.com/media/${id}/giphy.gif`;

    // Upload the GIF
    const mediaData = await axios.get(gifURL, { responseType: "arraybuffer" });
    const gifBuffer = Buffer.from(mediaData.data);
    

    const mediaUpload = await twitterClient.v1.uploadMedia(Buffer.from(gifBuffer.buffer), {
      mimeType: "image/gif",
    });

    // Tweet with the GIF media IDs
    const res = await twitterClient.v2.tweet(message, {
      media: { media_ids: [mediaUpload] },
    });

    await sendRandomTrack()
    return new Response(JSON.stringify({ message: "Yay", res }), {
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
